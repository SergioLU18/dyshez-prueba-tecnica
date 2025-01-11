'use server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '../../../utils/supabase/server'

export async function resetPassword(formData: FormData) {

    const supabase = await createClient()

    const email = formData.get('email') as string

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `http://localhost:3000/reset`,
    })
      
    return error

}

export async function login(formData: FormData, method: 'email' | 'phone') {

    const supabase = await createClient()

    const emailPhone = formData.get('email') as string
    const password = formData.get('password') as string

    if(method === 'email') {
        const { error: signInError } = await supabase.auth.signInWithPassword({
            email: emailPhone,
            password: password
        })

        if(signInError) {
            return signInError
        }
    }
    else {
        const { error: signInError } = await supabase.auth.signInWithPassword({
            phone: `52${emailPhone}`,
            password: password
        })

        if(signInError) {
            return signInError
        }
    }



    // revalidatePath('/login')
    // redirect('/')
}

export async function signup(formData: FormData) {

    const supabase = await createClient()

    const { data: signupData, error: signupError } = await supabase.auth.signUp({
        email: formData.get('email') as string,
        password: formData.get('password') as string,
    })

    if (signupError) {
        return signupError
    }

    const { error: profileError } = await supabase.from("profile").insert({
        user_id: signupData.user?.id,
        names: formData.get("names") as string,
        last_names: formData.get("lastNames") as string,
        website: formData.get("website") as string,
        email: formData.get("email") as string,
        mobile_phone: `52${(formData.get("mobile") as string).replace(/\s+/g, '')}`,
        secondary_phone: `52${(formData.get("phone") as string).replace(/\s+/g, '')}`
    })

    if(profileError) {
        return profileError
    }

}