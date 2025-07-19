# My Kanban App

A modern, full-stack Kanban board application built with Next.js 15, React 19, and Tailwind CSS. This project demonstrates building a complete task management system with drag-and-drop functionality, real-time updates, and a beautiful user interface.

## 🚀 Features

- **Modern Tech Stack**: Built with Next.js 15, React 19, and TypeScript
- **Beautiful UI**: Styled with Tailwind CSS v4 and Shadcn UI components
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **Dark Mode Support**: Automatic theme switching based on system preferences
- **Fast Development**: Turbopack for lightning-fast development builds
- **Type Safety**: Full TypeScript support for better development experience

## 🛠️ Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) with App Router
- **Frontend**: [React 19](https://react.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **UI Components**: [Shadcn UI](https://ui.shadcn.com/)
- **Fonts**: [Geist](https://vercel.com/font) (optimized with next/font)
- **Development**: Turbopack for faster builds

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (version 18.17 or higher)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/) or [pnpm](https://pnpm.io/) or [bun](https://bun.sh/)

## 🚀 Getting Started

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/rgoshen/my-kanban-app.git
   cd my-kanban-app
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   # or
   bun install
   ```

3. **Start the development server**

   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   # or
   bun dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000) to see the application.

### Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build the application for production
- `npm run start` - Start the production server
- `npm run lint` - Run ESLint to check code quality

## 📁 Project Structure

```
src/
├── app/                    # App Router pages and layouts
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   ├── globals.css        # Global styles
│   └── favicon.ico        # Site icon
├── components/            # Reusable components
│   ├── ui/               # Shadcn UI components
│   ├── forms/            # Form components
│   ├── layout/           # Layout components
│   └── features/         # Feature-specific components
├── lib/                  # Utility functions and configurations
│   ├── utils.ts          # General utilities
│   ├── validations.ts    # Schema validations
│   ├── constants.ts      # App constants
│   └── types.ts          # TypeScript types
├── hooks/                # Custom React hooks
├── store/                # State management
├── services/             # API services
└── actions/              # Server actions
```

## 🎨 Customization

### Styling

The project uses Tailwind CSS v4 with a modern theming system. You can customize:

- Colors in `src/app/globals.css`
- Component styles in individual component files
- Global styles in the CSS variables

### Components

Shadcn UI components are used throughout the application. You can:

- Add new components using `npx shadcn@latest add [component-name]`
- Customize existing components in `src/components/ui/`
- Create feature-specific components in `src/components/features/`

## 🚀 Deployment

### Deploy on Vercel (Recommended)

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

1. Push your code to GitHub
2. Import your project to Vercel
3. Vercel will automatically detect Next.js and optimize your deployment

### Other Deployment Options

Check out the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details on deploying to other platforms.

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for detailed information on how to contribute to this project.

### Quick Start for Contributors

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow the established project structure
- Use TypeScript for all new code
- Follow the naming conventions in `.cursor/rules/.cursorrules`
- Ensure your code passes ESLint checks
- Write meaningful commit messages

For more detailed guidelines, please refer to our [Contributing Guidelines](CONTRIBUTING.md).

## 📚 Learn More

To learn more about the technologies used in this project:

- [Next.js Documentation](https://nextjs.org/docs) - Learn about Next.js features and API
- [Learn Next.js](https://nextjs.org/learn) - Interactive Next.js tutorial
- [React Documentation](https://react.dev/) - Learn React fundamentals
- [Tailwind CSS Documentation](https://tailwindcss.com/docs) - Learn Tailwind CSS
- [Shadcn UI Documentation](https://ui.shadcn.com/) - Learn about Shadcn UI components

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

Copyright (c) 2025 Rick Goshen

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) team for the amazing framework
- [Vercel](https://vercel.com/) for the deployment platform
- [Shadcn](https://ui.shadcn.com/) for the beautiful UI components
- [Tailwind CSS](https://tailwindcss.com/) team for the utility-first CSS framework

---

**Happy coding! 🎉**
