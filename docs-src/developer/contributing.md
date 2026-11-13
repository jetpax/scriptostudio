# Contributing

Thanks for considering a contribution to ScriptO Studio.

## Ways to Contribute

- **Report bugs** - [Open an issue](https://github.com/jetpax/scripto-studio/issues/new)
- **Suggest features** - Describe your idea in an issue
- **Improve docs** - Edit the pages under `docs-src/`
- **Submit code** - Fix bugs or add features
- **Create Apps** - Publish them on ScriptoHub

## Development Setup

### Prerequisites

- Node.js 18+
- Git

### Clone and Install

```bash
git clone https://github.com/jetpax/scripto-studio.git
cd scripto-studio
npm install
```

### Run Development Server

```bash
npm run dev
```

Opens at `http://localhost:5173`

### Run the tests

```bash
npm test
```

This runs Node's built-in test runner (`node:test`) over `test/*.test.js`.

## Code Style

- **JavaScript**: ES modules, async/await
- **CSS**: Vanilla CSS, no frameworks
- **Formatting**: Consistent indentation (2 spaces)

## Pull Request Process

1. **Fork** the repository
2. **Create a branch**: `git checkout -b feature/my-feature`
3. **Make changes** and test locally
4. **Commit**: `git commit -m "Add my feature"`
5. **Push**: `git push origin feature/my-feature`
6. **Open PR** against `main` branch

### PR Guidelines

- Keep PRs focused on one change
- Include screenshots for UI changes
- Update docs if needed
- Test on Chrome and Firefox

## Reporting Issues

Include:
- Browser and version
- Steps to reproduce
- Expected vs actual behavior
- Console errors (if any)
- Screenshots (if UI issue)

## Questions?

- Check [FAQ](../reference/faq.md)
- Open a [Discussion](https://github.com/jetpax/scripto-studio/discussions)
