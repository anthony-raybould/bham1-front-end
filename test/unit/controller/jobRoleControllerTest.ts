import sinon from 'sinon';
import { jobRoleService } from '../../../src/service/jobRoleService';
import { JobRoles } from '../../../src/controller/jobRoleController';
import chai from 'chai';
import request from 'supertest'
import express from 'express';
import router from '../../../src/router';


import { bandService } from '../../../src/service/bandService';
import { capabilityService } from '../../../src/service/capabilityService';
import expressSession from 'express-session';
import { JobRole } from '../../../src/model/jobRole';
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

const bands = { 
    associate: {
        bandID: 1, 
        bandName: 'Associate' 
    },
    trainee: {
        bandID: 2,
        bandName: 'Trainee'
    }
};
const capabilities = {
    thinking: {
        capabilityID: 1,
        capabilityName: 'Thinking'
    },
    doing: {
        capabilityID: 2,
        capabilityName: 'Doing'
    }
}

// ID | Name             | Band      | Capability 
// ------------------------------------------
// 1  | Thinker          | Associate | Thinking
// 2  | Lead Thinker     | Associate | Thinking
// 3  | Trainee Thinker  | Trainee   | Thinking
// 4  | Doer             | Associate | Doing
// 5  | Lead Doer        | Associate | Doing
// 6  | Trainee Doer     | Trainee   | Doing
const jobRoles = [
    {
        jobRoleID: 1,
        jobRoleName: 'Thinker',
        jobSpecSummary: 'Thinks about stuff',
        band: bands.associate,
        capability: capabilities.thinking,
        responsibilities: 'Responsible for thoughts',
        sharePoint: 'https://sharepoint.com/thinker'
    },
    {
        jobRoleID: 2,
        jobRoleName: 'Lead Thinker',        
        jobSpecSummary: 'Trains other people to do some thinking',
        band: bands.associate,
        capability: capabilities.thinking,
        responsibilities: 'Responsible for thoughts',        
        sharePoint: 'https://sharepoint.com/lead-thinker'
    },
    {
        jobRoleID: 3,
        jobRoleName: 'Trainee Thinker',
        jobSpecSummary: 'Thinks about stuff under supervision',
        band: bands.trainee,
        capability: capabilities.thinking,
        responsibilities: 'Responsible for thoughts',
        sharePoint: 'https://sharepoint.com/trainee-thinker'
    },
    {
        jobRoleID: 4,
        jobRoleName: 'Doer',        
        jobSpecSummary: 'Does stuff',
        band: bands.associate,
        capability: capabilities.doing,
        responsibilities: 'Responsible for doing stuff',
        sharePoint: 'https://sharepoint.com/doer'
    },
    {
        jobRoleID: 5,
        jobRoleName: 'Lead Doer',
        jobSpecSummary: 'Trains other people to do stuff',
        band: bands.associate,
        capability: capabilities.doing,
        responsibilities: 'Responsible for doing stuff',
        sharePoint: 'https://sharepoint.com/lead-doer'
    },
    {
        jobRoleID: 6,
        jobRoleName: 'Trainee Doer',
        jobSpecSummary: 'Does stuff under supervision',
        band: bands.trainee,
        capability: capabilities.doing,
        responsibilities: 'Responsible for doing stuff',
        sharePoint: 'https://sharepoint.com/trainee-doer'
    }
]

const callAndAssertJobRolesGetWithQuery = async (parameter: string, order: string): Promise<any> => {
    sinon.stub(jobRoleService, 'getJobRoles').resolves([...jobRoles]);
    
    const req = { session: {}, query: { [parameter]: order } as any };
    const res = { render: sinon.spy(), locals: { 
        jobRoles: undefined as any, 
        getSortQueryString: undefined as any, 
        getSortHTMLSymbol: undefined as any 
    }};

    await JobRoles.get(req as any, res as any);

    expect(res.render.calledOnce).to.be.true;
    expect(res.render.calledWith('job-roles')).to.be.true;
    
    assertGenerateQueryStringAndHTMLSymbol(res, parameter, order);
    
    return { req, res };
}

const assertGenerateQueryStringAndHTMLSymbol = (res: any, parameter: string, order: string) => {
    expect(res.locals.getSortQueryString).to.be.a('function');
    expect(res.locals.getSortHTMLSymbol).to.be.a('function');

    const queryString = res.locals.getSortQueryString(parameter);
    if (order === 'asc') {
        expect(queryString).to.equal(`?${parameter}=desc`);
    } else if (order === 'desc') {
        expect(queryString).to.equal('');
    } else {
        expect(queryString).to.equal(`?${parameter}=asc`);
    }
    
    const htmlSymbol = res.locals.getSortHTMLSymbol(parameter);
    if (order === 'asc') {
        expect(htmlSymbol).to.equal('&uarr;');
    } else if (order === 'desc') {
        expect(htmlSymbol).to.equal('&darr;');
    } else {
        expect(htmlSymbol).to.equal('');
    }
}

