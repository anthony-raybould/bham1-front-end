import type { Request, Response } from "express";
import type { JobBand, JobCapability, JobRole, JobRoleToUpdate } from "../model/jobRole";
import { jobRoleService } from "../service/jobRoleService";
import { bandService } from "../service/bandService";
import { capabilityService } from "../service/capabilityService";
import { validate } from "../validator/editJobRoleValidator";

const appendURLParams = (params: URLSearchParams, name: string, object: any): void => {
    if (object) {
        if (Array.isArray(object)) {
            params.append(name, encodeURIComponent(JSON.stringify(object)));
        } else {
            params.append(name, encodeURIComponent(object));
        }
    }
}

const encodeURLFilterParams = (name: string, band: string | string[], capability: string | string[]): string => {
    const searchParams = new URLSearchParams();
    appendURLParams(searchParams, "nameFilter", name);
    appendURLParams(searchParams, "bandFilter", band);
    appendURLParams(searchParams, "capabilityFilter", capability);
    
    return searchParams.toString();
}

const decodeURLFilterParams = (req: Request) => {
    let filters = {} as any;
    if (req.query?.nameFilter) {
        filters.nameFilter = decodeURIComponent(req.query.nameFilter as string);
    }
    if (req.query?.bandFilter) {
        const bandFilter = JSON.parse(decodeURIComponent(req.query.bandFilter as string));
        let bandFilterArray: number[];
        if (!Array.isArray(bandFilter)) {
            bandFilterArray = [parseInt(bandFilter)];                    
        } else {
            bandFilterArray = bandFilter.map(band => parseInt(band));        
        }
        filters.bandFilter = bandFilterArray;
    }
    if (req.query?.capabilityFilter) {
        const capabilityFilter = JSON.parse(decodeURIComponent(req.query.capabilityFilter as string));
        let capabilityFilterArray: number[];
        if (!Array.isArray(capabilityFilter)) {
            capabilityFilterArray = [parseInt(capabilityFilter)];
        } else {
            capabilityFilterArray = capabilityFilter.map(capability => parseInt(capability));        
        }
        filters.capabilityFilter = capabilityFilterArray;
    }
    
    return filters;
}

export namespace JobRoles {
    export async function get(req: Request, res: Response): Promise<void> {
        res.locals.filtered = false;

        try {
            let jobRoles: JobRole[] = await jobRoleService.getJobRoles();
            const { nameFilter, bandFilter, capabilityFilter } = decodeURLFilterParams(req);
            if (nameFilter) {
                const lowerCaseFilter = nameFilter.toLowerCase();
                jobRoles = jobRoles.filter(jobRole => jobRole.jobRoleName.toLowerCase().includes(lowerCaseFilter));
                res.locals.filtered = true;
            }
            if (bandFilter) {
                jobRoles = jobRoles.filter(jobRole => bandFilter.includes(jobRole.band.bandID));
                res.locals.filtered = true;
            }
            if (capabilityFilter) {
                jobRoles = jobRoles.filter(jobRole => capabilityFilter.includes(jobRole.capability.capabilityID));
                res.locals.filtered = true;
            }
            
            res.locals.currentFilterParams = encodeURLFilterParams(nameFilter, bandFilter, capabilityFilter);
            res.locals.jobRoles = jobRoles;
        } catch (e) {
            res.locals.errorMessage = e.message;
        }
        res.render("job-roles");
    }
    
    export async function getFilter(req: Request, res: Response): Promise<void> {
        const { nameFilter, bandFilter, capabilityFilter } = decodeURLFilterParams(req);
        res.locals.nameFilter = nameFilter || "";
        res.locals.bandFilter = bandFilter || [];
        res.locals.capabilityFilter = capabilityFilter || [];

        try {
            const capabilities = await capabilityService.getCapabilities();
            const bands = await bandService.getBands();
            res.locals.capabilities = capabilities;
            res.locals.bands = bands;
        } catch (e) {
            res.locals.errorMessage = e.message;
        }
        res.render("job-roles/filter");    
    }
    
    export async function postFilter(req: Request, res: Response): Promise<void> {
        res.redirect(`/job-roles?${encodeURLFilterParams(req.body.name, req.body.band, req.body.capability)}`);
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