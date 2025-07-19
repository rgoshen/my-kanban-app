# Git Hooks

This project uses Husky to manage Git hooks that ensure code quality and consistency.

## Hooks Overview

### Pre-commit Hook

- **Purpose**: Runs before each commit
- **Actions**:
  - Runs ESLint with auto-fix on staged JavaScript/TypeScript files
  - Runs Prettier formatting on staged files
  - Only processes files that are staged for commit
- **Benefits**: Ensures all committed code follows linting rules and formatting standards

### Pre-push Hook

- **Purpose**: Runs before pushing to remote repository
- **Actions**:
  - Runs comprehensive code quality checks
  - Includes linting, formatting, and TypeScript type checking
  - Prevents pushing code with quality issues
- **Benefits**: Maintains code quality in the remote repository

### Commit-msg Hook

- **Purpose**: Validates commit message format
- **Actions**:
  - Enforces conventional commit message format
  - Ensures consistent commit history
- **Format**: `<type>(<scope>): <description>`
- **Types**: feat, fix, docs, style, refactor, perf, test, chore, build, ci, revert

## Commit Message Examples

✅ **Valid commit messages:**

```
feat(kanban): add drag and drop functionality
fix(ui): resolve theme toggle button alignment
docs(readme): update installation instructions
chore(deps): update dependencies to latest versions
test(kanban): add unit tests for task cards
```

❌ **Invalid commit messages:**

```
added drag and drop
fixed bug
updated readme
```

## Workflow

1. **Make changes** to your code
2. **Stage files** with `git add`
3. **Commit changes** - pre-commit hook will automatically:
   - Run ESLint with auto-fix
   - Format code with Prettier
   - Validate commit message format
4. **Push to remote** - pre-push hook will:
   - Run comprehensive quality checks
   - Block push if issues are found

## Bypassing Hooks (Emergency Only)

If you need to bypass hooks in an emergency:

```bash
# Skip pre-commit hook
git commit --no-verify -m "emergency fix"

# Skip pre-push hook
git push --no-verify
```

⚠️ **Warning**: Only use these flags in true emergencies. Regular bypassing defeats the purpose of code quality enforcement.

## Troubleshooting

### Hook not running

1. Ensure Husky is installed: `npm install`
2. Check if hooks are executable: `ls -la .husky/`
3. Reinstall hooks: `npm run prepare`

### Linting errors

1. Run `npm run lint:fix` to auto-fix issues
2. Run `npm run format` to format code
3. Address any remaining manual fixes

### Commit message rejected

1. Follow the conventional commit format
2. Keep description under 50 characters
3. Use appropriate type and scope

## Configuration Files

- `.husky/pre-commit` - Pre-commit hook script
- `.husky/pre-push` - Pre-push hook script
- `.husky/commit-msg` - Commit message validation
- `package.json` - lint-staged configuration
- `eslint.config.mjs` - ESLint rules
- `.prettierrc` - Prettier formatting rules
