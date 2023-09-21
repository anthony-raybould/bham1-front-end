import chai from 'chai';
import request from 'supertest'
import express from 'express';
import sinon from 'sinon';
import { jobRoleService } from '../../../src/service/jobRoleService';
import router from '../../../src/router';
import expressSession from 'express-session';

const expect = chai.expect;

const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(expressSession({ secret: "test", resave: true, cookie: { maxAge: 1000 * 60 * 60 * 24 } }))

app.all('*', (req, res, next) => {
    req.session.token = 'test';
    req.session.user = {
        userID: 1,
        email: 'test@test.com', 
        role: { 
            roleID: 1, 
            roleName: 'Admin' 
        }
    };

    next();
});

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

});