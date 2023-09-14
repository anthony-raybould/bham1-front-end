var chai = require('chai');  
var axios = require('axios');
var MockAdapter = require('axios-mock-adapter');
const expect = chai.expect;
import { login } from '../../../src/service/authService'; 


describe('loginService Tests', () => {
 

  it('should login successfully', async () => {
    var mock = new MockAdapter(axios);
    const loginData = { email: 'email@email.com', password: 'testpassword' };
    const responseData = "thisIsAToken"
    mock.onPost('http://localhost:8080/api/login', loginData).reply(200, responseData);

    try {
      const result = await login(loginData)
      expect(result).to.be.equal(responseData);
    } catch (error) {
      throw new Error('Expected login to succeed');
    }
  });

  it('should handle invalid login credentials', async () => {
    var mock = new MockAdapter(axios);
    const loginData = { email: 'email@email.com', password: 'invalidPassword' };
    mock.onPost('http://localhost:8080/api/login', loginData).reply(401);

    try {
      await login(loginData);
    } catch (error) {
        console.log(error.message)
      expect(error.message).to.equal('Invalid credentials - 401');
    }
  });

  it('should handle server error', async () => {
    var mock = new MockAdapter(axios);
    const loginData = { email: 'email@email.com', password: 'invalidPassword' };
    mock.onPost('http://localhost:8080/api/login', loginData).reply(500, 'Internal Server Error');

    try {
      await login(loginData);
    } catch (error) {
      expect(error.message).to.equal('Internal server error - 500');
    }
  });
});