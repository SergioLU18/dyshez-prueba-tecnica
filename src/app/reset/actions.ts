'use server'

import { createClient } from '../../../utils/supabase/server'
import { redirect } from 'next/navigation'


export async function updateUserPassword(newPassword: string) {
    
    const supabase = await createClient()

    const { error } = await supabase.auth.updateUser({
        password: newPassword
    })

    if(error) {
        return error.message
    }
    else {
        redirect('/login')
    }
      
}