import type { Request, Response } from "express";
import { capabilityService } from "../service/capabilityService";
import { validateCreate } from "../validator/capabilityValidator";

export namespace CapabilityController {

    export async function getCreate(req:Request, res:Response) : Promise<void> {
        
        res.render("create-capability");
    }

    export async function postCreate(req: Request, res: Response): Promise<void> {

        const createCapabilityRequest = {
            capabilityName: req.body.capabilityName
        }

        try {
            
            validateCreate(createCapabilityRequest);

            await capabilityService.createCapability(createCapabilityRequest);

            res.render('create-capability-success', {
                capabilityName: createCapabilityRequest.capabilityName.trim()
            });

        } catch (e) {
            res.locals.errorMessage = e.message;
            res.render('create-capability', createCapabilityRequest);
        }
    }
}