const assertJobRoleOrder = (res: any, expectedOrder: number[]) => {
    expectedOrder.forEach((jobRoleID: number, index: number) => {
        expect(res.locals.jobRoles[index].jobRoleID).to.equal(jobRoleID);
    });
}

describe('jobRoleController', () => {
    beforeEach(() => {
        sinon.restore();
    });
    
    it('should render job-roles.html template with no job roles', async () => {
        sinon.stub(jobRoleService, 'getJobRoles').resolves([]);

        const req = { session: {} as any};
        const res = { render: sinon.spy(), locals: { jobRoles: undefined as any } };

        await JobRoles.get(req as any, res as any);

        expect(res.render.calledOnce).to.be.true;
        expect(res.render.calledWith('job-roles')).to.be.true;
        expect(res.locals.jobRoles).to.deep.equal([]); 
    });
    
    it('should render job-roles.html template with job roles', async () => {
        sinon.stub(jobRoleService, 'getJobRoles').resolves(jobRoles);

        const req = { session: {} as any};
        const res = { render: sinon.spy(), locals: { jobRoles: undefined as any } };

        await JobRoles.get(req as any, res as any);

        expect(res.render.calledOnce).to.be.true;
        expect(res.render.calledWith('job-roles')).to.be.true;
        expect(res.locals.jobRoles).to.deep.equal(jobRoles);
    });
    
    it('should render job-roles.html template with error message', async () => {
        sinon.stub(jobRoleService, 'getJobRoles').rejects(new Error('Test error'));

        const req = { session: {} as any};
        const res = { render: sinon.spy(), locals: { jobRoles: undefined as any, errorMessage: undefined as any } };

        await JobRoles.get(req as any, res as any);

        expect(res.render.calledOnce).to.be.true;
        expect(res.render.calledWith('job-roles')).to.be.true;
        expect(res.locals.jobRoles).to.be.undefined;
        expect(res.locals.errorMessage).to.equal('Test error');
    });
    
    it('should render job-roles.html template with job roles ordered by name ascending', async () => {
        const { _, res } = await callAndAssertJobRolesGetWithQuery('nameOrder', 'asc');
        assertJobRoleOrder(res, [4, 5, 2, 1, 6, 3]);
    });
    
    it('should render job-roles.html template with job roles ordered by name descending', async () => {
        const { _, res } = await callAndAssertJobRolesGetWithQuery('nameOrder', 'desc');
        assertJobRoleOrder(res, [3, 6, 1, 2, 5, 4]);
    });

    it('should render job-roles.html template with job roles ordered by capability ascending', async () => {
        const { _, res } = await callAndAssertJobRolesGetWithQuery('capabilityOrder', 'asc');
        assertJobRoleOrder(res, [4, 5, 6, 1, 2, 3]);
    });
    
    it('should render job-roles.html template with job roles ordered by capability descending', async () => {
        const { _, res } = await callAndAssertJobRolesGetWithQuery('capabilityOrder', 'desc');
        assertJobRoleOrder(res, [1, 2, 3, 4, 5, 6]);
    });

    it('should render job-roles.html template with job roles ordered by band ascending', async () => {
        const { _, res } = await callAndAssertJobRolesGetWithQuery('bandOrder', 'asc');
        assertJobRoleOrder(res, [1, 2, 4, 5, 3, 6]);
    });
    
    it('should render job-roles.html template with job roles ordered by band descending', async () => {
        const { _, res } = await callAndAssertJobRolesGetWithQuery('bandOrder', 'desc');
        assertJobRoleOrder(res, [3, 6, 1, 2, 4, 5]);
    });
    
    it('should redirect to /job-roles with one parameter if multiple parameters are passed', async () => {
        const req = { session: {}, query: { nameOrder: 'asc', capabilityOrder: 'asc' } as any };
        const res = { redirect: sinon.spy() };

        await JobRoles.get(req as any, res as any);

        expect(res.redirect.calledOnce).to.be.true;
        expect(res.redirect.calledWith('/job-roles?nameOrder=asc')).to.be.true;
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
    it('should render job-roles/edit.html template', async () => {
        sinon.stub(jobRoleService, 'getJobRoles').resolves([]);
        sinon.stub(bandService, 'getBands').resolves([]);
        sinon.stub(capabilityService, 'getCapabilities').resolves([])

        request(app)
            .get('/job-roles/edit/1')
            .expect(200)
            .expect('Content-Type', 'text/html; charset=utf-8')
            .end((err, res) => {
                expect(res.text).to.contain('Edit Job Role');
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
                expect(res.text).to.contain('TypeError');
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
                expect(res.text).to.contain('Edit Job Role');
                expect(res.text).to.contain('Test band');
                expect(res.text).to.contain('Text capability')
                expect(res.text).to.contain('Test job role')
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