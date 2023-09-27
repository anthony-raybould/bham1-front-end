import type { User } from '../../../src/model/user';
import MockAdapter from 'axios-mock-adapter';
import { authService } from '../../../src/service/authService';
import axios from 'axios';
import { expect } from 'chai';

describe('authService', () => {
    let mock: MockAdapter;

    beforeEach(() => {
        mock = new MockAdapter(axios);
    });

    describe('login', () => {
        it('should login successfully', async () => {
            const loginData = { email: 'email@email.com', password: 'testpassword' };
            const responseData = "thisIsAToken"
            mock.onPost(`${process.env.API_URL}api/login`, loginData).reply(200, responseData);

      try {
        const result = await authService.login(loginData)
        expect(result).to.be.equal(responseData);
      } catch (error) {
        throw new Error('Expected login to succeed');
      }
    });

        it('should handle invalid login credentials', async () => {
            const loginData = { email: 'email@email.com', password: 'invalidPassword' };
            mock.onPost(`${process.env.API_URL}api/login`, loginData).reply(401);

            try {
                await authService.login(loginData);
            } catch (error) {
                console.log(error.message)
                expect(error.message).to.equal('Your email or password is incorrect');
            }
        });
      try {
        await authService.login(loginData);
      } catch (error) {
        expect(error.message).to.equal('Your email or password is incorrect');
      }
    });

        it('should handle server error', async () => {
            const loginData = { email: 'email@email.com', password: 'invalidPassword' };
            mock.onPost(`${process.env.API_URL}api/login`, loginData).reply(500, 'Internal Server Error');

            try {
                await authService.login(loginData);
            } catch (error) {
                expect(error.message).to.equal('Internal server error');
            }
        });
    });

    describe('whoami', () => {
        it('should identify user successfully', async () => {
            const token = 'token';
            const responseData: User = { userID: 1, email: 'test@test.com', role: { roleID: 1, roleName: 'Admin' } };
            mock.onGet(`${process.env.API_URL}api/whoami`, { headers: { Authorization: `Bearer ${token}` } }).reply(200, responseData);

            const result = await authService.whoami(token);
            expect(result).to.deep.equal(responseData);
        });

        it('should handle error when user is not logged in', async () => {
            const token = 'token';
            mock.onGet(`${process.env.API_URL}api/whoami`, { headers: { Authorization: `Bearer ${token}` } }).reply(401);

            try {
                await authService.whoami(token);
            } catch (error) {
                expect(error.message).to.equal('User is not logged in');
            }
        });

        it('should handle error when server error', async () => {
            const token = 'token';
            mock.onGet(`${process.env.API_URL}api/whoami`, { headers: { Authorization: `Bearer ${token}` } }).reply(500);

            try {
                await authService.whoami(token);
            } catch (error) {
                expect(error.message).to.equal('Failed to fetch user');
            }
        });
    });

    describe('register', () => {
        it('should register successfully', async () => {
            const registerData = { email: 'test@test.com', password: 'testpassword' };
            mock.onPost(`${process.env.API_URL}api/register`, registerData).reply(201);

            const result = await authService.register(registerData);
            expect(result).to.be.undefined;
        });

        it('should handle duplicate email', async () => {
            const registerData = { email: 'test@test.com', password: 'testpassword' };
            mock.onPost(`${process.env.API_URL}api/register`, registerData).reply(409);

            try {
                await authService.register(registerData);
            } catch (error) {
                expect(error.message).to.equal('User with email already exists');
            }
        });

        it('should handle server error', async () => {
            const registerData = { email: 'test@test.com', password: 'testpassword' };
            mock.onPost(`${process.env.API_URL}api/register`, registerData).reply(500);

            try {
                await authService.register(registerData);
            } catch (error) {
                expect(error.message).to.equal('Failed to register account');
            }
        });

    });

});