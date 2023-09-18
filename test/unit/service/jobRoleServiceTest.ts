import chai from 'chai';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { getJobRoles } from '../../../src/service/jobRoleService';
import { JobRole } from '../../../src/model/jobRole';

const expect = chai.expect;

describe('jobRoleService', () => {

    it('should return job roles', async () => {
        const mock = new MockAdapter(axios);
        const jobRoles: JobRole[] = [{ 
            jobRoleID: 1,
            jobRoleName: 'Test',
            jobSpecSummary: 'Test summary',
            band: { bandID: 1, bandName: 'Test band' },
            capability: { capabilityID: 2, capabilityName: 'Test capability' },
            responsibilities: 'Test responsibilities',
            sharePoint: 'Test sharepoint'
        }];
        mock.onGet(`${process.env.API_URL}api/job-roles`).reply(200, jobRoles);

        const result = await getJobRoles();

        expect(result).to.deep.equal(jobRoles);
    });
    
    it('should throw an error if the API call fails', async () => {
        const mock = new MockAdapter(axios);
        mock.onGet(`${process.env.API_URL}api/job-roles`).reply(500);

        try {
            await getJobRoles();
            expect.fail('Expected an error to be thrown');
        } catch (e) {
            expect(e.message).to.equal('Failed to get job roles');
        }
    });

});