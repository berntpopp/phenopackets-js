---
layout: default
title: Development Guide
parent: Guides
nav_order: 3
---

## Development Guide

This guide is for developers working on the `phenopackets-js` library itself or those who need a deeper understanding of its setup.

## Prerequisites

Before you begin development, ensure you have:

- Node.js (LTS versions recommended)
- npm or yarn
- Protocol Buffer Compiler (`protoc`)
- Git

## Repository Setup

1. Clone the repository:

```bash
git clone https://github.com/berntpopp/phenopackets-js.git
cd phenopackets-js
```

1. Install dependencies:

```bash
npm install
```

1. Download proto files:

```bash
# On Windows
scripts\download-protos.bat

# On Linux/macOS
bash ./scripts/download-protos.sh
```

## Building the Library

After making changes or updating proto files:

1. Generate JavaScript code from protos:

```bash
npm run generate-protos
```

1. Run tests:

```bash
npm test
```

## Code Style and Linting

The project uses ESLint and Prettier for code formatting:

- Format code: `npm run format`
- Check formatting: `npm run format:check`
- Lint code: `npm run lint`
- Fix lint issues: `npm run lint:fix`

## Testing

Run the test suite:

```bash
npm test
```

Or in watch mode during development:

```bash
npm run test:watch
```

## Documentation

### Documentation Generation

The documentation is automatically generated and deployed using GitHub Actions when changes are pushed to the main branch. The process includes:

- Building JSDoc API documentation from source code
- Deploying to GitHub Pages
- Updating the documentation site

For local development, you can generate the documentation using:

```bash
npm run docs:generate-api
```

### Automated Workflows

The project uses GitHub Actions for automation:

- **Documentation**: Automatically builds and deploys documentation on changes to `main` branch
- **Release**: Uses semantic-release for automated versioning and publishing
- **CI**: Runs tests and quality checks on pull requests

Workflow files are located in `.github/workflows/`:

- `docs.yml`: Documentation generation and deployment
- `release.yml`: Package versioning and publishing
- `ci.yml`: Continuous integration checks

## Release Process

The project uses semantic-release for versioning and publishing:

1. Commits must follow the [Conventional Commits](https://www.conventionalcommits.org/) specification
2. CI/CD will automatically:
   - Run tests
   - Generate documentation
   - Create a release
   - Publish to npm

## Project Structure

```text
phenopackets-js/
├── lib/              # Generated JavaScript code
├── protos/           # Protocol Buffer definitions (downloaded)
├── scripts/          # Build and utility scripts
├── src/              # Source code
├── tests/            # Test files
└── docs/             # Documentation
```

For more detailed information about specific aspects of development, see:

- [Proto Workflow](./proto-workflow.md)
- [Testing Strategy](./testing.md)
- [Contributing Guidelines](./contributing.md)
