import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import sinon from "sinon";
import { JobCapability } from "../../../src/model/jobRole";
import { capabilityService } from "../../../src/service/capabilityService";
import { expect } from "chai";


describe('capabilityService', () => {
    beforeEach(() => {
        sinon.restore();
    });

    it('should return job roles', async () => {
        const mock = new MockAdapter(axios);
        const JobCapability: JobCapability[] = [{      
            capabilityID: 2, capabilityName: 'Test capability' 
        }];
        mock.onGet(`${process.env.API_URL}api/capabilities`).reply(200, JobCapability);

        const result = await capabilityService.getCapabilities("token");
                
        expect(result).to.deep.equal(JobCapability);
    });

    it('should throw error on non 200 response', async () => {
        const mock = new MockAdapter(axios);
        mock.onGet(`${process.env.API_URL}api/capabilities`).reply(400, "Error");
        try{
            const result = await capabilityService.getCapabilities();
        }
        catch(e){
            expect(e.message).to.be.equal("Failed to get job capabilities");
        }
    });
})