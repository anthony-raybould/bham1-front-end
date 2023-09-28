import { expect } from 'chai';
import { By } from 'selenium-webdriver';
import {buildDriver} from "./buildDriver";
import { login } from './generateCredentials';

describe('create capability page', () => {

    it('should display page for create capability', async () => {
        const driver = buildDriver();

        await login(driver);

        await driver.get(process.env.UI_TEST_URL + '/capabilities/create');

        const pageTitle = await driver.findElement(By.css('h1')).getText();
        expect(pageTitle).to.equal('Create Capability');

        const capabilityNameInput = await driver.findElement(By.id('capabilityName'));
        const saveButton = await driver.findElement(By.css('button[type="submit"]'));
        expect(capabilityNameInput).to.exist;
        expect(saveButton).to.exist;

        await driver.quit();
    });

    it('should show validation error on invalid input', async () => {
        const driver = buildDriver();

        await login(driver);

        await driver.get(process.env.UI_TEST_URL + '/capabilities/create');
    
        const capabilityNameInput = await driver.findElement(By.id('capabilityName'));
        await capabilityNameInput.sendKeys("  ");

        await driver.findElement(By.css('button[type="submit"]')).click();

        const errorMessageText = await driver.findElement(By.id('errorMessage')).getText();
        expect(errorMessageText).to.equal("Invalid: capability name is empty");

        await driver.quit();
    });

    it('should go to success page on valid input', async () => {
        const driver = buildDriver();

        await login(driver);

        await driver.get(process.env.UI_TEST_URL + '/capabilities/create');
    
        const capabilityNameInput = await driver.findElement(By.id('capabilityName'));
        await capabilityNameInput.sendKeys("UI Test Capability");

        await driver.findElement(By.css('button[type="submit"]')).click();

        const successMessage = await driver.findElement(By.xpath("/html/body/main/h5")).getText();
        expect(successMessage).to.equal('Capability "UI Test Capability" created successfully')

        await driver.quit();
    });

});