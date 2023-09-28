import { expect } from 'chai';
import { requireRole, requireLoggedIn, requireLoggedOut, user } from '../../../src/middleware/authorisation';
import sinon from 'sinon';

describe('authorisation middleware', () => {
    
    describe('requireRole', () => {
        beforeEach(() => {
            sinon.restore();
        });

        it('should call next if user has required role', () => {
            const req = { session: { token: 'token', user: { userID: 1, email: 'email', role: { roleID: 2, roleName: 'Employee' } } } };
            const nextFunction = sinon.spy();
            const requiredRole = 'Employee';

            requireRole(requiredRole)(req as any, {} as any, nextFunction);

            expect(nextFunction.calledOnce).to.be.true;
        });
        
        it('should call next if user is admin', () => {
            const req = { session: { token: 'token', user: { userID: 1, email: 'email', role: { roleID: 1, roleName: 'Admin' } } } };
            const nextFunction = sinon.spy();
            const requiredRole = 'Employee';

            requireRole(requiredRole)(req as any, {} as any, nextFunction);

            expect(nextFunction.calledOnce).to.be.true;
        });
        
        it('should render forbidden page if user does not have required role', () => {
            const req = { session: { token: 'token', user: { userID: 1, email: 'email', role: { roleID: 2, roleName: 'Employee' } } } };
            const res = { render: sinon.spy(), locals: { errorMessage: undefined as any } };
            const nextFunction = sinon.spy();
            const requiredRole = 'Admin';

            requireRole(requiredRole)(req as any, res as any, nextFunction);
            
            expect(nextFunction.calledOnce).to.be.false;
            expect(res.render.calledOnce).to.be.true;
            expect(res.render.calledWith('forbidden')).to.be.true;
            expect(res.locals.errorMessage).to.equal(`User ${req.session.user?.email} is not authorized to view this page.`);
        });
        
        it('should render forbidden page if user is not logged in', () => {
            const req = { session: {} };
            const res = { render: sinon.spy(), locals: { errorMessage: undefined as any } };
            const nextFunction = sinon.spy();
            const requiredRole = 'Admin';

            requireRole(requiredRole)(req as any, res as any, nextFunction);
            
            expect(nextFunction.calledOnce).to.be.false;
            expect(res.render.calledOnce).to.be.true;
            expect(res.render.calledWith('forbidden')).to.be.true;
            expect(res.locals.errorMessage).to.equal(`You must be logged in to view this page.`);
        });
    });
    
    describe('requireLoggedOut', () => {
        beforeEach(() => {
            sinon.restore();
        });

        it('should redirect to home page if user is logged in', () => {
            const req = { session: { token: 'token', user: { userID: 1, email: 'email', role: { roleID: 1, roleName: 'Admin' } } } };
            const res = { redirect: sinon.spy() };

            // eslint-disable-next-line @typescript-eslint/no-empty-function
            requireLoggedOut(req as any, res as any, () => {});

            expect(res.redirect.calledOnce).to.be.true;
            expect(res.redirect.calledWith('/')).to.be.true;
        });

        it('should call next if user is not logged in', () => {
            const req = { session: {} };
            const nextFunction = sinon.spy();

            requireLoggedOut(req as any, {} as any, nextFunction);

            expect(nextFunction.calledOnce).to.be.true;
        });
    });

    describe('requireLoggedIn', () => {
        beforeEach(() => {
            sinon.restore();
        });

        it('should call next if user is logged in', () => {
            const req = { session: { token: 'token', user: { userID: 1, email: 'email', role: { roleID: 1, roleName: 'Admin' } } } };
            const nextFunction = sinon.spy();

            requireLoggedIn(req as any, {} as any, nextFunction);

            expect(nextFunction.calledOnce).to.be.true;
        });        
        
        it('should redirect to login page if user is not logged in', () => {
            const req = { session: {} };
            const res = { redirect: sinon.spy() };

            // eslint-disable-next-line @typescript-eslint/no-empty-function
            requireLoggedIn(req as any, res as any, () => {});

            expect(res.redirect.calledOnce).to.be.true;
            expect(res.redirect.calledWith('/login')).to.be.true;
        });
    });
    
    describe('user', () => {
        beforeEach(() => {
            sinon.restore();
        });

        it('should set user if session exists', () => {
            const req = { session: { token: 'token', user: { userID: 1, email: 'email', role: { roleID: 2, roleName: 'Employee' } } } };
            const res = { locals: { user: undefined as any } };
            const nextFunction = sinon.spy();

            user(req as any, res as any, nextFunction);
            
            expect(nextFunction.calledOnce).to.be.true;
            expect(res.locals.user).to.deep.equal(req.session.user);
        });
        
        it('should always call next', () => {
            const req = { session: {} };
            const nextFunction = sinon.spy();

            user(req as any, {} as any, nextFunction);

            expect(nextFunction.calledOnce).to.be.true;
        });
    })

});