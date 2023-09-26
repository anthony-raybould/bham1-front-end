import type { Request, Response } from "express";
import type { JobBand, JobCapability, JobRole, JobRoleToUpdate } from "../model/jobRole";
import { jobRoleService } from "../service/jobRoleService";
import { bandService } from "../service/bandService";
import { capabilityService } from "../service/capabilityService";
import { validateCreate } from "../validator/createJobRoleValidator";

export namespace JobRoles {
    export async function get(req: Request, res: Response): Promise<void> {
        try {
            const jobRoles: JobRole[] = await jobRoleService.getJobRoles();
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

        try {
            const jobRoleToUpdate: JobRoleToUpdate = {
                jobRoleName: jobRoleName,
                jobSpecSummary:jobSpecSummary ,
                band: band,
                capability: capability,
                responsibilities: responsibilities,
                sharePoint: sharePoint
            }
            const updatedJobRoleData = await jobRoleService.editJobRoles(jobRoleToUpdate, id);
            res.redirect('/job-roles')
        } catch (e) {
            res.locals.errorMessage = e;
            res.render('job-roles', {
                errorMessage: e.message,
            });
        }
    }

    export async function getCreate(req:Request, res:Response): Promise<void> {
        try {
            const bands: JobBand[] = await bandService.getBands();
            const capabilities: JobCapability[] = await capabilityService.getCapabilities();
            res.render("create-job-role", {bands, capabilities}); 
        } catch (e) {
            res.locals.errorMessage = 'Failed to load create job role page';
            res.render("create-job-role"); 
        }
    }

    export async function postCreate(req: Request, res: Response): Promise<void> {
        let id: Number 
        const { jobRoleName, band, capability, jobSpecSummary, responsibilities, sharePoint } = req.body;
        const jobRoleToCreate: JobRoleToUpdate = {
            jobRoleName: jobRoleName,
            jobSpecSummary:jobSpecSummary ,
            band: band,
            capability: capability,
            responsibilities: responsibilities,
            sharePoint: sharePoint
        }

        try {
            validateCreate(jobRoleToCreate);

            id = await jobRoleService.createJobRole(jobRoleToCreate)
            res.redirect('/job-roles')
        } catch (e) {
            const bands: JobBand[] = await bandService.getBands();
            const capabilities: JobCapability[] = await capabilityService.getCapabilities();

            console.error(e)
            res.locals.errorMessage = e;
            res.render('create-job-role', {...req.body, bands, capabilities})
        }
    }
}