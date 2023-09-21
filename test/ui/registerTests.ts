import webdriver from 'selenium-webdriver';
import { expect } from 'chai';

describe('register page', async () => {
    const random = () => Math.random().toString(36).substring(7);
    const validEmail = `${random()}@${random()}.com`;
    const validPassword = `${random()}!1Aa`;

    let driver: webdriver.WebDriver;

    beforeEach(async () => {
        driver = new webdriver.Builder().
            withCapabilities(webdriver.Capabilities.chrome()).
            build();
    });
    
    afterEach(async () => {
        await driver.quit();
    });

    it('should display the register form', async () => {
        await driver.get(process.env.UI_TEST_URL + '/register');
        const form = await driver.findElement(webdriver.By.css('form'));
        expect(await form.isDisplayed()).to.be.true;
    });

    it('should submit the register form with valid input', async () => {
        await driver.get(process.env.UI_TEST_URL + '/register');
        const emailInput = await driver.findElement(webdriver.By.id('email'));
        const passwordInput = await driver.findElement(webdriver.By.id('password'));
        const registerButton = await driver.findElement(webdriver.By.css('button[type="submit"]'));

        await emailInput.sendKeys(validEmail);
        await passwordInput.sendKeys(validPassword);
        await registerButton.click();
    });

    it("should display error when invalid email", async () => {
        await driver.get(process.env.UI_TEST_URL + '/register');
        const emailInput = await driver.findElement(webdriver.By.id('email'))
        const passwordInput = await driver.findElement(webdriver.By.id('password'));
        const loginButton = await driver.findElement(webdriver.By.css('button[type="submit"]'));

        await emailInput.sendKeys("invalid");
        await passwordInput.sendKeys(validPassword);
        await loginButton.click();
        expect(await driver.getCurrentUrl()).to.equal(process.env.UI_TEST_URL + '/register');
        expect(await driver.findElement(webdriver.By.id('errorMessage')).getText()).to.equal('Please check your details: Email is invalid');
    });
    
    it("should display error when invalid password", async () => {
        await driver.get(process.env.UI_TEST_URL + '/register');
        const emailInput = await driver.findElement(webdriver.By.id('email'))
        const passwordInput = await driver.findElement(webdriver.By.id('password'));
        const loginButton = await driver.findElement(webdriver.By.css('button[type="submit"]'));

        await emailInput.sendKeys(validEmail);
        await passwordInput.sendKeys("invalid");
        await loginButton.click();

        expect(await driver.getCurrentUrl()).to.equal(process.env.UI_TEST_URL + '/register');
        expect(await driver.findElement(webdriver.By.id('errorMessage')).getText()).to.equal('Please check your details: Password must be at least 8 characters');
    });
});