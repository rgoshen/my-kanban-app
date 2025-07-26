-- Enable UUID extension for generating UUIDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create enum types for task status and priority
CREATE TYPE task_status AS ENUM ('todo', 'inprogress', 'done');
CREATE TYPE task_priority AS ENUM ('low', 'medium', 'high');

-- Create columns table
CREATE TABLE IF NOT EXISTS columns (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    order_index INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create tasks table
CREATE TABLE IF NOT EXISTS tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    priority task_priority NOT NULL DEFAULT 'medium',
    status task_status NOT NULL DEFAULT 'todo',
    column_id UUID REFERENCES columns(id) ON DELETE CASCADE,
    order_index INTEGER NOT NULL DEFAULT 0,
    assignees TEXT[], -- Array of assignee names
    due_date DATE,
    start_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_tasks_column_id ON tasks(column_id);
CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status);
CREATE INDEX IF NOT EXISTS idx_tasks_priority ON tasks(priority);
CREATE INDEX IF NOT EXISTS idx_tasks_order_index ON tasks(order_index);
CREATE INDEX IF NOT EXISTS idx_columns_order_index ON columns(order_index);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers to automatically update updated_at
CREATE TRIGGER update_tasks_updated_at BEFORE UPDATE ON tasks
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_columns_updated_at BEFORE UPDATE ON columns
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert default columns
INSERT INTO columns (id, name, order_index) VALUES
    (uuid_generate_v4(), 'To Do', 0),
    (uuid_generate_v4(), 'In Progress', 1),
    (uuid_generate_v4(), 'Done', 2)
ON CONFLICT DO NOTHING; 