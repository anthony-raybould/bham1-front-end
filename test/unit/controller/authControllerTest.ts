import chai from 'chai';
import express from 'express';
import sinon from 'sinon';
import { authService } from '../../../src/service/authService';
import expressSession from 'express-session';
import router from '../../../src/router';
import { Auth } from '../../../src/controller/authController';
import { User } from '../../../src/model/user';


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

    it('should render logintemplate', async () => {
        const req = {};
        const res = { render: sinon.spy() };
        
        Auth.getLogin(req as any, res as any);        

        expect(res.render.calledOnce).to.be.true;
        expect(res.render.calledWith('login')).to.be.true;
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
        sinon.stub(authService, 'login').rejects(new Error('Invalid credentials - 401'));

        const req = { body: { email: 'test@test.com', password: 'password' }, session: {} as any };
        const res = { render: sinon.spy(), locals: { errormessage: '' } };
        
        await Auth.postLogin(req as any, res as any);
        
        expect(res.render.calledOnce).to.be.true;
        expect(res.render.calledWith('login', req.body)).to.be.true;
        expect(res.locals.errormessage).to.equal('Invalid credentials - 401');
    });
});