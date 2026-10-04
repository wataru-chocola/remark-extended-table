# Releasing

Each package under `packages/` is versioned and published independently.
Publishing runs in GitHub Actions (`.github/workflows/npm-publish.yml`) with npm trusted publishing, so no npm token is needed.

1. Open a PR that bumps `version` in `packages/<name>/package.json`, and merge it.
2. Create a GitHub Release whose tag is `<name>@<version>` (e.g. `mdast-util-extended-table@2.0.4`), targeting `main`.
   Write the changes in the release notes.
3. The workflow publishes only the package named by the tag, after checking that the tag matches its `package.json`.

Workspace dependencies (`workspace:^`) are replaced with the dependency's current version on publish.
When releasing several packages, release dependencies first:
`micromark-extension-extended-table` → `mdast-util-extended-table` → `remark-extended-table`.

Trusted publishing is registered per package on npm:

```sh
npm trust github <name> --file npm-publish.yml --repo wataru-chocola/remark-extended-table --allow-publish
```
