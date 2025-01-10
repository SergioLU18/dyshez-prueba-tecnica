'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '../../utils/supabase/server'
import { redirect } from 'next/navigation'
import { UserProfile, UserTask } from '@/types'

export async function getUserData() {

    const supabase = await createClient()

    const { data: user, error: userError } = await supabase.auth.getUser()
    
    if(userError) {
        revalidatePath('/')
        redirect('/login')
    }
    
    const { data: profiles, error: profileError } = await supabase.from("profile").select().eq("user_id", user.user.id)

    if(profileError) {
        revalidatePath('/')
        redirect('/login')
    }

    return {
        userId: profiles[0].user_id,
        email: profiles[0].email,
        names: profiles[0].names,
        mobile: profiles[0].mobile
    } as UserProfile

}

export async function getUserTasks(user_id: string) {

    const supabase = await createClient()

    const { data, error } = await supabase.from("task").select().eq("user_id", user_id)

    let processedTasks: UserTask[] = []

    if(error) {
        return { processedTasks, error }
    }
    processedTasks = data.map((task) => ({
        createdAt: new Date(task.created_at),
        description: task.description,
        title: task.title,
        completed: task.completed,
        completedAt: new Date(task.completed_at)
    }));

    return { processedTasks, error }
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