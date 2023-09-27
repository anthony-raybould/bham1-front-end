import type { Request, Response } from "express";
import type { JobRole } from "../model/jobRole";
import { jobRoleService } from "../service/jobRoleService";

export namespace JobRoles {
    export async function get(req: Request, res: Response): Promise<void> {
        try {
            const jobRoles: JobRole[] = await jobRoleService.getJobRoles(req.session.token);
            res.locals.jobRoles = jobRoles;
        } catch (e) {
            res.locals.errorMessage = e;
        }

        res.render("job-roles");
    }

    export async function getJobRoleById(req: Request, res: Response): Promise<void> {
        try {
            const id: number = parseInt(req.params.id)
            const jobRole: JobRole = await jobRoleService.getJobRole(id);
            res.locals.jobRole = jobRole;
        } catch (e) {
            res.locals.errorMessage = e;
        }
        
        res.render("view-job-role");
    }

    export async function getJobRoleByIdForDelete(req: Request, res: Response): Promise<void> {
        try {
            const id: number = parseInt(req.params.id)
            const jobRole: JobRole = await jobRoleService.getJobRole(id);
            res.locals.jobRole = jobRole;
        } catch (e) {
            res.locals.errorMessage = e;
        }
        
        res.render("delete-job-role");
    }

    export async function deleteJobRole(req: Request, res: Response): Promise<void> {
        try {
            const id: number = parseInt(req.params.id)
            await jobRoleService.deleteJobRole(id);
            res.redirect("/job-roles");
        } catch (e) {
            res.locals.errorMessage = e;
        }
    }

}