import axios from "axios";
import type { JobBand, JobCapability, JobRole, JobRoleToUpdate } from "../model/jobRole";
import { JobRoleMatrix } from "../model/jobRoleMatrix";
import { capabilityService } from "./capabilityService";
import { bandService } from "./bandService";
import { JobRoles } from "../controller/jobRoleController";

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
            if (response.status === 200) {
                return response.data;
            }
            throw new Error('Update failed');
        } catch (e) {
            throw new Error('Failed to update job role');
        }
    },

    async getJobRoleMatrix(): Promise<JobRoleMatrix> {
        try {
            const roles = await jobRoleService.getJobRoles();

            const ascendingBands = await bandService.getBands();
            ascendingBands.sort((a, b) => a.bandID - b.bandID)

            const capabilities = await capabilityService.getCapabilities();

            const jobRolesGrid: JobRole[][][] =
                seperateRolesByBandAndCapability(ascendingBands, capabilities, roles);

            return {
                bands : ascendingBands,
                capabilities : capabilities,
                jobRolesGrid : jobRolesGrid
            }

        }
        catch (e) {
            throw new Error("Failed to get job roles matrix")
        }
    }
}

function seperateRolesByBandAndCapability(bands: JobBand[], capabilities: JobCapability[], roles: JobRole[]) {
    const seperatedJobRoles: JobRole[][][] = [];
    for (let bandIndex = 0; bandIndex < bands.length; bandIndex++) {

        const band = bands[bandIndex];
        seperatedJobRoles[bandIndex] = [];

        for (let capabilityIndex = 0; capabilityIndex < capabilities.length; capabilityIndex++) {

            const capability = capabilities[capabilityIndex];

            seperatedJobRoles[bandIndex][capabilityIndex] = roles.
                filter(role => jobRoleHasExpectedBandAndCapability(role, band, capability));
        }
    }
    return seperatedJobRoles;
}

function jobRoleHasExpectedBandAndCapability(role : JobRole, band : JobBand, capability : JobCapability) {

    return role.band.bandID == band.bandID 
        && role.capability.capabilityID == capability.capabilityID
}
