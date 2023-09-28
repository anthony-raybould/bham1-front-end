import axios from "axios";
import type { JobBand } from "../model/jobRole";

export const bandService = {
    async getBands(token?: string): Promise<JobBand[]> {
        try {
            
            const response = await axios.get(process.env.API_URL + "api/band", {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (response.status === 200) {
                return response.data
            }
        }
        catch (e) {
            throw new Error("Failed to get job bands")
        }
    }
}