import type { Request, Response } from "express";
import type { JobBand, JobCapability, JobRole, JobRoleToUpdate } from "../model/jobRole";
import { jobRoleService } from "../service/jobRoleService";
import { bandService } from "../service/bandService";
import { capabilityService } from "../service/capabilityService";
import { validate } from "../validator/editJobRoleValidator";


const orderJobRolesByProperty = (list: JobRole[], property: keyof JobRole, asc: boolean) => {
    if (typeof list[0][property] === "string") {
        list.sort((a, b) => asc ?
                (a[property] as string).localeCompare(b[property] as string) :
                (b[property] as string).localeCompare(a[property] as string)
        );
    }
};

const orderJobRolesByCapability = (list: JobRole[], asc: boolean) => {
    list.sort((a, b) => asc ?
            (a.capability.capabilityName).localeCompare(b.capability.capabilityName) :
            (b.capability.capabilityName).localeCompare(a.capability.capabilityName)
    );
};

const orderJobRolesByBand = (list: JobRole[], asc: boolean) => {
    list.sort((a, b) => asc ?
            (a.band.bandName).localeCompare(b.band.bandName) :
            (b.band.bandName).localeCompare(a.band.bandName)
    );
};

const getSortQueryString = (req: Request, property: string) => {
    const query = req.query[property] as string;
    
    if (query === "asc") {
        return `?${new URLSearchParams({ [property]: "desc" }).toString()}`;
    } else if (query === undefined) {
        return `?${new URLSearchParams({ [property]: "asc" }).toString()}`;
    } 

    return '';
};

const getSortHTMLSymbol = (req: Request, property: string) => {
    const query = req.query[property] as string;

    if (query === "asc") {
        return "&uarr;";
    } else if (query === "desc") {
        return "&darr;";
    }

    return '';
};

export namespace JobRoles {
    export async function get(req: Request, res: Response): Promise<void> {
        const nameOrder = req.query?.nameOrder as string;
        const capabilityOrder = req.query?.capabilityOrder as string;
        const bandOrder = req.query?.bandOrder as string;
        
        if (req.query && Object.keys(req.query).length > 1) {
            const first = Object.keys(req.query)[0];
            res.redirect(`/job-roles?${new URLSearchParams({ [first]: req.query[first] as string }).toString()}`);
            return;
        }
        
        try {
            const jobRoles: JobRole[] = await jobRoleService.getJobRoles(req.session.token);
            if (nameOrder) {
                orderJobRolesByProperty(jobRoles, "jobRoleName", nameOrder === "asc");
            } else if (capabilityOrder) {
                orderJobRolesByCapability(jobRoles, capabilityOrder === "asc");
            } else if (bandOrder) {
                orderJobRolesByBand(jobRoles, bandOrder === "asc");
            }
            res.locals.jobRoles = jobRoles;
            res.locals.getSortQueryString = (property: string) => { return getSortQueryString(req, property) };
            res.locals.getSortHTMLSymbol = (property: string) => { return getSortHTMLSymbol(req, property) };
        } catch (e) {
            res.locals.errorMessage = e.message;
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

    export async function getEdit(req:Request, res:Response) : Promise<void> {
        const { id } = req.params;
        const jobRolesService: JobRole[] = await jobRoleService.getJobRoles(req.session.token);
        const bands: JobBand[] = await bandService.getBands(req.session.token);
        const capabilities: JobCapability[] = await capabilityService.getCapabilities(req.session.token);

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
        const jobRoleToUpdate: JobRoleToUpdate = {
            jobRoleName: jobRoleName,
            jobSpecSummary:jobSpecSummary ,
            band: band,
            capability: capability,
            responsibilities: responsibilities,
            sharePoint: sharePoint
        }
        try {
            
            validate(jobRoleToUpdate);

            const updatedJobRoleData = await jobRoleService.editJobRoles(jobRoleToUpdate, id);
            res.redirect('/job-roles')
        } catch (e) {
            res.locals.errorMessage = e;
            res.render('job-roles/edit', {
                errorMessage: e.message,
                jobRoles: jobRoleToUpdate
            });
        }
    }

}