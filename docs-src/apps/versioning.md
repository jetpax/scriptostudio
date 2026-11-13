# App versioning

Bump the version in an App's `extension.json` whenever you change it. ScriptoHub and Studio use it to decide whether an update is available.

## Format

A version is an array of three numbers, `[major, minor, patch]`:

```json
"version": [1, 2, 0]
```

## Before you publish

- [ ] Bump `version` in `extension.json`.
- [ ] Test the App with the change.
- [ ] Commit the code and the version bump together.

Use a patch bump for a fix and a minor bump for a feature.

## Why it matters

- The App library shows **Update available** when ScriptoHub has a newer version than the one installed.
- The board records the installed version in `/lib/ext/registry.json`.
- Without a bump, browsers keep running the code they've already stored.
