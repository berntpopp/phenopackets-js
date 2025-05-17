# Contributing to phenopackets-js

First off, thank you for considering contributing to phenopackets-js! It's people like you that make phenopackets-js such a great tool.

## Code of Conduct

This project and everyone participating in it is governed by our Code of Conduct. By participating, you are expected to uphold this code.

## Development Process

We use GitHub to host code, to track issues and feature requests, as well as accept pull requests.

### Pull Requests

1. Fork the repo and create your branch from `main`.
2. If you've added code that should be tested, add tests.
3. If you've changed APIs, update the documentation.
4. Ensure the test suite passes.
5. Make sure your code lints.

### Commit Messages

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification. This leads to more readable messages that are easy to follow when looking through the project history.

```text
<type>(<scope>): <description>

[optional body]

[optional footer]
```

Types:

- feat: A new feature
- fix: A bug fix
- docs: Documentation only changes
- style: Changes that do not affect the meaning of the code
- refactor: A code change that neither fixes a bug nor adds a feature
- perf: A code change that improves performance
- test: Adding missing tests or correcting existing tests
- chore: Changes to the build process or auxiliary tools

Example:

```text
feat(parser): add ability to parse arrays

This adds the capability to parse array structures in the phenopacket format.
Arrays can now be properly serialized and deserialized.

Closes #123
```

### Development Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Generate protobuf files:

   ```bash
   npm run generate-protos
   ```

3. Run tests:
   ```bash
   npm test
   ```

### Testing

We use Jest for testing. Please write tests for new code you create:

```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch
```

### Code Style

We use ESLint and Prettier to maintain code quality. Before submitting a pull request, make sure your code follows our style guidelines:

```bash
# Run linter
npm run lint

# Fix linting issues
npm run lint:fix

# Format code
npm run format
```

### Building

```bash
# Build the project
npm run build

# Build documentation
npm run docs
```

## Project Structure

- `/lib` - Core library code
- `/protos` - Protocol buffer definitions
- `/tests` - Test files
- `/docs` - Documentation
- `/examples` - Example usage

## Documentation

Please update the documentation when you make changes:

- README.md for general usage and setup
- JSDoc comments for API documentation
- Code comments for complex logic
- Update examples if needed

## Release Process

This project uses [semantic-release](https://github.com/semantic-release/semantic-release) for automated versioning and releases. The process is triggered automatically when commits are pushed to the main branch.

### How it Works

1. When commits are pushed to `main`, GitHub Actions runs the release workflow
2. semantic-release analyzes commit messages to determine the next version
3. CHANGELOG.md is automatically updated
4. A new version is published to npm
5. A GitHub release is created with release notes
6. Related issues and PRs are updated

### Release Types

The type of release is determined by your commit messages:

- `fix:` commits trigger a PATCH release (e.g., 1.0.0 → 1.0.1)
- `feat:` commits trigger a MINOR release (e.g., 1.0.0 → 1.1.0)
- `feat!:` or commits with `BREAKING CHANGE:` in the footer trigger a MAJOR release (e.g., 1.0.0 → 2.0.0)

### Pre-releases

Pre-releases can be created by pushing to specific branches:

- `next` branch for next regular release candidates
- `beta` branch for beta versions
- `alpha` branch for alpha versions

## Getting Help

- Create an issue for bugs
- Join our discussions for questions
- Contact maintainers for security issues

## License

By contributing, you agree that your contributions will be licensed under the same license as the project (MIT License).
