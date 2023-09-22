import type { Login } from "../model/auth";
import type { User } from "../model/user";
import axios from "axios";

export const authService = {
    async login(login: Login): Promise<string> {
        try {
            const response = await axios.post(process.env.API_URL + "api/login", login)
            if (response.status === 200) {
                return response.data
            }
        } catch (e) {
            if (e.response?.status === 401) {
                throw new Error("Your email or password is incorrect")
            }
            else if (e.response?.status === 500) {
                throw new Error("Internal server error")
            }
        }
        throw new Error("Failed to login")
    },
    
    async whoami(token: string): Promise<User> {
        try {
            const response = await axios.get(process.env.API_URL + "api/whoami", {
                headers: { Authorization: `Bearer ${token}` },
            })
            if (response.status === 200) {
                return response.data as User
            }
        } catch (e) {
            if (e.response?.status === 401) {
                throw new Error("User is not logged in")
            }
        }
        throw new Error("Failed to fetch user")
    }
}