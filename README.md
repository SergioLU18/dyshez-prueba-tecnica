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
Project Settings -> API. You'll need to create a ```.env.local``` file and then add 2 variables:

```bash
NEXT_PUBLIC_SUPABASE_URL='YOUR_PROJECT_URL'
NEXT_PUBLIC_SUPABASE_ANON_KEY='YOUR_PROJECT_ANON_PUBLIC_KEY'
```

Adding these 2 keys will allow the project to connect to your supabase database. Also, make sure
that you go to Authentication -> URL Configuration and use your site's URL. In case you are just
going to run the app locally, then set the URL to ```http://localhost:3000```.

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

This is probably the most important part of the project. When creating a user, supabase only
lets you sign-up with either a phone or an email, and this is a roadblock because we want to
eventually allow our users to sign in with whichever method they want after they create their
account and verify their respective email and phone. So, we are going to have to create a 
```function``` that update the ```auth.users``` table so that every user has both their
email and phone. Usually, we can just use supabase's function creator and start off with some
templates, but since we are handling authentication data, we must use the ```SQL Editor```.

So, we will need to access the ```SQL Editor``` in our supabase project and run the following
query:

```
GRANT UPDATE ON auth.users TO postgres;
```

This query will allow the ```postgres``` user from our ```SQL EDITOR``` to make changes on our users
table. We can now move on to the function query:

```
CREATE OR REPLACE FUNCTION update_auth_phone()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE auth.users
    SET phone = NEW.mobile_phone
    WHERE id = NEW.user_id;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

What this query does is create a function ```update_auth_phone``` that is going to expect a new
row ```NEW``` and use it to update the users phone (```SET phone = NEW.mobile_phone```). If by 
this point you have created your tables with different column names than the ones mentioned here, 
then you'll have to modify the function so that the column's names match. Also, make sure you
don't remove ```SECURITY DEFINER``` from the function as that is vital to making sure only 
allowed users may call this function. 

We will now make sure that it is only the ```postgres``` user that owns the function:

```
ALTER FUNCTION update_auth_phone() OWNER TO postgres;
```

And last but not least, we need to create the trigger that will tell our database that whenever
a new row is inserted into ```profile```, we must use it to update the user's phone:

```
CREATE TRIGGER after_insert_profile
AFTER INSERT ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION update_auth_phone();
```

### Email & Phone providers

By default, supabase comes with a limited-rate-email-provider that will fit perfectly to your
localhost needs. Go to Authentication -> Providers and open the Email tab. Make sure to turn
on ```Enable email provider```, ```Confirm email```, and ```Secure email exchange```. We are
only going to use the email provider for email verification on signup, so you can leave the
```Email OTP Expiration``` to the default 86,400 seconds even if you get a warning. 

Now, for the phone provider tab you first have to select an SMS provider. For this project
specifically, we use Twilio. You have to create a project on Twilio and buy a phone that is
at least capable of SMS messaging. This project attempts to message users through Whatsapp
first, but it fallbacks to SMS in case of any errors. So, go to your twilio dashboard and
copy all the necessary tokens and SIDs onto your supabase project. You are free to change the
```SMS OTP Expiry``` and ```SMS Message```, just make sure the ```SMS Message``` still contains
the ```{{ .Code }}``` variable. Also, make sure to set the ```SMS OTP Length``` to 6.

## Edge Function

If for some reason the user does not have a Whatsapp account on phone verification, we want
to send a message to it's SMS instead. We are going to do that with a ```Edge Function```. 
There's a pretty short introduction to this topic on your supabase dashboard. You can navigate
there by clicking the ```Edge Functions``` tab. Note that you will need to have docker installed
for you to build and/or deploy edge functions. What our function will do is the following:

1.- Receive a payload from Twilio with the status of a message
2.- Check if the status of the message is ```undelivered``` or ```failed```
3.- Resend the OTP through SMS if needded

This function also requires you to again use ```YOUR_API_KEY``` and also to use your SR key 
(service role key) that you can both find on your API configuration tab

```
import { serve } from 'https://deno.land/std@0.131.0/http/server.ts';

serve(async (req) => {
  if (req.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 });
  }

  const formData = new URLSearchParams(await req.text());

  const MessageStatus = formData.get('MessageStatus');
  
  if (MessageStatus === 'undelivered' || MessageStatus === 'failed') {
    // Trigger SMS OTP if WhatsApp OTP fails
    const response = await fetch('https://{{YOUR_PROJECT}}.supabase.co/auth/v1/otp', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer YOUR_SERVICE_ROLE_KEY`,
        'apikey': 'YOUR_API_KEY',
      },
      body: JSON.stringify({
        phone: formData.get('To')
      }),
    });

    if (!response.ok) {
      return new Response(response.body, { status: response.status });
    }
  }

  return new Response('OK', { status: 200 });
});
```

Now, for your last step, go to your Twilio console. If you have already integrated with
supabase, you can now go to the Messaging -> Services tab and see that there is a supabase
user in there. Click the supabase user and then go to the integration tab. There should
be a field named ```Callback URL``` where you should put your function URL. It shoud look 
something like this: ```https://{YOUR_PROJECT}.supabase.co/functions/v1/otp-fallback```
