import chai from 'chai';
import request from 'supertest'
import express from 'express';
import sinon from 'sinon';
import { jobRoleService } from '../../../src/service/jobRoleService';
import router from '../../../src/router';
import { bandService } from '../../../src/service/bandService';
import { capabilityService } from '../../../src/service/capabilityService';
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
});