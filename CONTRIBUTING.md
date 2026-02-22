# Contributing to maitre-d

Thanks for your interest in contributing! This guide will help you get started.

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/YOUR_USERNAME/maitre-d.git`
3. Install dependencies: `npm install`
4. Create a branch: `git checkout -b my-feature`
5. Make your changes
6. Run tests: `npm test`
7. Run linting: `npm run lint`
8. Commit your changes: `git commit -m "Add my feature"`
9. Push to your fork: `git push origin my-feature`
10. Open a Pull Request

## Development Setup

### Prerequisites

- Node.js >= 20
- npm >= 10

### Install Dependencies

```bash
npm install
```

### Run Tests

```bash
npm test
```

### Lint & Format

```bash
npm run lint
npm run format
```

## Pull Request Guidelines

- Keep PRs focused — one feature or fix per PR
- Write clear commit messages that explain *why*, not just *what*
- Add tests for new functionality
- Update documentation if your change affects the user-facing API
- Make sure all CI checks pass before requesting review

## Code Style

- We use ESLint and Prettier for consistent code style
- Run `npm run lint` before committing
- TypeScript strict mode is enabled

## Reporting Bugs

Open an issue with:
- A clear description of the bug
- Steps to reproduce
- Expected vs actual behavior
- Your environment (OS, Node.js version, etc.)

## Feature Requests

Open an issue describing:
- The problem you're trying to solve
- Your proposed solution
- Any alternatives you've considered

## Security

If you discover a security vulnerability, please **do not** open a public issue. Instead, see [SECURITY.md](SECURITY.md) for responsible disclosure instructions.

## Code of Conduct

This project follows the [Contributor Covenant Code of Conduct](CODE_OF_CONDUCT.md). By participating, you agree to uphold this standard.

## License

By contributing, you agree that your contributions will be licensed under the [MIT License](LICENSE).
