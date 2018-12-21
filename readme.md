<div align="center">
<a href="https://github.com/pomber/code-surfer/pull/48#issuecomment-449500936">
<img alt="demo" src="https://user-images.githubusercontent.com/1911623/50364326-5c8f6480-054e-11e9-8b48-1f8f070e3c87.png" />
</a>
</div>

I made this package so I can see the snapshots tests that failed in a travis build.  
Currently it handles only a very specific use case: failed [cypress-image-snapshot](https://github.com/palmerhq/cypress-image-snapshot) tests in travis (probably [jest-image-snapshot](https://github.com/americanexpress/jest-image-snapshot) too). But I want to add more features, so send an issue or a PR if you want to use it for something else or need more customization.

> Follow [@pomber](https://twitter.com/pomber) for updates

## Usage

1. Install it:

```bash
$ yarn add --dev fail-to-pr
```

2. Wrap your test script in package.json:

```diff
-    "cy:run": "cypress run",
+    "cy:run": "fail-to-pr cypress run",
```

3. Create a [GitHub token](https://github.com/settings/tokens) (with `repo` scope)

4. Add the token as "GH_TOKEN" [env var in travis](https://docs.travis-ci.com/user/environment-variables/#defining-variables-in-repository-settings) (make sure to leave the "Display value in build log" disabled)

## License

Released under MIT license.
