import chai from 'chai';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { jobRoleService } from '../../../src/service/jobRoleService';
import { JobRole } from '../../../src/model/jobRole';
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

        const result = await jobRoleService.getJobRoles('token');

        expect(result).to.deep.equal(jobRoles);
    });
    
    it('should throw an error if the API call fails', async () => {
        const mock = new MockAdapter(axios);
        mock.onGet(`${process.env.API_URL}api/job-roles`).reply(500);

        try {
            await jobRoleService.getJobRoles('token');
            expect.fail('Expected an error to be thrown');
        } catch (e) {
            expect(e.message).to.equal('Failed to get job roles');
        }
    });
    
    it('should throw an error if no token is provided', async () => {
        try {
            await jobRoleService.getJobRoles(undefined);
            expect.fail('Expected an error to be thrown');
        } catch (e) {
            expect(e.message).to.equal('You are not logged in (no token provided)');
        }
    });

    it('should return job role', async () => {
        const mock = new MockAdapter(axios);
        const jobRole: JobRole = { 
            jobRoleID: 1,
            jobRoleName: 'Test',
            jobSpecSummary: 'Test summary',
            band: { bandID: 1, bandName: 'Test band' },
            capability: { capabilityID: 2, capabilityName: 'Test capability' },
            responsibilities: 'Test responsibilities',
            sharePoint: 'Test sharepoint'
        };
        mock.onGet(`${process.env.API_URL}api/job-roles/1`).reply(200, jobRole);

        const result = await jobRoleService.getJobRole(1);
        expect(result).to.deep.equal(jobRole);
    });

    it('should throw an error if the API call fails', async () => {
        const mock = new MockAdapter(axios);
        mock.onGet(`${process.env.API_URL}api/job-roles/0`).reply(500);

        try {
            await jobRoleService.getJobRole(0);
            expect.fail('Expected an error to be thrown');
        } catch (e) {
            expect(e.message).to.equal('Failed to get job role');
        }
    });

    it('should delete a job role when valid id provided', async () => {
        const mock = new MockAdapter(axios);
        mock.onDelete(`${process.env.API_URL}api/job-roles/1`).reply(200, 1);

        const result = await jobRoleService.deleteJobRole(1);
        expect(result).to.equal(1);
    
    });

    it('should return error and not delete when invalid id is provided', async () => {
        const mock = new MockAdapter(axios);
        var error = ""

        mock.onDelete(`${process.env.API_URL}api/job-roles/-1`).reply(500);
        
        try {
            await jobRoleService.deleteJobRole(-1);
        } 
        catch (e) {
            error = (e as Error).message
        }
        
        expect(error).to.equal('Failed to delete job role')
    
    }); 

});