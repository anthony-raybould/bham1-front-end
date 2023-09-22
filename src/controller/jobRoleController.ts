import type { Request, Response } from "express";
import type { JobBand, JobCapability, JobRole, JobRoleToUpdate } from "../model/jobRole";
import { jobRoleService } from "../service/jobRoleService";
import { bandService } from "../service/bandService";
import { capabilityService } from "../service/capabilityService";
import { JobRoleMatrix } from "../model/jobRoleMatrix";

export namespace JobRoles {
    export async function get(req: Request, res: Response): Promise<void> {
        try {
            const jobRoles: JobRole[] = await jobRoleService.getJobRoles();
            console.log(jobRoles);
            res.locals.jobRoles = jobRoles;
        } catch (e) {
            res.locals.errorMessage = e;
        }
        res.render("job-roles");
    }

    export async function getEdit(req:Request, res:Response) : Promise<void> {
        const { id } = req.params;
        const jobRolesService: JobRole[] = await jobRoleService.getJobRoles();
        const bands: JobBand[] = await bandService.getBands();
        const capabilities: JobCapability[] = await capabilityService.getCapabilities();

        const jobRoles = jobRolesService.find(i => i.jobRoleID === parseInt(id));
        
        res.render(`job-roles/edit`,{
            jobRoles,
            bands,
            capabilities
        })
    }

    export async function postEdit(req: Request, res: Response): Promise<void> {
        const id: number = parseInt(req.params.id); // Extract the jobRoleID from the URL
        const { jobRoleName, band, capability, jobSpecSummary, responsibilities, sharePoint } = req.body;

        console.log(band)
        try {
            const jobRoleToUpdate: JobRoleToUpdate = {
                jobRoleName: jobRoleName,
                jobSpecSummary:jobSpecSummary ,
                band: band,
                capability: capability,
                responsibilities: responsibilities,
                sharePoint: sharePoint
            }
            console.log(JSON.stringify(jobRoleToUpdate))    
            const updatedJobRoleData = await jobRoleService.editJobRoles(jobRoleToUpdate, id);
            res.render('job-roles')
        } catch (e) {
            res.locals.errorMessage = e;
            res.render('job-roles', {
                errorMessage: e.message,
            });
        }
    }

    export async function getJobRoleMatrix(req: Request, res: Response): Promise<void> {
        try {
            // Get a 3D array of roles (by band, then capability, then roles matching)
            const matrix : JobRoleMatrix = await jobRoleService.getJobRoleMatrix();
            res.locals.matrix = matrix;
        } catch (e) {
            res.locals.errorMessage = e;
        }
        
        res.render("job-role-matrix");
    }
}