import type { Request, Response } from "express";
import type { JobRole } from "../model/jobRole";
import { jobRoleService } from "../service/jobRoleService";


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
}