# Supabase Setup for CICS Select

This document provides instructions on setting up Supabase for the CICS Select election system.

## Requirements

- Supabase account (https://supabase.com)
- Supabase CLI (optional, for local development)

## Setup Instructions

### 1. Create a Supabase Project

1. Sign up or log in to Supabase
2. Create a new project
3. Take note of your project URL and anon key

### 2. Environment Variables

Add the following environment variables to your `.env.local` file:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Database Schema Setup

You can set up the database schema in two ways:

#### Option 1: Using the SQL Editor in Supabase Dashboard

1. Go to your Supabase project dashboard
2. Navigate to the SQL Editor
3. Copy the contents of `scripts/supabase-migrations.sql`
4. Run the script in the SQL Editor

#### Option 2: Using Supabase CLI (for local development)

1. Install Supabase CLI: `npm install -g supabase`
2. Set up Supabase locally: `supabase init`
3. Apply migrations: `supabase db reset`

## Testing Your Connection

We've included several ways to test if your Supabase connection is working:

### Option 1: Using the Built-in Debug Page

1. Log in to the admin dashboard
2. Click on the "Debug Connection" button
3. The debug page will show you the status of your connection and any error details

### Option 2: Using the Command Line Tool

Run the following command in your terminal:

```
npm run test-db
```

This will check:
- If your environment variables are set correctly
- If your Supabase project is accessible
- If all the required tables exist in your database

## Troubleshooting Common Errors

### "Error creating election: {}"

This cryptic error often occurs when there's an issue with your Supabase connection. Here are steps to diagnose:

1. Make sure your `.env.local` file exists with the correct environment variables
2. Check that your Supabase project is up and running
3. Verify that the database tables are created by running the SQL migrations
4. Check browser console logs for more detailed error messages
5. Run the connection test tool: `npm run test-db`

### "relation 'campaigns' does not exist"

This error occurs when the database tables haven't been created:

1. Run the SQL script in the Supabase SQL Editor
2. Verify that the tables were created successfully
3. Make sure you're using the correct Supabase project URL

### Authentication Errors

If you're getting permission-related errors:

1. Check that your Supabase anon key is correct
2. Verify that the Row Level Security (RLS) policies are properly set up
3. Make sure your user has the correct permissions

## Database Schema

The application uses the following tables:

### campaigns

- `id` (UUID, Primary Key)
- `title` (TEXT)
- `deadline` (DATE)
- `created_at` (TIMESTAMPTZ)
- `updated_at` (TIMESTAMPTZ)

### positions

- `id` (UUID, Primary Key)
- `campaign_id` (UUID, Foreign Key)
- `name` (TEXT)
- `created_at` (TIMESTAMPTZ)
- `updated_at` (TIMESTAMPTZ)

### candidates

- `id` (UUID, Primary Key)
- `position_id` (UUID, Foreign Key)
- `name` (TEXT)
- `course` (TEXT)
- `platform` (TEXT, Optional)
- `created_at` (TIMESTAMPTZ)
- `updated_at` (TIMESTAMPTZ)

## Row Level Security Policies

The database uses Row Level Security (RLS) policies:

- Authenticated users have full access to all tables
- Anonymous users have read-only access to all tables 