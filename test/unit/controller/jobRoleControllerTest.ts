import sinon from 'sinon';
import { jobRoleService } from '../../../src/service/jobRoleService';
import { JobRoles } from '../../../src/controller/jobRoleController';
import chai from 'chai';
import { capabilityService } from '../../../src/service/capabilityService';
import { bandService } from '../../../src/service/bandService';

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
    
    it('should render job-roles/filter.html template with no filters', async () => {
        sinon.stub(jobRoleService, 'getJobRoles').resolves(jobRoles);
        sinon.stub(capabilityService, 'getCapabilities').resolves([capabilities.thinking, capabilities.doing]);
        sinon.stub(bandService, 'getBands').resolves([bands.associate, bands.trainee]);

        const req = { session: {} as any};
        const res = { render: sinon.spy(), locals: { jobRoles: undefined as any, nameFilter: undefined as any, bandFilter: undefined as any, capabilityFilter: undefined as any } };

        await JobRoles.getFilter(req as any, res as any);

        expect(res.render.calledOnce).to.be.true;
        expect(res.render.calledWith('job-roles/filter')).to.be.true;
        expect(res.locals.nameFilter).to.equal('');
        expect(res.locals.bandFilter).to.deep.equal([]);
        expect(res.locals.capabilityFilter).to.deep.equal([]);
    });
    
    it('should render job-roles/filter.html template with filters', async () => {
        sinon.stub(jobRoleService, 'getJobRoles').resolves(jobRoles);
        sinon.stub(capabilityService, 'getCapabilities').resolves([capabilities.thinking, capabilities.doing]);
        sinon.stub(bandService, 'getBands').resolves([bands.associate, bands.trainee]);

        const req = { session: {} as any, query: { nameFilter: 'Thinker', bandFilter: [1], capabilityFilter: [1] }};
        const res = { render: sinon.spy(), locals: { jobRoles: undefined as any, nameFilter: undefined as any, bandFilter: undefined as any, capabilityFilter: undefined as any } };

        await JobRoles.getFilter(req as any, res as any);

        expect(res.render.calledOnce).to.be.true;
        expect(res.render.calledWith('job-roles/filter')).to.be.true;
        expect(res.locals.nameFilter).to.equal('Thinker');
        expect(res.locals.bandFilter).to.deep.equal([1]);
        expect(res.locals.capabilityFilter).to.deep.equal([1]);
    });
    
    it('should render job-roles with filtered job roles', async () => {
        sinon.stub(jobRoleService, 'getJobRoles').resolves(jobRoles);

        const req = { session: {} as any, query: { nameFilter: 'Thinker', bandFilter: [1], capabilityFilter: [1] }};
        const res = { render: sinon.spy(), locals: { jobRoles: undefined as any, nameFilter: undefined as any, bandFilter: undefined as any, capabilityFilter: undefined as any } };

        await JobRoles.get(req as any, res as any);

        expect(res.render.calledOnce).to.be.true;
        expect(res.render.calledWith('job-roles')).to.be.true;
        expect(res.locals.jobRoles).to.deep.equal([jobRoles[0], jobRoles[1]]);
    });
    
    it('should redirect to job-roles with filters', async () => {
        sinon.stub(jobRoleService, 'getJobRoles').resolves(jobRoles);
        sinon.stub(capabilityService, 'getCapabilities').resolves([capabilities.thinking, capabilities.doing]);
        sinon.stub(bandService, 'getBands').resolves([bands.associate, bands.trainee]);

        const req = { session: {} as any, body: { name: 'Thinker', band: [1], capability: [1] }};
        const res = { redirect: sinon.spy() };

        await JobRoles.postFilter(req as any, res as any);

        expect(res.redirect.calledOnce).to.be.true;
        expect(res.redirect.calledWith('/job-roles?nameFilter=Thinker&bandFilter=%255B1%255D&capabilityFilter=%255B1%255D')).to.be.true;
    });

});