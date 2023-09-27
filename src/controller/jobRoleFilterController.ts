import type { Request, Response } from "express";
import { bandService } from "../service/bandService";
import { capabilityService } from "../service/capabilityService";

const appendURLParams = (params: URLSearchParams, name: string, object: any): void => {
    if (object) {
        if (Array.isArray(object)) {
            params.append(name, encodeURIComponent(JSON.stringify(object)));
        } else {
            params.append(name, encodeURIComponent(object));
        }
    }
}

const filter = (filterString: string): (number[] | undefined) => {
    if (!filterString) {
        return undefined;
    }

    let filters = JSON.parse(decodeURIComponent(filterString));
    if (!filters) {
        return undefined;
    }
    let filteredList: number[];
    if (!Array.isArray(filters)) {
        filteredList = [parseInt(filters)];
    } else {
        filteredList = filters.map(filter => parseInt(filter));
    }

    return filteredList;
}
 
export const encodeURLFilterParams = (name: string | undefined, band: number | number[] | undefined, capability: number | number[] | undefined): string => {
    const searchParams = new URLSearchParams();
    appendURLParams(searchParams, "nameFilter", name);
    appendURLParams(searchParams, "bandFilter", band);
    appendURLParams(searchParams, "capabilityFilter", capability);
    
    return searchParams.toString();
}

export const decodeURLFilterParams = (req: Request): { nameFilter?: string, bandFilter?: number[], capabilityFilter?: number[] } => {
    let nameFilter: string | undefined;
    let bandFilter: number[] | undefined;
    let capabilityFilter: number[] | undefined;

    if (req.query?.nameFilter) {
        nameFilter = decodeURIComponent(req.query.nameFilter as string);
    }
    bandFilter = filter(req.query?.bandFilter as string);
    capabilityFilter = filter(req.query?.capabilityFilter as string);
    
    return {
        ...(nameFilter && { nameFilter }),
        ...(bandFilter && { bandFilter }),
        ...(capabilityFilter && { capabilityFilter })
    };
}

export namespace JobRolesFilter {
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
}