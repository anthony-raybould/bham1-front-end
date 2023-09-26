export type Role = {
    roleID: number
    roleName: string    
}

export type User = {
    userID: number
    email: string
    role: Role
}