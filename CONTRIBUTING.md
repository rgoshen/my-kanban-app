# Contributing to My Kanban App

Thank you for your interest in contributing to My Kanban App! This document provides guidelines and information for contributors.

## 🤝 How to Contribute

We welcome contributions from the community! Whether you're fixing a bug, adding a feature, or improving documentation, your help is appreciated.

## 📋 Prerequisites

Before contributing, please ensure you have:

- [Node.js](https://nodejs.org/) (version 18.17 or higher)
- [Git](https://git-scm.com/) installed and configured
- A GitHub account
- Basic knowledge of Next.js, React, and TypeScript

## 🚀 Getting Started

### 1. Fork the Repository

1. Go to [https://github.com/rgoshen/my-kanban-app](https://github.com/rgoshen/my-kanban-app)
2. Click the "Fork" button in the top-right corner
3. This creates a copy of the repository in your GitHub account

### 2. Clone Your Fork

```bash
git clone https://github.com/YOUR_USERNAME/my-kanban-app.git
cd my-kanban-app
```

### 3. Set Up the Development Environment

```bash
# Install dependencies
npm install

# Start the development server
npm run dev
```

### 4. Create a Branch

Create a new branch for your changes:

```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/your-bug-fix
# or
git checkout -b docs/your-documentation-update
```

## 📝 Development Guidelines

### Code Style and Standards

- **TypeScript**: Use TypeScript for all new code
- **ESLint**: Ensure your code passes ESLint checks (`npm run lint`)
- **Naming Conventions**: Follow the conventions in `.cursor/rules/.cursorrules`
- **Component Structure**: Follow the established project structure
- **Comments**: Add comments for complex logic
- **Error Handling**: Implement proper error handling

### Project Structure

Follow the established project structure:

```
src/
├── app/                    # App Router pages and layouts
├── components/            # Reusable components
│   ├── ui/               # Shadcn UI components
│   ├── forms/            # Form components
│   ├── layout/           # Layout components
│   └── features/         # Feature-specific components
├── lib/                  # Utility functions and configurations
├── hooks/                # Custom React hooks
├── store/                # State management
├── services/             # API services
└── actions/              # Server actions
```

### Component Guidelines

- Keep components small and focused
- Use TypeScript interfaces for props
- Implement proper error boundaries
- Follow React best practices
- Use Shadcn UI components when possible

### Testing

- Write tests for new features
- Ensure existing tests pass
- Use descriptive test names
- Test both success and error scenarios

## 🔄 Making Changes

### 1. Make Your Changes

- Write clear, readable code
- Follow the established patterns
- Add comments where necessary
- Test your changes thoroughly

### 2. Commit Your Changes

Use conventional commit messages:

```bash
git commit -m "feat: add drag and drop functionality"
git commit -m "fix: resolve authentication issue"
git commit -m "docs: update installation instructions"
git commit -m "style: improve button styling"
git commit -m "refactor: simplify component logic"
```

### 3. Push Your Changes

```bash
git push origin feature/your-feature-name
```

### 4. Create a Pull Request

1. Go to your fork on GitHub
2. Click "Compare & pull request"
3. Fill out the pull request template
4. Provide a clear description of your changes
5. Link any related issues

## 📋 Pull Request Guidelines

### Before Submitting

- [ ] Code follows the project's style guidelines
- [ ] All tests pass
- [ ] ESLint checks pass (`npm run lint`)
- [ ] TypeScript compilation succeeds
- [ ] Documentation is updated if needed
- [ ] Changes are tested locally

### Pull Request Template

When creating a pull request, please include:

```markdown
## Description
Brief description of the changes made.

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Documentation update
- [ ] Code refactoring
- [ ] Performance improvement

## Testing
- [ ] Tested locally
- [ ] All tests pass
- [ ] No console errors

## Screenshots (if applicable)
Add screenshots to help explain your changes.

## Checklist
- [ ] My code follows the style guidelines of this project
- [ ] I have performed a self-review of my own code
- [ ] I have commented my code, particularly in hard-to-understand areas
- [ ] I have made corresponding changes to the documentation
- [ ] My changes generate no new warnings
- [ ] I have added tests that prove my fix is effective or that my feature works
- [ ] New and existing unit tests pass locally with my changes
```

## 🐛 Reporting Bugs

### Before Reporting

1. Check if the bug has already been reported
2. Try to reproduce the bug with the latest version
3. Check the browser console for errors

### Bug Report Template

```markdown
## Bug Description
Clear and concise description of the bug.

## Steps to Reproduce
1. Go to '...'
2. Click on '...'
3. Scroll down to '...'
4. See error

## Expected Behavior
What you expected to happen.

## Actual Behavior
What actually happened.

## Environment
- OS: [e.g. macOS, Windows, Linux]
- Browser: [e.g. Chrome, Firefox, Safari]
- Version: [e.g. 22]
- Node.js version: [e.g. 18.17.0]

## Additional Context
Add any other context about the problem here.
```

## 💡 Suggesting Features

### Feature Request Template

```markdown
## Feature Description
Clear and concise description of the feature.

## Problem Statement
What problem does this feature solve?

## Proposed Solution
How would you like this feature to work?

## Alternative Solutions
Any alternative solutions you've considered.

## Additional Context
Add any other context or screenshots about the feature request.
```

## 🏷️ Issue Labels

We use the following labels to categorize issues:

- `bug` - Something isn't working
- `enhancement` - New feature or request
- `documentation` - Improvements or additions to documentation
- `good first issue` - Good for newcomers
- `help wanted` - Extra attention is needed
- `question` - Further information is requested

## 📞 Getting Help

If you need help with contributing:

1. Check the [README.md](README.md) for project information
2. Look through existing issues and pull requests
3. Join our community discussions
4. Contact the maintainers

## 🎉 Recognition

Contributors will be recognized in:

- The project's README.md
- Release notes
- GitHub contributors page

## 📄 License

By contributing to My Kanban App, you agree that your contributions will be licensed under the [MIT License](LICENSE).

---

Thank you for contributing to My Kanban App! 🚀
