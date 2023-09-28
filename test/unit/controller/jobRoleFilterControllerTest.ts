import sinon from 'sinon';
import { jobRoleService } from '../../../src/service/jobRoleService';
import { JobRoles } from '../../../src/controller/jobRoleController';
import chai from 'chai';
import { capabilityService } from '../../../src/service/capabilityService';
import { bandService } from '../../../src/service/bandService';
import { JobRolesFilter, decodeURLFilterParams, encodeURLFilterParams } from '../../../src/controller/jobRoleFilterController';
import { bands, capabilities, jobRoles } from './jobRoleTestData';

const expect = chai.expect;

describe('jobRoleFilterController', () => {
    beforeEach(() => {
        sinon.restore();
    });
    
    it('should render job-roles/filter.html template with no filters', async () => {
        sinon.stub(jobRoleService, 'getJobRoles').resolves(jobRoles);
        sinon.stub(capabilityService, 'getCapabilities').resolves([capabilities.thinking, capabilities.doing]);
        sinon.stub(bandService, 'getBands').resolves([bands.associate, bands.trainee]);

        const req = { session: {} as any};
        const res = { render: sinon.spy(), locals: { 
            jobRoles: undefined as any, 
            nameFilter: undefined as any, 
            bandFilter: undefined as any, 
            capabilityFilter: undefined as any 
        } };

        await JobRolesFilter.getFilter(req as any, res as any);

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
        const res = { render: sinon.spy(), locals: { 
            jobRoles: undefined as any, 
            nameFilter: undefined as any, 
            bandFilter: undefined as any, 
            capabilityFilter: undefined as any 
        } };

        await JobRolesFilter.getFilter(req as any, res as any);

        expect(res.render.calledOnce).to.be.true;
        expect(res.render.calledWith('job-roles/filter')).to.be.true;
        expect(res.locals.nameFilter).to.equal('Thinker');
        expect(res.locals.bandFilter).to.deep.equal([1]);
        expect(res.locals.capabilityFilter).to.deep.equal([1]);
    });
    
    it('should render job-roles with filtered job roles', async () => {
        sinon.stub(jobRoleService, 'getJobRoles').resolves(jobRoles);

        const req = { session: {} as any, query: { nameFilter: 'Thinker', bandFilter: [1], capabilityFilter: [1] }};
        const res = { render: sinon.spy(), locals: { 
            jobRoles: undefined as any, 
            nameFilter: undefined as any, 
            bandFilter: undefined as any, 
            capabilityFilter: undefined as any 
        } };

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

        await JobRolesFilter.postFilter(req as any, res as any);
        
        expect(res.redirect.calledOnce).to.be.true;
        expect(res.redirect.calledWith('/job-roles?nameFilter=Thinker&bandFilter=%255B1%255D&capabilityFilter=%255B1%255D')).to.be.true;
    });
    
    describe('encodeURLFilterParams', () => {
        it('should return empty string when no filters', () => {        
            const result = encodeURLFilterParams(undefined, undefined, undefined);
            
            expect(result).to.equal('');
        });

        it('should return name parameter when name is supplied', () => {
            const result = encodeURLFilterParams('Thinker', undefined, undefined);
            
            expect(result).to.equal('nameFilter=Thinker');
        });

        it('should return band parameter when band is supplied', () => {
            const result = encodeURLFilterParams(undefined, [1], undefined);
            
            expect(result).to.equal('bandFilter=%255B1%255D');
        });

        it('should return capability parameter when capability is supplied', () => {
            const result = encodeURLFilterParams(undefined, undefined, [1]);
            
            expect(result).to.equal('capabilityFilter=%255B1%255D');
        });

        it('should return all parameters when all are supplied', () => {
            const result = encodeURLFilterParams('Thinker', [1], [1]);

            expect(result).to.equal('nameFilter=Thinker&bandFilter=%255B1%255D&capabilityFilter=%255B1%255D');
        });
    });
    
    describe('decodeURLFilterParams', () => {
        it('should return empty object when no filters', () => {
            const req = { query: {} };
            
            const result = decodeURLFilterParams(req as any);
            
            expect(result).to.deep.equal({});
        });

        it('should return name parameter when name is supplied', () => {
            const req = { query: { nameFilter: 'Thinker' } };
            
            const result = decodeURLFilterParams(req as any);
            
            expect(result).to.deep.equal({ nameFilter: 'Thinker' });
        });

        it('should return band parameter when band is supplied', () => {
            const req = { query: { bandFilter: '[1]' } };
            
            const result = decodeURLFilterParams(req as any);
            
            expect(result).to.deep.equal({ bandFilter: [1] });
        });

        it('should return capability parameter when capability is supplied', () => {
            const req = { query: { capabilityFilter: '[1]' } };
            
            const result = decodeURLFilterParams(req as any);
            
            expect(result).to.deep.equal({ capabilityFilter: [1] });
        });

        it('should return all parameters when all are supplied', () => {
            const req = { query: { nameFilter: 'Thinker', bandFilter: '[1]', capabilityFilter: '[1]' } };
            
            const result = decodeURLFilterParams(req as any);
            
            expect(result).to.deep.equal({ nameFilter: 'Thinker', bandFilter: [1], capabilityFilter: [1] });
        });
    });

});