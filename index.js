#!/usr/bin/env node

const fetch = require("node-fetch");
const imgur = require("imgur");
const glob = require("glob");
const execa = require("execa");

const repo = process.env.TRAVIS_REPO_SLUG;
const pr = process.env.TRAVIS_PULL_REQUEST;
const token = process.env.GH_TOKEN;

function postComment(comment) {
  return fetch(`https://api.github.com/repos/${repo}/issues/${pr}/comments`, {
    method: "POST",
    body: JSON.stringify({ body: comment }),
    headers: { Authorization: `token ${token}` }
  })
    .then(res => res.json())
    .then(json => console.log(`[test-output-to-pr] Posted`))
    .catch(e => console.error(`[test-output-to-pr] Failed`, e));
}

function postImages(cb) {
  const path = "cypress/snapshots/*/__diff_output__/*.diff.png";
  console.log(
    `[test-output-to-pr] Posting images from ${path} to ${repo}#${pr}`
  );
  glob(path, (err, files) => {
    if (files.length === 0) {
      cb();
      return;
    }
    imgur
      .uploadImages(files, "File")
      .then(uploads => uploads.map(upload => upload.link))
      .then(links => {
        const lines = links.map(link => `![diff](${link})`);
        const comment = [
          "### Failed Snapshots",
          ...lines,
          `> Automatically posted from [this build](${
            process.env.TRAVIS_BUILD_WEB_URL
          }) with [fail-to-pr](https://github.com/pomber/fail-to-pr)`
        ].join("\n\n");
        postComment(comment).then(cb);
      })
      .catch(e => console.error(`[test-output-to-pr] Upload failed`, e));
  });
}

function run(args) {
  // const test = execa("npm", ["run", test], { stdio: "inherit" });
  return execa("yarn", [...args], { stdio: "inherit" })
    .then(x => console.log("then: ", x))
    .catch(e => {
      console.log("catch: ", e, e.code);
      if (!repo || !pr) {
        process.exit(e.code);
      }

      postImages(() => {
        process.exit(e.code);
      });
    });
}

/*
TODO:
- warn if there is no GH_TOKEN, then do nothing
 */

const args = process.argv.slice(2);
run(args);
