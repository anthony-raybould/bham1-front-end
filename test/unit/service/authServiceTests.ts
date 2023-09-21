var chai = require('chai');
var axios = require('axios');
var MockAdapter = require('axios-mock-adapter');
const expect = chai.expect;
import { User } from '../../../src/model/user';
import { authService } from '../../../src/service/authService';


describe('authService', () => {

  describe('login', () => {
    it('should login successfully', async () => {
      var mock = new MockAdapter(axios);
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
      var mock = new MockAdapter(axios);
      const loginData = { email: 'email@email.com', password: 'invalidPassword' };
      mock.onPost(`${process.env.API_URL}api/login`, loginData).reply(401);

      try {
        await authService.login(loginData);
      } catch (error) {
        console.log(error.message)
        expect(error.message).to.equal('Invalid credentials - 401');
      }
    });

    it('should handle server error', async () => {
      var mock = new MockAdapter(axios);
      const loginData = { email: 'email@email.com', password: 'invalidPassword' };
      mock.onPost(`${process.env.API_URL}api/login`, loginData).reply(500, 'Internal Server Error');

      try {
        await authService.login(loginData);
      } catch (error) {
        expect(error.message).to.equal('Internal server error - 500');
      }
    });
  });

  describe('whoami', () => {
    it('should identify user successfully', async () => {
      const mock = new MockAdapter(axios);
      const token = 'token';
      const responseData: User = { userID: 1, email: 'test@test.com', role: { roleID: 1, roleName: 'Admin' } };
      mock.onGet(`${process.env.API_URL}api/whoami`, { headers: { Authorization: `Bearer ${token}` } }).reply(200, responseData);
        
      const result = await authService.whoami(token);
      expect(result).to.deep.equal(responseData);
    });
    
    it('should handle error when user is not logged in', async () => {
      const mock = new MockAdapter(axios);
      const token = 'token';
      mock.onGet(`${process.env.API_URL}api/whoami`, { headers: { Authorization: `Bearer ${token}` } }).reply(401);
        
      try {
        await authService.whoami(token);
      } catch (error) {
        expect(error.message).to.equal('User is not logged in');
      }
    });
    
    it('should handle error when server error', async () => {
      const mock = new MockAdapter(axios);
      const token = 'token';
      mock.onGet(`${process.env.API_URL}api/whoami`, { headers: { Authorization: `Bearer ${token}` } }).reply(500);
        
      try {
        await authService.whoami(token);
      } catch (error) {
        expect(error.message).to.equal('Failed to fetch user');
      }
    });
  });

});