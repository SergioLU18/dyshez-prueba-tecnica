'use server'

import { createClient } from '../../utils/supabase/server'
import { redirect } from 'next/navigation'

export async function getUserEmail() {
    
    const supabase = await createClient()

    const { data, error } = await supabase.auth.getUser()

    if (error || !data?.user) {
        return error
    }

    return data.user.email
}

export async function logout() {

    const supabase = await createClient()

    // type-casting here for convenience
    // in practice, you should validate your inputs

    const { error } = await supabase.auth.signOut()

    if (error) {
        return error
    }

    redirect('/login')
}