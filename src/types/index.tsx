export type UserProfile = {
    userId: string,
    email: string,
    names: string,
    mobile: string
}

export type UserTask = {
    id: number | null,
    createdAt: Date,
    title: string,
    description: string,
    completed: boolean,
    completedAt: Date | null
}