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

1. Install dependencies:

   ```bash
   npm install
   ```

2. Run the development server:

   ```bash
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

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
