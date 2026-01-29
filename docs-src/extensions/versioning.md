# Extension Versioning Guide

## When to Bump Extension Versions

**Always bump the version number in extension JavaScript files when making changes** so that the registry properly updates and users get the new version.

## Version Format

Extensions use semantic versioning in the format: `[major, minor, patch]`

Example:
```javascript
//   "version": [1, 2, 0],
```

## Checklist Before Committing Extension Changes

- [ ] Update version number in extension JS file (e.g., `GVRET.js`)
- [ ] Test the extension works with the new changes
- [ ] Commit both the code changes AND the version bump

## Examples

- **GVRET.js**: Bumped from `[1, 1, 0]` to `[1, 2, 0]` when refactoring to use shared CAN bus infrastructure
- **Other extensions**: Follow the same pattern

## Why This Matters

The registry uses version numbers to:
- Track which version users have installed
- Determine if updates are available
- Cache-bust browser-side code
- Ensure users get the latest functionality

**Without version bumps, users may continue using cached old code even after updates are deployed.**
