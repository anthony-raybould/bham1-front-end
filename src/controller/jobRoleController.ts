import type { Request, Response } from "express";
import type { JobRole } from "../model/jobRole";
import { jobRoleService } from "../service/jobRoleService";

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
    export async function getIndex(req: Request, res: Response): Promise<void> {
        res.render("index");
    }
}