# Database Setup Guide

This project uses PostgreSQL with Drizzle ORM for data persistence.

## Prerequisites

- Docker and Docker Compose installed
- Node.js 22+ and npm 10+

## Quick Start

1. **Start the database:**

   ```bash
   npm run db:up
   ```

2. **Generate and apply migrations:**

   ```bash
   npm run db:generate
   npm run db:push
   ```

3. **Seed the database with sample data:**

   ```bash
   npm run db:seed
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```

## Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
# Database Configuration
DATABASE_URL=postgres://kanban_user:kanban_password@localhost:5432/kanban_db

# Alternative individual database settings
DB_HOST=localhost
DB_PORT=5432
DB_USER=kanban_user
DB_PASSWORD=kanban_password
DB_NAME=kanban_db

# Next.js Configuration
NODE_ENV=development
```

## Database Schema

### Tables

#### `columns`

- `id` (UUID, Primary Key)
- `name` (VARCHAR(255), Required)
- `order_index` (INTEGER, Default: 0)
- `created_at` (TIMESTAMP WITH TIME ZONE)
- `updated_at` (TIMESTAMP WITH TIME ZONE)

#### `tasks`

- `id` (UUID, Primary Key)
- `title` (VARCHAR(255), Required)
- `description` (TEXT, Optional)
- `priority` (ENUM: 'low', 'medium', 'high', Default: 'medium')
- `status` (ENUM: 'todo', 'inprogress', 'done', Default: 'todo')
- `column_id` (UUID, Foreign Key to columns.id)
- `order_index` (INTEGER, Default: 0)
- `assignees` (TEXT[], Array of assignee names)
- `due_date` (DATE, Optional)
- `start_date` (DATE, Optional)
- `created_at` (TIMESTAMP WITH TIME ZONE)
- `updated_at` (TIMESTAMP WITH TIME ZONE)

## Available Scripts

- `npm run db:up` - Start PostgreSQL container
- `npm run db:down` - Stop PostgreSQL container
- `npm run db:generate` - Generate Drizzle migrations
- `npm run db:push` - Push schema changes to database
- `npm run db:migrate` - Run migrations
- `npm run db:studio` - Open Drizzle Studio (database GUI)
- `npm run db:seed` - Seed database with sample data
- `npm run db:reset` - Reset database (delete data and reseed)

## Database Services

The project includes service functions for common database operations:

### Column Service

- `getAll()` - Get all columns ordered by orderIndex
- `getById(id)` - Get a single column by ID
- `create(data)` - Create a new column
- `update(id, data)` - Update a column
- `delete(id)` - Delete a column (cascades to tasks)
- `reorder(columnIds)` - Reorder columns

### Task Service

- `getAll()` - Get all tasks
- `getByColumnId(columnId)` - Get tasks by column
- `getById(id)` - Get a single task by ID
- `create(data)` - Create a new task
- `update(id, data)` - Update a task
- `delete(id)` - Delete a task
- `moveTask(taskId, columnId, orderIndex)` - Move task to different column
- `reorderTasks(columnId, taskIds)` - Reorder tasks within a column
- `getByStatus(status)` - Get tasks by status
- `getByPriority(priority)` - Get tasks by priority

## Docker Configuration

The `docker-compose.yml` file sets up:

- PostgreSQL 16 (Alpine) for better performance
- Persistent volume for data storage
- Health checks for container monitoring
- Initialization script for database setup

## Development Workflow

1. **Schema Changes:**
   - Modify `src/db/schema.ts`
   - Run `npm run db:generate` to create migration
   - Run `npm run db:push` to apply changes

2. **Adding Sample Data:**
   - Modify `src/db/seed.ts`
   - Run `npm run db:seed` to populate database

3. **Database Inspection:**
   - Run `npm run db:studio` to open Drizzle Studio
   - Browse and edit data through the web interface

## Troubleshooting

### Connection Issues

- Ensure Docker is running
- Check if port 5432 is available
- Verify environment variables are set correctly

### Migration Issues

- If schema changes don't apply, try `npm run db:reset`
- Check Drizzle Studio for schema validation errors

### Data Issues

- Use `npm run db:reset` to start fresh
- Check seed script for data format issues
