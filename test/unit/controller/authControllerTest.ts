// import chai from 'chai';
// import request from 'supertest'
// import express from 'express';
// import sinon from 'sinon';
// import { authService } from '../../../src/service/authService';
// import router from '../../../router';

// const expect = chai.expect;

// const app = express();
// app.use(express.urlencoded({ extended: false }));
// app.use(express.json());

// app.use(router);

// describe('jobRoleController', () => {
//     beforeEach(() => {
//         sinon.restore();
//     });

//     it('should render login.html template', async () => {
//         request(app)
//             .get('/login')
//             .expect(200)
//             .expect('Content-Type', 'text/html; charset=utf-8')
//             .end((err, res) => {
//                 expect(res.text).to.contain('<h1>Login</h1>');
//             }
//         );
//     });

//     it('should render login.html template with error', async () => {
//         request(app)
//             .get('/job-roles')
//             .expect(200)
//             .expect('Content-Type', 'text/html; charset=utf-8')
//             .end((err, res) => {
//                 expect(res.text).to.contain('<h1>Login</h1>');
//             }
//         );
//     });
// });