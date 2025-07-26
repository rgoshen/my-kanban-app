# Configuration

This directory contains configuration files and examples for the Kanban application.

## Environment Variables

### `env.example`

This file contains all available environment variables with example values. It serves as a template for creating your own environment files.

### Environment Files

The application uses different environment files for different contexts:

- **`.env.local`** - Development environment (created by `npm run setup:env`)
- **`.env.test`** - Test environment (created by `npm run setup:env`)
- **`.env.production`** - Production environment (not created automatically)

### Quick Setup

```bash
npm run setup:env
```

This command will:

1. Create `.env.local` with development settings
2. Create `.env.test` with test settings
3. Configure appropriate logging and debugging options

### Manual Setup

If you prefer to create environment files manually:

```bash
# Copy the example file
cp config/env.example .env.local

# Edit the file with your specific values
nano .env.local
```

## Environment Variables Reference

### Database Configuration

| Variable       | Description                         | Default                                                           |
| -------------- | ----------------------------------- | ----------------------------------------------------------------- |
| `DATABASE_URL` | Complete database connection string | `postgres://kanban_user:kanban_password@localhost:5432/kanban_db` |
| `DB_HOST`      | Database host                       | `localhost`                                                       |
| `DB_PORT`      | Database port                       | `5432`                                                            |
| `DB_USER`      | Database username                   | `kanban_user`                                                     |
| `DB_PASSWORD`  | Database password                   | `kanban_password`                                                 |
| `DB_NAME`      | Database name                       | `kanban_db`                                                       |

### Application Configuration

| Variable              | Description            | Default                 |
| --------------------- | ---------------------- | ----------------------- |
| `NODE_ENV`            | Node.js environment    | `development`           |
| `NEXT_PUBLIC_APP_URL` | Public application URL | `http://localhost:3000` |

### Development & Debugging

| Variable     | Description                   | Default               |
| ------------ | ----------------------------- | --------------------- |
| `DEBUG`      | Enable debug logging          | `false` (dev: `true`) |
| `DB_LOGGING` | Enable database query logging | `false` (dev: `true`) |

### Security (Future Use)

| Variable         | Description               | Default                                               |
| ---------------- | ------------------------- | ----------------------------------------------------- |
| `JWT_SECRET`     | JWT signing secret        | `your-super-secret-jwt-key-change-this-in-production` |
| `SESSION_SECRET` | Session encryption secret | `your-session-secret-change-this-in-production`       |

## Best Practices

1. **Never commit `.env.local`** - It's already in `.gitignore`
2. **Use different databases** for development and testing
3. **Rotate secrets** in production environments
4. **Use strong passwords** for production databases
5. **Keep secrets secure** - Don't share them in code or documentation

## Troubleshooting

### Environment Variables Not Loading

1. Ensure the file is named correctly (`.env.local`, not `.env`)
2. Restart your development server after creating environment files
3. Check that the file is in the project root directory

### Database Connection Issues

1. Verify database credentials in your environment file
2. Ensure the database container is running (`npm run db:up`)
3. Check that the database port is not already in use
