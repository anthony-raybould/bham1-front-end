import chai from 'chai';
import request from 'supertest'
import express from 'express';
import sinon from 'sinon';
import { jobRoleService } from '../../../src/service/jobRoleService';
import router from '../../../src/router';
import { bandService } from '../../../src/service/bandService';
import { capabilityService } from '../../../src/service/capabilityService';
import { JobRole } from '../../../src/model/jobRole';
const expect = chai.expect;

const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(router);

describe('jobRoleController', () => {
    beforeEach(() => {
        sinon.restore();
    });

    it('should render job-roles.html template with no job roles', async () => {
        sinon.stub(jobRoleService, 'getJobRoles').resolves([]);

        request(app)
            .get('/job-roles')
            .expect(200)
            .expect('Content-Type', 'text/html; charset=utf-8')
            .end((err, res) => {
                expect(res.text).to.contain('<h1>Job Roles</h1>');
            }
        );
    });
    it('should render job-roles.html template with job roles', async () => {
        sinon.stub(jobRoleService, 'getJobRoles').resolves([{ 
            jobRoleID: 1,
            jobRoleName: 'Test job role',
            jobSpecSummary: 'Test summary',
            band: { bandID: 1, bandName: 'Test band' },
            capability: { capabilityID: 2, capabilityName: 'Test capability' },
            responsibilities: 'Test responsibilities',
            sharePoint: 'Test sharepoint'
        }]);

        request(app)
            .get('/job-roles')
            .expect(200)
            .expect('Content-Type', 'text/html; charset=utf-8')
            .end((err, res) => {
                expect(res.text).to.contain('<h1>Job Roles</h1>');
                expect(res.text).to.contain('Test job role');
            }
        );
    });
    it('should render job-roles.html template with error message', async () => {
        sinon.stub(jobRoleService, 'getJobRoles').throws(new Error('Test error'));

        request(app)
            .get('/job-roles')
            .expect(200)
            .expect('Content-Type', 'text/html; charset=utf-8')
            .end((err, res) => {
                expect(res.text).to.contain('<h1>Job Roles</h1>');
                expect(res.text).to.contain('Test error');
            }
        );
    });
    it('should render job-roles/edit.html template', async () => {
        sinon.stub(jobRoleService, 'getJobRoles').resolves([]);
        sinon.stub(bandService, 'getBands').resolves([]);
        sinon.stub(capabilityService, 'getCapabilities').resolves([])

        request(app)
            .get('/job-roles/edit/1')
            .expect(200)
            .expect('Content-Type', 'text/html; charset=utf-8')
            .end((err, res) => {
                expect(res.text).to.contain('<h2>Edit Job Role</h2>');
            }
        );
    });
    it('should render job-roles/edit.html template with error message', async () => {
        sinon.stub(jobRoleService, 'getJobRoles').throws(new Error('Test error'));

        request(app)
            .get('/job-roles/edit/1')
            .expect(200)
            .expect('Content-Type', 'text/html; charset=utf-8')
            .end((err, res) => {
                expect(res.text).to.contain('<h1>Job Roles</h1>');
                expect(res.text).to.contain('Test error');
            }
        );
    });
    it('should render job-roles/edit.html template with form', async () => {
        sinon.stub(jobRoleService, 'getJobRoles').resolves([{ 
            jobRoleID: 1,
            jobRoleName: 'Test job role',
            jobSpecSummary: 'Test summary',
            band: { bandID: 1, bandName: 'Test band' },
            capability: { capabilityID: 2, capabilityName: 'Test capability' },
            responsibilities: 'Test responsibilities',
            sharePoint: 'Test sharepoint'
        }]);
        sinon.stub(bandService, 'getBands').resolves([{ 
            bandID: 1, bandName: 'Test band'        
        }
        ]);
        sinon.stub(capabilityService, 'getCapabilities').resolves([{
            capabilityID: 1, capabilityName: "Test capability"
        }])

        request(app)
            .get('/job-roles')
            .expect(200)
            .expect('Content-Type', 'text/html; charset=utf-8')
            .end((err, res) => {
                expect(res.text).to.contain('<h2>Edit Job Role</h2>');
                expect(res.text).to.contain('Test band');
                expect(res.text).to.contain('Text capability')
                expect(res.text).to.contain('Test job role')
            }
        );
    });

    it('should render job-role-matrix.html template with no job roles', async () => {
        sinon.stub(jobRoleService, 'getJobRoleMatrix').resolves({
            bands: [{bandID: 6, bandName: "Associate"}, {bandID: 5, bandName: "Trainee"}],
            capabilities: [{capabilityID: 1, capabilityName: "Engineering"}, {capabilityID: 2, capabilityName: "Cyber Security"}],
            jobRolesGrid: [[[], []], [[], []]]
        });

        request(app)
            .get('/job-roles/matrix')
            .expect(200)
            .expect('Content-Type', 'text/html; charset=utf-8')
            .end((err, res) => {
                expect(res.text).to.contain("<h1>Job Roles Matrix</h1>");
                expect(res.text).to.contain("Engineering");
                expect(res.text).to.contain("Trainee")
            }
        );
    });

    it('should render job-role-matrix.html template with no bands', async () => {
        sinon.stub(jobRoleService, 'getJobRoleMatrix').resolves({
            bands: [],
            capabilities: [{capabilityID: 1, capabilityName: "Engineering"}],
            jobRolesGrid: []
        });

        request(app)
            .get('/job-roles/matrix')
            .expect(200)
            .expect('Content-Type', 'text/html; charset=utf-8')
            .end((err, res) => {
                expect(res.text).to.contain("<h5>There are either no bands or no capabilities, thus matrix cannot be displayed.</h5>");
            }
        );
    });

    it('should render job-role-matrix.html template with no capabilities', async () => {
        sinon.stub(jobRoleService, 'getJobRoleMatrix').resolves({
            bands: [{bandID: 6, bandName: "Associate"}],
            capabilities: [],
            jobRolesGrid: [[]]
        });

        request(app)
            .get('/job-roles/matrix')
            .expect(200)
            .expect('Content-Type', 'text/html; charset=utf-8')
            .end((err, res) => {
                expect(res.text).to.contain("<h5>There are either no bands or no capabilities, thus matrix cannot be displayed.</h5>")
            }
        );
    });

    it('should render job-role-matrix.html template with job roles', async () => {

        const associateBand = {bandID: 6, bandName: "Associate"}
        const engineeringCapability = {capabilityID: 1, capabilityName: "Engineering"}
        const jobRole : JobRole = {
            jobRoleID: 9, 
            jobRoleName: "Associate Software Engineer", 
            jobSpecSummary: "", 
            band: associateBand, 
            capability: engineeringCapability,
            responsibilities: "",
            sharePoint: ""
        }

        sinon.stub(jobRoleService, 'getJobRoleMatrix').resolves({
            bands: [associateBand, {bandID: 5, bandName: "Trainee"}],
            capabilities: [engineeringCapability, {capabilityID: 2, capabilityName: "Cyber Security"}],
            jobRolesGrid: [[[jobRole], []], [[], []]]
        });

        request(app)
            .get('/job-roles/matrix')
            .expect(200)
            .expect('Content-Type', 'text/html; charset=utf-8')
            .end((err, res) => {
                expect(res.text).to.contain(jobRole.jobRoleName);
            }
        );
    });

    it('should render job-role-matrix.html template with error message', async () => {
        sinon.stub(jobRoleService, 'getJobRoles').throws(new Error('Test error'));

        request(app)
            .get('/job-roles/matrix')
            .expect(200)
            .expect('Content-Type', 'text/html; charset=utf-8')
            .end((err, res) => {
                expect(res.text).to.contain("<h1>Job Roles Matrix</h1>");
                expect(res.text).to.contain('Test error');
            }
        );
    });
});