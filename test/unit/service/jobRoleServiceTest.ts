import chai from 'chai';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { jobRoleService } from '../../../src/service/jobRoleService';
import { JobRole, JobRoleToUpdate } from '../../../src/model/jobRole';
import sinon from 'sinon';
import { capabilityService } from '../../../src/service/capabilityService';
import { bandService } from '../../../src/service/bandService';
import { JobRoles } from '../../../src/controller/jobRoleController';

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
    it('should throw an error if no token is provided', async () => {
        try {
            await jobRoleService.getJobRoles(undefined);
            expect.fail('Expected an error to be thrown');
        } catch (e) {
            expect(e.message).to.equal('You are not logged in (no token provided)');
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

    it('(getJobRoleMatrix) should throw an error if getJobRoles throws error', async () => {
        sinon.stub(jobRoleService, 'getJobRoles').throws(new Error('Failed to get job roles'));

        try {
            await jobRoleService.getJobRoleMatrix("token");
            expect.fail('Expected an error to be thrown');

        } catch(e) {
            expect(e.message).to.equal("Failed to get job roles matrix")
        }
    });

    it('(getJobRoleMatrix) should throw an error if getCapabilities throws error', async () => {
        sinon.stub(capabilityService, 'getCapabilities').throws(new Error('Failed to get job capabilities'));

        try {
            await jobRoleService.getJobRoleMatrix("token");
            expect.fail('Expected an error to be thrown');

        } catch(e) {
            expect(e.message).to.equal("Failed to get job roles matrix")
        }
    });

    it('(getJobRoleMatrix) should throw an error if getBands throws error', async () => {
        sinon.stub(bandService, 'getBands').throws(new Error('Failed to get job bands'));

        try {
            await jobRoleService.getJobRoleMatrix("token");
            expect.fail('Expected an error to be thrown');

        } catch(e) {
            expect(e.message).to.equal("Failed to get job roles matrix")
        }
    });

    it('(getJobRoleMatrix) should order job bands by ID correctly', async () => {
        sinon.stub(jobRoleService, 'getJobRoles').resolves([]);
        sinon.stub(capabilityService, 'getCapabilities').resolves([]);
        sinon.stub(bandService, 'getBands').resolves([
            {
                bandID : 7,
                bandName: "Test X"
            },
            {
                bandID : 4,
                bandName: "Test A"
            },
            {
                bandID : 9,
                bandName: "Test Q"
            }
        ]);

        const matrix = await jobRoleService.getJobRoleMatrix("test");
        expect(matrix.bands).to.deep.equal([
            {
                bandID : 4,
                bandName: "Test A"
            },
            {
                bandID : 7,
                bandName: "Test X"
            },

            {
                bandID : 9,
                bandName: "Test Q"
            }
        ]);
    });

    it('(getJobRoleMatrix) should return matrix with correct bands and capabilities', async () => {

        const bands = [
            {
                bandID : 4,
                bandName: "Test A"
            },
            {
                bandID : 7,
                bandName: "Test X"
            }
        ];
        
        const capabilities = [
            {
                capabilityID : 1,
                capabilityName: "Capability A"
            },
            {
                capabilityID : 3,
                capabilityName: "Capability C"
            }
        ];

        sinon.stub(jobRoleService, 'getJobRoles').resolves([]);
        sinon.stub(capabilityService, 'getCapabilities').resolves(capabilities);
        sinon.stub(bandService, 'getBands').resolves(bands);

        const matrix = await jobRoleService.getJobRoleMatrix("token");
        expect(matrix.bands).to.deep.equal(bands);
        expect(matrix.capabilities).to.deep.equal(capabilities);

    });

    it('(getJobRoleMatrix) should only assign job roles to their correct matrix cells', async () => {

        const bands = [
            {
                bandID : 4,
                bandName: "Test A"
            },
            {
                bandID : 7,
                bandName: "Test X"
            }
        ];
        
        const capabilities = [
            {
                capabilityID : 1,
                capabilityName: "Capability A"
            },
            {
                capabilityID : 3,
                capabilityName: "Capability C"
            }
        ];

        const jobRoles : JobRole[] = [
            {
                jobRoleID : 1,
                jobRoleName: "Test",
                jobSpecSummary: "",
                band: bands[1],
                capability: capabilities[1],
                responsibilities: "",
                sharePoint: ""
            },
            {
                jobRoleID : 2,
                jobRoleName: "Test 2",
                jobSpecSummary: "",
                band: bands[0],
                capability: capabilities[1],
                responsibilities: "",
                sharePoint: ""
            },
            {
                jobRoleID : 3,
                jobRoleName: "Test 3",
                jobSpecSummary: "",
                band: bands[1],
                capability: capabilities[0],
                responsibilities: "",
                sharePoint: ""
            }
        ];

        sinon.stub(jobRoleService, 'getJobRoles').resolves(jobRoles);
        sinon.stub(capabilityService, 'getCapabilities').resolves(capabilities);
        sinon.stub(bandService, 'getBands').resolves(bands);

        const matrix = await jobRoleService.getJobRoleMatrix("token");
        expect(matrix.jobRolesGrid[0][0]).to.deep.equal([]);
        expect(matrix.jobRolesGrid[0][1]).to.deep.equal([jobRoles[1]]);
        expect(matrix.jobRolesGrid[1][0]).to.deep.equal([jobRoles[2]]);
        expect(matrix.jobRolesGrid[1][1]).to.deep.equal([jobRoles[0]]);

    });

    it('(getJobRoleMatrix) should be able to assign multiple job roles to the same matrix cell', async () => {

        const bands = [{
            bandID : 4,
            bandName: "Test A"
        }];
                    const capabilities = [{
            capabilityID : 1,
            capabilityName: "Capability A"
        }];

        const jobRoles : JobRole[] = [
            {
                jobRoleID : 1,
                jobRoleName: "Test",
                jobSpecSummary: "",
                band: bands[0],
                capability: capabilities[0],
                responsibilities: "",
                sharePoint: ""
            },
            {
                jobRoleID : 2,
                jobRoleName: "Test 2",
                jobSpecSummary: "",
                band: bands[0],
                capability: capabilities[0],
                responsibilities: "",
                sharePoint: ""
            }
        ];

        sinon.stub(jobRoleService, 'getJobRoles').resolves(jobRoles);
        sinon.stub(capabilityService, 'getCapabilities').resolves(capabilities);
        sinon.stub(bandService, 'getBands').resolves(bands);

        const matrix = await jobRoleService.getJobRoleMatrix("token");
        expect(matrix.jobRolesGrid[0][0]).to.deep.equal(jobRoles);

    });
})});