import chai from 'chai';
import request from 'supertest'
import express from 'express';
import sinon from 'sinon';
import { jobRoleService } from '../../../src/service/jobRoleService';
import router from '../../../src/router';

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

    it('should render view-job-roles.html template with a job role', async () => {
        sinon.stub(jobRoleService, 'getJobRole').resolves({ 
            jobRoleID: 1,
            jobRoleName: 'Test job role',
            jobSpecSummary: 'Test summary',
            band: { bandID: 1, bandName: 'Test band' },
            capability: { capabilityID: 2, capabilityName: 'Test capability' },
            responsibilities: 'Test responsibilities',
            sharePoint: 'Test sharepoint'
        });

        request(app)
            .get('/view-job-role/1') 
            .expect(200)
            .expect('Content-Type', 'text/html; charset=utf-8')
            .end((err, res) => {
                expect(res.text).to.contain('Test summary');
            }
        );
    });

    it('should render view-job-role.html template with error message', async () => {
        sinon.stub(jobRoleService, 'getJobRole').throws(new Error('Test error'));

        request(app)
            .get('/view-job-role/1')
            .expect(200)
            .expect('Content-Type', 'text/html; charset=utf-8')
            .end((err, res) => {
                expect(res.text).to.contain('Test error');
            }
        );
    }); 

    it('should render delete-job-roles.html template with a job role to delete', async () => {
        sinon.stub(jobRoleService, 'getJobRole').resolves({ 
            jobRoleID: 1,
            jobRoleName: 'Test job role',
            jobSpecSummary: 'Test summary',
            band: { bandID: 1, bandName: 'Test band' },
            capability: { capabilityID: 2, capabilityName: 'Test capability' },
            responsibilities: 'Test responsibilities',
            sharePoint: 'Test sharepoint'
        });

        request(app)
            .get('/delete-job-role/1') 
            .expect(200)
            .expect('Content-Type', 'text/html; charset=utf-8')
            .end((err, res) => {
                expect(res.text).to.contain('Test band');
            }
        );
    });

    it('should render delete-job-role.html template with error message', async () => {
        sinon.stub(jobRoleService, 'getJobRole').throws(new Error('Test error'));

        request(app)
            .get('/delete-job-role/1')
            .expect(200)
            .expect('Content-Type', 'text/html; charset=utf-8')
            .end((err, res) => {
                expect(res.text).to.contain('Test error');
            }
        );
    }); 

});