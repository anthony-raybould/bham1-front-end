import sinon from 'sinon';
import { jobRoleService } from '../../../src/service/jobRoleService';
import { JobRoles } from '../../../src/controller/jobRoleController';
import chai from 'chai';

const expect = chai.expect;

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

});