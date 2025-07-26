# My Kanban App

A Next.js application with Shadcn/ui components and light/dark mode support.

## Features

- **Shadcn/ui Components**: A comprehensive set of accessible and customizable UI components
- **Light/Dark Mode**: Full theme support with system preference detection
- **TypeScript**: Fully typed for better development experience
- **Tailwind CSS**: Utility-first CSS framework for styling

## Installed Components

The following Shadcn/ui components are available:

### Core Components

- **Button**: Multiple variants (default, secondary, destructive, outline, ghost, link) and sizes
- **Card**: Container component with header, content, and description sections
- **Dialog**: Modal dialogs for user interactions
- **Form**: Form components with validation support

### Form Components

- **Input**: Text input fields
- **Label**: Form labels with proper accessibility
- **Textarea**: Multi-line text input
- **Select**: Dropdown selection component
- **Checkbox**: Checkbox input with label
- **RadioGroup**: Radio button groups
- **Switch**: Toggle switch component

### Additional Components

- **DropdownMenu**: Dropdown menu component (used in theme toggle)

## Theme Support

The application supports three theme modes:

1. **Light**: Bright theme for daytime use
2. **Dark**: Dark theme for nighttime use
3. **System**: Automatically follows your system preference

Use the theme toggle button in the top-right corner to switch between themes.

## Getting Started

### Prerequisites

- **Node.js**: Version 22.0.0 or higher (see `.nvmrc` for exact version)
- **npm**: Version 10.0.0 or higher

### Installation

1. **Use the correct Node.js version** (recommended):

   ```bash
   nvm use
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Run the development server:

   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
src/
├── app/
│   ├── globals.css          # Global styles with theme variables
│   ├── layout.tsx           # Root layout with theme provider
│   └── page.tsx             # Demo page showcasing components
├── components/
│   ├── ui/                  # Shadcn/ui components
│   ├── theme-provider.tsx   # Theme provider wrapper
│   └── theme-toggle.tsx     # Theme toggle component
└── lib/
    └── utils.ts             # Utility functions
```

## Technologies Used

- **Node.js 22**: JavaScript runtime
- **Next.js 15**: React framework with App Router
- **Shadcn/ui**: Component library built on Radix UI
- **Tailwind CSS v4**: Utility-first CSS framework
- **next-themes**: Theme management for Next.js
- **TypeScript**: Type-safe JavaScript
- **Lucide React**: Icon library

## Customization

### Adding New Components

To add more Shadcn/ui components:

```bash
npx shadcn@latest add [component-name]
```

### Theme Customization

Theme colors and variables are defined in `src/app/globals.css`. You can customize:

- Color palette
- Border radius
- Typography
- Spacing

### Component Styling

All components can be customized using Tailwind CSS classes and CSS variables. Each component is built with accessibility in mind and follows modern design patterns.

## Development Workflow

### Code Quality

The project includes comprehensive code quality checks:

```bash
# Run all code quality checks
npm run code-quality

# Individual checks
npm run lint          # ESLint
npm run format:check  # Prettier
npm run type-check    # TypeScript
```

### Testing

```bash
# Run tests
npm run test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch
```

**Coverage Requirements:**

- Statements: 90%
- Lines: 90%
- Branches: 80%
- Functions: 85%

### CI/CD Pipeline

The project uses GitHub Actions for automated testing and quality checks:

#### Workflows

1. **CI** (`.github/workflows/ci.yml`)
   - Runs on: pushes to main/develop, pull requests
   - Checks: TypeScript, ESLint, Prettier, Tests, Coverage

2. **Tests** (`.github/workflows/test.yml`)
   - Runs on: pushes to main/develop, pull requests
   - Matrix testing with Node.js 18 and 20
   - Includes coverage reporting and PR comments

3. **Security** (`.github/workflows/security.yml`)
   - Runs on: pushes to main, pull requests, weekly schedule
   - Checks: npm audit, outdated packages, CodeQL analysis

#### Branch Protection

- All changes must go through pull requests
- Tests must pass before merging
- Code quality checks are enforced
- Coverage requirements must be met

### Git Hooks

The project uses Husky for pre-commit and pre-push hooks:

- **Pre-commit**: Runs linting and formatting
- **Pre-push**: Runs full code quality checks and tests

## 📚 Documentation

For detailed documentation, see the [docs/](docs/) folder:

- **[Database Setup](docs/DATABASE_SETUP.md)** - PostgreSQL and Drizzle ORM setup
- **[Contributing Guidelines](docs/CONTRIBUTING.md)** - How to contribute to the project
- **[Git Hooks](docs/GIT_HOOKS.md)** - Pre-commit hooks and automation
- **[Avatar Service](docs/AVATAR_SERVICE.md)** - Avatar generation service
- **[Documentation Index](docs/README.md)** - Complete documentation overview
