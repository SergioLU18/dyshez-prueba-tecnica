'use server'
import { createClient } from '../../../utils/supabase/server'

export async function resetPassword(formData: FormData) {

    const supabase = await createClient()

    const email = formData.get('email') as string

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `http://localhost:3000/reset`,
    })
      
    return error

}

export async function login(formData: FormData) {

    const supabase = await createClient()

    let identifier = formData.get('email') as string
    const password = formData.get('password') as string
    const isEmail = identifier.includes("@")

    if(!isEmail) {
        identifier = `52${identifier}`
    }

    const signInCredentials = isEmail 
        ? { email: identifier, password: password } 
        : { phone: identifier, password: password };

    const { data: userData, error: signInError } = await supabase.auth.signInWithPassword(signInCredentials)

    const userPhone = userData.user?.phone
    await supabase.auth.signOut()

    if(signInError || !userPhone) {
        return {userPhone, signInError}
    }

    const { error: whatsappError } = await supabase.auth.signInWithOtp({ 
        phone: userPhone,
        options: {
            channel:'whatsapp',
        }
    })

    if(whatsappError) {
        const { error: smsError } = await supabase.auth.signInWithOtp({
            phone: userPhone
        })

        return {userPhone, error: smsError}
    }

    return {userPhone, error: whatsappError}

}

export async function resendOtp(phone: string) {

    const supabase = await createClient()

    const { error: whatsappError } = await supabase.auth.signInWithOtp({ 
        phone,
        options: {
            channel:'whatsapp',
        }
    })

    if( whatsappError ) {
        const { error: smsError } = await supabase.auth.signInWithOtp({
            phone
        })

        return {error: smsError}
    }

    return {error: whatsappError}

}

export async function uploadOtp(phone: string, token: string) {

    const supabase = await createClient()

    const { error } = await supabase.auth.verifyOtp({ phone, token, type: 'sms'})

    if(error) {
        return error
    }

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