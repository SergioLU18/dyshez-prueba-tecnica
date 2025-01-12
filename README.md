## Getting Started

First, install any missing modules:

```bash
npm install
# or
yarn install
# or
pnpm install
# or
bun install
```

Second, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result. 

## If you want to skip the BE configuration

There already exists a pre-configured database with all the required configs. All you have
to do is ask for the ```.env.local``` file with the appropiate keys

## If you want to configure your own BE

This project uses supabase for everything BE. These are the main things you'll need to do:

### Initial supabase configuration

There's 2 keys you'll need to connect to your supabase project and you can find them both under
Project Settings > API. You'll need to create a ```.env.local``` file and then add 2 variables:

```bash
NEXT_PUBLIC_SUPABASE_URL='YOUR_PROJECT_URL'
NEXT_PUBLIC_SUPABASE_ANON_KEY='YOUR_PROJECT_ANON_PUBLIC_KEY'
```

Adding these 2 keys will allow the project to connect to your supabase database

### Database setup

Supabase already has a default table for authenticating users. Thus, we only need to create 2 tables.

The first table we are going to create is the ```profile``` table which will serve as the place
where we we'll store all the secondary details of our users. Here are all the columns you should add:

```
    user_id -> Foreign key of type uuid that references the id of a user from auth.users. You should
    also set it as a primary key alongisde the id column
    names -> key of type text
    last_names -> key of type text
    website -> key of type text
    email -> key of type text
    mobile_phone -> key of type text
    secondary_phone -> key of type text
```

The other table is called ```task```. Here we are going to store all the "TO-DOs" that our user
will be able to create after logging in. Here are all the columns you should add:

```
    user_id -> Foreign key of type uuid that references the id of a user from auth.users. You should
    also set it as a primary key alongisde the id column
    title -> key of type text
    description -> key of type text
    completed -> key of type boolean
    completed_at -> key of type date
```

### RLS Policies

As you have probably noticed, every table is created with RLS policies. We must now create the rules
that will dictate what users can and what they can't do. Supabase allows you to create the RLS 
policies based of some templates they offer which makes the process smooth and easy.

Note: Whenever 'own data' is mentioned, I'm referring to making the connection between the user's id
and the ```user_id``` column that we have created on each table

For the ```profile``` table, we want users to create their profile whenever they sign up for the 
application. So, here are the rules we are defining

```
    Every user can insert rows - This will allow an application with 'YOUR_PROJECT_ANON_PUBLIC_KEY'
    to create profiles whenever users sign up.
    Authenticated user can edit own data - This will allow authenticated users to update their data
    whenever they feel like so
    Authenticated user can view own data - This will allow us to show authenticated users their data
    on the application
```

Now, onto the ```tasks``` table. Here we will have users manipulate their tasks as they want, which
means full CRUD (Create, read, update, delete) permissions

```
    Every authenticated user can insert rows - This will allow users to insert new tasks
    Every authenticated user can view own data - This will allow users to see their tasks on the
    application
    Every authenticated user can update own data - This will allow users to change their tasks
    from incomplete to complete
    Every authenticated user can delete own data - This will allow users to get rid of tasks they
    no longer wanna keep
```

### Triggers and functions

### Email & phone providers