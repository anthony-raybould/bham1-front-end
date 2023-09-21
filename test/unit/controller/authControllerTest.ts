import chai from 'chai';
import sinon from 'sinon';
import { authService } from '../../../src/service/authService';
import { Auth } from '../../../src/controller/authController';
import { User } from '../../../src/model/user';
import { registerValidator } from '../../../src/validator/registerValidator';

const expect = chai.expect;

describe('jobRoleController', () => {

    describe('getLogin', () => {
        beforeEach(() => {
            sinon.restore();
        });

        it('should render login template', async () => {
            const req = {};
            const res = { render: sinon.spy() };
            
            Auth.getLogin(req as any, res as any);        

            expect(res.render.calledOnce).to.be.true;
            expect(res.render.calledWith('login')).to.be.true;
        });
    });

    describe('postLogin', () => {
        beforeEach(() => {
            sinon.restore();
        });

        it('should redirect to home and set session on successful login', async () => {
            const user: User = {
                userID: 1,
                email: 'test@test.com',
                role: {
                    roleID: 1,
                    roleName: 'Admin'
                }
            }
            sinon.stub(authService, 'login').resolves('test');
            sinon.stub(authService, 'whoami').resolves(user);

            const req = { body: { email: 'test@test.com', password: 'password' }, session: {} as any };
            const res = { redirect: sinon.spy() };
            
            await Auth.postLogin(req as any, res as any);
            
            expect(res.redirect.calledOnce).to.be.true;
            expect(res.redirect.calledWith('/')).to.be.true;
            expect(req.session.token).to.equal('test');
            expect(req.session.user).to.deep.equal(user);
        });
        
        it('should render login template with error message on unsuccessful login', async () => {
            sinon.stub(authService, 'login').rejects(new Error('Your username or password is incorrect'));

            const req = { body: { email: 'test@test.com', password: 'password' }, session: {} as any };
            const res = { render: sinon.spy(), locals: { errorMessage: '' } };
            
            await Auth.postLogin(req as any, res as any);
            
            expect(res.render.calledOnce).to.be.true;
            expect(res.render.calledWith('login', req.body)).to.be.true;
            expect(res.locals.errorMessage).to.equal('Your username or password is incorrect');
        });
    });
    
    describe('getLogout', () => {
        beforeEach(() => {
            sinon.restore();
        });

        it('should destroy session', async () => {
            const req = { session: { destroy: sinon.spy() } };
            
            Auth.getLogout(req as any, {} as any);        

            expect(req.session.destroy.calledOnce).to.be.true;
        });
    });
    
    describe('getRegister', () => {
        beforeEach(() => {
            sinon.restore();
        });

        it('should render register template', async () => {
            sinon.stub(authService, 'getRoles').resolves([]);

            const req = {};
            const res = { render: sinon.spy(), locals: { roles: undefined as any } };
            
            await Auth.getRegister(req as any, res as any);        

            expect(res.render.calledOnce).to.be.true;
            expect(res.render.calledWith('register')).to.be.true;
            expect(res.locals.roles).to.deep.equal([]);
        });
    });
    
    describe('postRegister', () => {
        beforeEach(() => {
            sinon.restore();

            sinon.stub(registerValidator, 'validateEmail').returns(undefined);
            sinon.stub(registerValidator, 'validatePassword').returns(undefined);
        });

        it('should redirect to login page on successful registration', async () => {
            sinon.stub(authService, 'register').resolves();

            const req = { body: { email: 'test@test.com', password: 'password', roleID: 1 }, session: {} as any };
            const res = { redirect: sinon.spy() };

            await Auth.postRegister(req as any, res as any);

            expect(res.redirect.calledOnce).to.be.true;
            expect(res.redirect.calledWith('/login?registered=true')).to.be.true;
        });

        it('should render register template with error message on unsuccessful registration', async () => {
            sinon.stub(authService, 'register').rejects(new Error('Test error'));

            const req = { body: { email: 'test@test.com', password: 'password', roleID: 1 }, session: {} as any };
            const res = { render: sinon.spy(), locals: { errorMessage: '' } };

            await Auth.postRegister(req as any, res as any);

            expect(res.render.calledOnce).to.be.true;
            expect(res.render.calledWith('register')).to.be.true;
            expect(res.locals.errorMessage).to.equal('Test error');
        });

    });
    
});