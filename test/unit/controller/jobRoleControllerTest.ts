import sinon from 'sinon';
import { jobRoleService } from '../../../src/service/jobRoleService';
import { JobRoles } from '../../../src/controller/jobRoleController';
import chai from 'chai';
import { capabilityService } from '../../../src/service/capabilityService';
import { bandService } from '../../../src/service/bandService';
import { bands, capabilities, jobRoles } from './jobRoleTestData';

const expect = chai.expect;

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
    
});