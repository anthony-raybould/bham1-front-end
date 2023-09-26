import {By} from "selenium-webdriver"
const _chai = require('chai');
import * as dotenv from 'dotenv';
import { Dirent } from 'fs';
import { buildDriver } from './buildDriver';

describe('Login Page UI Tests', async () => {
  it('should display the login form', async () => {
    var driver = buildDriver();
    await driver.get(process.env.UI_TEST_URL + '/login');
    const form = await driver.findElement(By.tagName('form'));
    _chai.expect(await form.isDisplayed()).to.be.true;
  });

  it('should submit the login form with valid credentials', async () => {
    var driver = buildDriver();
    await driver.get(process.env.UI_TEST_URL + '/login');
    const emailInput = await driver.findElement(By.id('email'));
    const passwordInput = await driver.findElement(By.id('password'));
    const loginButton = await driver.findElement(By.css('button[type="submit"]'));

    await emailInput.sendKeys(process.env.LOGIN_CRED_EMAIL!);
    await passwordInput.sendKeys(process.env.LOGIN_CRED_PWD!);
    await loginButton.click();
  });
  it("should display error when invalid creds", async () => {
    var driver = buildDriver();
    await driver.get(process.env.UI_TEST_URL + '/login');
    const emailInput = await driver.findElement(By.id('email'))
    const passwordInput = await driver.findElement(By.id('password'));
    const loginButton = await driver.findElement(By.css('button[type="submit"]'));

    await emailInput.sendKeys("thisIs@anInvalidEmail.com");
    await passwordInput.sendKeys(process.env.LOGIN_CRED_PWD!);
    await loginButton.click();
    _chai.expect(await driver.getCurrentUrl()).to.equal(process.env.UI_TEST_URL + '/login');
    _chai.expect(await driver.findElement(By.id('errorMessage')).getText()).to.equal('Your email or password is incorrect');
  });
});