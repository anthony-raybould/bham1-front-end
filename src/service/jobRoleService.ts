import axios from "axios";
import type { JobRole, JobRoleToUpdate } from "../model/jobRole";

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
    },
    async editJobRoles(jobRole: JobRoleToUpdate, jobRoleID: number, token?: string, ): Promise<JobRole>{
        const response = await axios.put(`${process.env.API_URL}api/job-roles/${jobRoleID}`, jobRole, {
                headers: { Authorization: `Bearer ${token}` }
            });
        if (response.status === 200) {
            return response.data;
        }
        else if(response.status === 401)
        {
            throw new Error(`Bad request. ${response.data.errorMessage}`)
        }
        else{
            throw new Error(response.data.errorMessage)
        }
    }
}

