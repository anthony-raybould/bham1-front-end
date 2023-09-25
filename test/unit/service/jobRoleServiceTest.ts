import chai from 'chai';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { jobRoleService } from '../../../src/service/jobRoleService';
import { JobRole, JobRoleToUpdate } from '../../../src/model/jobRole';
import sinon from 'sinon';

const expect = chai.expect;

describe('jobRoleService', () => {
    beforeEach(() => {
        sinon.restore();
    });

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

        const result = await jobRoleService.getJobRoles();

        expect(result).to.deep.equal(jobRoles);
    });
    
    it('should throw an error if the API call fails', async () => {
        const mock = new MockAdapter(axios);
        mock.onGet(`${process.env.API_URL}api/job-roles`).reply(500);

        try {
            await jobRoleService.getJobRoles();
            expect.fail('Expected an error to be thrown');
        } catch (e) {
            expect(e.message).to.equal('Failed to get job roles');
        }
    });
    it('should return 200 and ID of updated job', async () => {
        const mock = new MockAdapter(axios);
        const jobRoles: JobRoleToUpdate = { 
            jobRoleName: 'Test',
            jobSpecSummary: 'Test summary',
            band: { bandID: 1, bandName: 'Test band' },
            capability: { capabilityID: 2, capabilityName: 'Test capability' },
            responsibilities: 'Test responsibilities',
            sharePoint: 'Test sharepoint'
        };
        mock.onPut(`${process.env.API_URL}api/job-roles/1`).reply(200, 1);

        const result = await jobRoleService.editJobRoles(jobRoles, 1);

        expect(result).to.deep.equal(1);
    });
    it('should throw an error if the API call fails', async () => {
        const mock = new MockAdapter(axios);
        const jobRoles: JobRoleToUpdate = { 
            jobRoleName: 'Test',
            jobSpecSummary: 'Test summary',
            band: { bandID: 1, bandName: 'Test band' },
            capability: { capabilityID: 2, capabilityName: 'Test capability' },
            responsibilities: 'Test responsibilities',
            sharePoint: 'Test sharepoint'
        };
        mock.onPut(`${process.env.API_URL}api/job-roles/1`, jobRoles).reply(500);

        try {
            await jobRoleService.editJobRoles(jobRoles,1);
            expect.fail('Expected an error to be thrown');
        } catch (e) {
            expect(e.message).to.contain('Request failed with status code 500');
        }
    });

        it('should throw BadRequest error if the API return 401', async () => {
        const mock = new MockAdapter(axios);
        const jobRoles: JobRoleToUpdate = { 
            jobRoleName: 'Test',
            jobSpecSummary: 'Test summary',
            band: { bandID: 1, bandName: 'Test band' },
            capability: { capabilityID: 2, capabilityName: 'Test capability' },
            responsibilities: 'Test responsibilities',
            sharePoint: 'Test sharepoint'

        };
        mock.onPut(`${process.env.API_URL}api/job-roles/1`, jobRoles).reply(401, "Bad request");

        try {
            await jobRoleService.editJobRoles(jobRoles,1);
        } catch (e) {
            expect(e.message).to.contain('Request failed with status code 401');
        }
    });
});