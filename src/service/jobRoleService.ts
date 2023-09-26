import axios from "axios";
import type { JobRole } from "../model/jobRole";

export const jobRoleService = {
    async getJobRoles(token?: string): Promise<JobRole[]> {
        if (!token) throw new Error("You are not logged in (no token provided)")
        try {
            const response = await axios.get(process.env.API_URL + "api/job-roles", {
                headers: { Authorization: `Bearer ${token}` },
            });
            return response.data
        } catch (e) { 
            throw new Error("Failed to get job roles")
        }
    }
}
