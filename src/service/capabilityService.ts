import axios from "axios";
import type { JobCapability } from "../model/jobRole";
import { CreateCapabilityRequest } from "../model/createCapabilityRequest";

export const capabilityService = {
    async getCapabilities(token?: string): Promise<JobCapability[]> {
        try {
            if (!token) throw new Error("You are not logged in (no token provided)")
            const response = await axios.get(process.env.API_URL + "api/capabilities", {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (response.status === 200) {
                return response.data
            }
        }
        catch (e) {
            throw new Error("Failed to get job capabilities")
        }
    },

    async createCapability(createCapabilityRequest : CreateCapabilityRequest, token? : string): Promise<void> {

        if (!token) throw new Error("You are not logged in (no token provided)")

        try {
            const response = await axios.post(`${process.env.API_URL}api/capabilities/`, createCapabilityRequest, { 
                headers: { Authorization: `Bearer ${token}` }
            });

            if (response.status === 200) {
                return;
            } 
            if(response.status === 400) {
                throw new Error(`Bad request. ${response.data.errorMessage}`);
            }
            else {
                throw new Error(response.data.errorMessage);
            }
        } catch (e) {
            console.error(e);
            throw new Error("Failed creating capability");
        }
    }
}