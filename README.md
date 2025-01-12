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

### Email & phone providers