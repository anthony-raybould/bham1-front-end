import chai from 'chai';
import request from 'supertest'
import express from 'express';
import sinon from 'sinon';
import router from '../../../src/router';
import { capabilityService } from '../../../src/service/capabilityService';
import { validateCreate } from '../../../src/validator/capabilityValidator';
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

describe('capabilityController', () => {
    
    beforeEach(() => {
        sinon.restore();
    });

    before(() => {
        sinon.stub(validateCreate);
    })

    it('(getCreate) should render create-capability template', async () => {

        request(app)
            .get('/capabilities/create')
            .expect(200)
            .expect('Content-Type', 'text/html; charset=utf-8')
            .end((err, res) => {
                expect(res.text).to.contain('<h1>Create Capability</h1>');
            }
            );
    });

    it('(postCreate) should render create-capability template with error message', async () => {

        sinon.stub(capabilityService, 'createCapability').throws(new Error('Test error'));

        request(app)
            .post('/capabilities/create')
            .expect(200)
            .expect('Content-Type', 'text/html; charset=utf-8')
            .end((err, res) => {
                expect(res.text).to.contain('<h1>Create Capabiltity</h1>');
                expect(res.text).to.contain('Test error');
            }
            );
    });

    it('(postCreate) should render create-capability-success template when successful', async () => {

        sinon.stub(capabilityService, 'createCapability');

        request(app)
            .post('/capabilities/create')
            .expect(200)
            .expect('Content-Type', 'text/html; charset=utf-8')
            .end((err, res) => {
                expect(res.text).to.contain('<h1>Create Capabiltity</h1>');
                expect(res.text).to.contain('created successfully');
            }
            );
    });
});