import axios from "axios";
import type { JobRole, JobRoleToUpdate } from "../model/jobRole";

export const jobRoleService = {
    async getJobRoles(): Promise<JobRole[]> {
        try {
            const response = await axios.get(process.env.API_URL + "api/job-roles");
            if (response.status === 200) {
                return response.data
            }
        }
        catch (e) {
            throw new Error("Failed to get job roles")
        }
    },
    async editJobRoles(jobRole: JobRoleToUpdate, jobRoleID: number): Promise<JobRole>{
        try {
            const response = await axios.put(`${process.env.API_URL}api/job-roles/${jobRoleID}`, jobRole);
            console.log(response.data)
            if (response.status === 200) {
                return response.data;
            }
            throw new Error('Update failed');
        } catch (e) {
            console.log(e.message)
            throw new Error('Failed to update job role');
        }
    }
}
