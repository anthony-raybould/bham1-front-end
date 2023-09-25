import axios from "axios";
import type { JobRole, JobRoleToUpdate } from "../model/jobRole";
import { symlinkSync } from "fs";

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
        const response = await axios.put(`${process.env.API_URL}api/job-roles/${jobRoleID}`, jobRole);
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

