'use server'

import { createClient } from '../../../utils/supabase/server'


export async function updateUserPassword(newPassword: string) {
    
    const supabase = await createClient()

    const { error } = await supabase.auth.updateUser({
        password: newPassword
    })

    if(error) {
        return error
    }      
}

export async function exchangeCodeSession(code: string) {

    const supabase = await createClient()

    const { error } = await supabase.auth.exchangeCodeForSession(code);

    return error

}