import axios from "axios";
import type { JobCapability } from "../model/jobRole";

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
    }
}