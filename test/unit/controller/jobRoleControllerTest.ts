import sinon from 'sinon';
import { jobRoleService } from '../../../src/service/jobRoleService';
import { JobRoles } from '../../../src/controller/jobRoleController';
import chai from 'chai';
import { jobRoles } from './jobRoleTestData';

const expect = chai.expect;

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
        sinon.stub(jobRoleService, 'getJobRoles').resolves(jobRoles);
        
        const req = { session: {}, query: { nameOrder: 'asc', bandOrder: 'asc' } as any };
        const res = { redirect: sinon.spy(), render: sinon.spy(), locals: {} };

        await JobRoles.get(req as any, res as any);

        expect(res.redirect.calledOnce).to.be.true;
        expect(res.redirect.calledWith('/job-roles?nameOrder=asc')).to.be.true;
    });
    
});