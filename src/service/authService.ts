import type { Login } from "../model/auth";
import axios from "axios";
import { User } from "../model/user";

export const authService = {
    async login(login: Login): Promise<string> {
        try {
            const response = await axios.post(process.env.API_URL + "api/login", login)
            if (response.status === 200) {
                return response.data
            }
        } catch (e) {
            if (e.response?.status === 401) {
                throw new Error("Invalid credentials - 401")
            }
            else if (e.response?.status === 500) {
                throw new Error("Internal server error - 500")
            }
        }
        throw new Error("could not login - An error has occured.")
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