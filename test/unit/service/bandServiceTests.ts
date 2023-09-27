import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import sinon from "sinon";
import { JobBand, JobCapability } from "../../../src/model/jobRole";
import { capabilityService } from "../../../src/service/capabilityService";
import { expect } from "chai";
import { bandService } from "../../../src/service/bandService";


describe('bandService', () => {
    beforeEach(() => {
        sinon.restore();
    });

    it('should return band roles', async () => {
        const mock = new MockAdapter(axios);
        const band: JobBand[] = [{      
            bandID: 2, bandName: 'Test band' 
        }];
        mock.onGet(`${process.env.API_URL}api/band`).reply(200, band);

        const result = await bandService.getBands();

        expect(result).to.deep.equal(band);
    });
    it('should throw  error on non 200 response', async () => {
        const mock = new MockAdapter(axios);
        mock.onGet(`${process.env.API_URL}api/band`).reply(400);
        try{
            const result = await bandService.getBands();
        }
        catch(e)
        {
            expect(e.message).to.be.equal("Failed to get job bands");
        }
    });
})