import axios from "axios";
import type { JobCapability } from "../model/jobRole";
import { CreateCapabilityRequest } from "../model/createCapabilityRequest";

export const capabilityService = {
    async getCapabilities(): Promise<JobCapability[]> {
        try {
            const response = await axios.get(process.env.API_URL + "api/capabilities");
            if (response.status === 200) {
                return response.data
            }
        }
        catch (e) {
            throw new Error("Failed to get job capabilities")
        }
    },

    async createCapability(createCapabilityRequest : CreateCapabilityRequest): Promise<void> {

        try {
            const response = await axios.post(`${process.env.API_URL}api/capabilities/`, createCapabilityRequest);

            if (response.status === 200) {
                return;
            } 
            if(response.status === 400)
            {
                throw new Error(`Bad request. ${response.data.errorMessage}`);
            }
            else{
                throw new Error(response.data.errorMessage);
            }
        } catch (e) {
            console.error(e);
            throw new Error("Failed creating capability");
        }
    }
}