import { CreateCapabilityRequest } from "../model/createCapabilityRequest";
import { ValidationException } from "./editJobRoleValidator";

export function validateCreate(createCapabilityRequest : CreateCapabilityRequest) : void {

    if (!createCapabilityRequest.capabilityName) {
        throw new ValidationException("Invalid: capability name is null");
    }

    if (createCapabilityRequest.capabilityName.trim().length == 0) {
        throw new ValidationException("Invalid: capability name is empty");
    }

    if (createCapabilityRequest.capabilityName.length > 64) {
        throw new ValidationException("Invalid: capability name exceeds size limit (64 characters)");
    }
}