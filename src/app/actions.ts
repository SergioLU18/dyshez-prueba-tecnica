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

export async function deleteUserTask(userTask: UserTask) {

    const supabase = await createClient()

    const { error } = await supabase.from("task").delete().eq("id", userTask.id)

    return error;

}

export async function completeUserTask(userTask: UserTask) {

    const supabase = await createClient()

    const { error } = await supabase.from("task").update({completed: true, completed_at: new Date()}).eq("id", userTask.id)

    return error;

}

export async function createUserTask(userTask: UserTask, user_id?: string) {

    const supabase = await createClient()

    const { data, error } = await supabase.from("task").insert({
        user_id: user_id,
        created_at: userTask.createdAt,
        description: userTask.description,
        completed: false,
        completed_at: null,
        title: userTask.title
    }).select()

    return { data, error}

}

export async function getUserTasks(user_id: string) {

    const supabase = await createClient()

    const { data, error } = await supabase.from("task").select().eq("user_id", user_id)

    let processedTasks: UserTask[] = []

    if(error) {
        return { processedTasks, error }
    }
    processedTasks = data.map((task) => ({
        id: task.id,
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

    const { error } = await supabase.auth.signOut()

    if (error) {
        return error
    }

    redirect('/login')
}