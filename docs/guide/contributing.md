---
layout: default
title: Contributing
parent: Guides
nav_order: 6
---

Thank you for your interest in contributing to phenopackets-js! This guide will help you get started.

## Development Setup

1. Fork and clone the repository:

   ```bash
   git clone https://github.com/yourusername/phenopackets-js.git
   cd phenopackets-js
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up the development environment:

   ```bash
   npm run setup
   ```

## Development Workflow

1. Create a new branch for your feature:

   ```bash
   git checkout -b feature/your-feature-name
   ```

2. Make your changes and ensure they follow our coding standards:

   ```bash
   npm run lint
   npm run format
   ```

3. Run tests to ensure everything works:

   ```bash
   npm test
   ```

4. Update documentation if needed:

   ```bash
   npm run docs:generate-api
   ```

## Pull Request Process

1. Ensure your code follows our coding standards
2. Update the documentation if you're adding new features
3. Add tests for any new functionality
4. Use conventional commits for your commit messages
5. Submit your PR with a clear description of the changes

## Code Style

- Use ESLint and Prettier for code formatting
- Follow the existing code style
- Add JSDoc comments for new functions and classes
- Keep code modular and maintainable

## Documentation

When adding new features, please:

1. Add JSDoc comments to your code
2. Update relevant guide documentation
3. Include examples in the documentation
4. Update the README if necessary

## Need Help?

If you need help or have questions:

1. Check existing issues and documentation
2. Open a new issue for discussion
3. Tag maintainers for clarification

Thank you for contributing to phenopackets-js!
