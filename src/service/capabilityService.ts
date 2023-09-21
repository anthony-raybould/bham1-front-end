import axios from "axios";
import type { JobCapability } from "../model/jobRole";

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
    }
}