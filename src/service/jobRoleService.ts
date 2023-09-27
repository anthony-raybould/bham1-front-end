import axios from "axios";
import type { JobRole, JobRoleToUpdate, JobRoleToCreate } from "../model/jobRole";

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

    async getJobRole(id: number): Promise<JobRole> {
        try {
            const response = await axios.get(process.env.API_URL + "api/job-roles/" + id);
            if (response.status === 200) {
                return response.data
            }
        }
        catch (e) {
            console.log("Failed to get job role:", e);
            throw new Error("Failed to get job role")
        }
    },

    async deleteJobRole(id: number): Promise<void>{
        try {
            const response = await axios.delete(process.env.API_URL + "api/job-roles/" + id);
            if (response.status === 200) {
                return response.data
            }
        }
        catch (e) {
            console.log("Failed to delete job role:", e);
            throw new Error("Failed to delete job role")
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
    }, 
    async createJobRole(jobRole: JobRoleToCreate): Promise<number> {
        try {
            const response = await axios.post(`${process.env.API_URL}api/job-roles/`, jobRole)
            if (response.status === 200) {
                return response.data;
            }
            throw new Error('Create failed');
        } catch (e) {
            throw new Error(e.response.data);
        }
    }
}

