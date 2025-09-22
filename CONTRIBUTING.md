# Contributing to Circle of Fifths

Thank you for your interest in contributing to the Circle of Fifths project! This document provides guidelines and information for contributors.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [How to Contribute](#how-to-contribute)
- [Pull Request Process](#pull-request-process)
- [Coding Standards](#coding-standards)
- [Testing Guidelines](#testing-guidelines)
- [Documentation](#documentation)
- [Community](#community)

## Code of Conduct

This project and everyone participating in it is governed by our [Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code.

## Getting Started

### Prerequisites

- Node.js 14.0.0 or higher
- npm or yarn package manager
- Modern web browser with Web Audio API support
- Git for version control

### Development Setup

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
    ```bash
    git clone https://github.com/your-username/circle-of-fifths.git
    cd circle-of-fifths
    ```
3. **Install dependencies**:
    ```bash
    npm install
    ```
4. **Start the development server**:
    ```bash
    npm run dev
    ```
5. **Run the tests** to ensure everything works:
    ```bash
    npm test
    ```

## How to Contribute

### Reporting Bugs

Before creating bug reports, please check the existing issues to avoid duplicates. When creating a bug report, include:

- **Clear title** and description
- **Steps to reproduce** the issue
- **Expected behavior** vs actual behavior
- **Browser and version** information
- **Screenshots** if applicable
- **Console errors** if any

### Suggesting Features

Feature requests are welcome! Please:

- **Check existing issues** for similar requests
- **Provide clear use cases** for the feature
- **Explain the expected behavior**
- **Consider the scope** - keep features focused

### Contributing Code

1. **Create a branch** for your work:
    ```bash
    git checkout -b feature/your-feature-name
    ```
2. **Make your changes** following our coding standards
3. **Add tests** for new functionality
4. **Update documentation** as needed
5. **Run the test suite**:
    ```bash
    npm run test:all
    npm run lint
    ```
6. **Commit your changes** with clear messages
7. **Push to your fork** and create a pull request

## Pull Request Process

### Before Submitting

- [ ] Code follows the project's coding standards
- [ ] All tests pass (`npm run test:all`)
- [ ] Code is properly linted (`npm run lint`)
- [ ] Documentation is updated if needed
- [ ] Commit messages are clear and descriptive

### PR Requirements

- **Clear title** describing the change
- **Detailed description** of what was changed and why
- **Link to related issues** if applicable
- **Screenshots** for UI changes
- **Test coverage** for new features

### Review Process

1. **Automated checks** must pass (CI/CD pipeline)
2. **Code review** by maintainers
3. **Testing** in different browsers if needed
4. **Approval** from at least one maintainer
5. **Merge** by maintainers

## Coding Standards

### JavaScript Style

- Use **ES6+ features** where appropriate
- Follow **consistent naming conventions**:
    - `camelCase` for variables and functions
    - `PascalCase` for classes
    - `UPPER_CASE` for constants
- **Semicolons** are required
- **2 spaces** for indentation
- **Single quotes** for strings

### Code Organization

- **Modular structure** - separate concerns into different files
- **Clear function/class responsibilities**
- **Meaningful variable and function names**
- **Consistent file naming** (kebab-case for files)

### Documentation

- **JSDoc comments** for all public APIs
- **Inline comments** for complex logic
- **README updates** for new features
- **Code examples** where helpful

## Testing Guidelines

### Test Types

- **Unit tests** for individual functions/classes
- **Integration tests** for component interactions
- **Accessibility tests** for WCAG compliance
- **Performance tests** for critical paths
- **Visual regression tests** for UI changes

### Writing Tests

- **Descriptive test names** that explain what is being tested
- **Arrange-Act-Assert** pattern
- **Mock external dependencies** appropriately
- **Test edge cases** and error conditions
- **Maintain test coverage** above 80%

### Running Tests

```bash
# Run all tests
npm test

# Run specific test types
npm run test:unit
npm run test:integration
npm run test:accessibility

# Run with coverage
npm run test:coverage

# Run in watch mode during development
npm run test:watch
```

## Documentation

### Types of Documentation

- **Code documentation** (JSDoc comments)
- **User documentation** (README, usage guides)
- **Developer documentation** (this file, architecture docs)
- **API documentation** (if applicable)

### Documentation Standards

- **Clear and concise** language
- **Code examples** where helpful
- **Up-to-date** with current functionality
- **Accessible** to different skill levels

## Community

### Communication Channels

- **GitHub Issues** for bug reports and feature requests
- **GitHub Discussions** for general questions and ideas
- **Pull Request comments** for code-specific discussions

### Getting Help

- Check the **README** and documentation first
- Search **existing issues** for similar problems
- Create a **new issue** with detailed information
- Be **patient and respectful** in all interactions

### Recognition

Contributors are recognized in:

- **CHANGELOG.md** for significant contributions
- **GitHub contributors** page
- **Release notes** for major features

## Development Workflow

### Branch Naming

- `feature/description` for new features
- `fix/description` for bug fixes
- `docs/description` for documentation updates
- `refactor/description` for code refactoring

### Commit Messages

Follow the conventional commit format:

```
type(scope): description

[optional body]

[optional footer]
```

Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

### Release Process

1. **Version bump** following semantic versioning
2. **Update CHANGELOG.md** with new features and fixes
3. **Create release tag** and GitHub release
4. **Deploy** to production if applicable

## Questions?

If you have questions about contributing, please:

1. Check this document and the README
2. Search existing issues and discussions
3. Create a new issue with the "question" label
4. Be specific about what you need help with

Thank you for contributing to Circle of Fifths! 🎵
