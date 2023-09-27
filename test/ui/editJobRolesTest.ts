import webdriver from 'selenium-webdriver';
import { expect } from 'chai';
import { By } from 'selenium-webdriver';
import {buildDriver} from "./buildDriver";
import { login } from './generateCredentials';

describe('job-roles page', () => {

    it('should display page for edit job roles', async () => {
        const driver = buildDriver();

        await login(driver);

        await driver.get(process.env.UI_TEST_URL + '/job-roles/edit/1');
        const pageTitle = await driver.findElement(By.css('h1')).getText();
        expect(pageTitle).to.equal('Edit Job Role');
    
        const jobRoleNameInput = await driver.findElement(By.id('jobRoleName'));
        const bandSelect = await driver.findElement(By.id('band')); 
        const capabilitySelect = await driver.findElement(By.id('capability'));
        const jobSpecSummaryInput = await driver.findElement(By.id('jobSpecSummary'));
        const responsibilitiesInput = await driver.findElement(By.id('responsibilities'));
        const sharePointInput = await driver.findElement(By.id('sharePoint'));
        const saveButton = await driver.findElement(By.css('button[type="submit"]'));
    
        expect(jobRoleNameInput).to.exist;
        expect(bandSelect).to.exist;
        expect(capabilitySelect).to.exist;
        expect(jobSpecSummaryInput).to.exist;
        expect(responsibilitiesInput).to.exist;
        expect(sharePointInput).to.exist;
        expect(saveButton).to.exist;

        await driver.quit();
      });
    
      it('should submit the form', async function () {
        const driver = buildDriver();

        await login(driver);

        await driver.get(process.env.UI_TEST_URL + '/job-roles/edit/1');

        const jobRoleNameInput = await driver.findElement(By.id('jobRoleName'));
        const bandSelect = await driver.findElement(By.id('band'));
        const capabilitySelect = await driver.findElement(By.id('capability'));
        const jobSpecSummaryInput = await driver.findElement(By.id('jobSpecSummary'));
        const responsibilitiesInput = await driver.findElement(By.id('responsibilities'));
        const sharePointInput = await driver.findElement(By.id('sharePoint'));
        const saveButton = await driver.findElement(By.css('button[type="submit"]'));
    
        await jobRoleNameInput.sendKeys('Updated Role');
        await bandSelect.sendKeys('2');
        await capabilitySelect.sendKeys('2');
        await jobSpecSummaryInput.sendKeys('Updated Summary');
        await responsibilitiesInput.sendKeys('Updated Responsibilities');
        await sharePointInput.sendKeys('https://www.something.com/');
    
        await saveButton.click();
        await driver.quit();
      });

      it('should get error message display when invalid form', async function () {
        const driver = buildDriver();

        await login(driver);

        await driver.get(process.env.UI_TEST_URL + '/job-roles/edit/1');

        const jobRoleNameInput = await driver.findElement(By.id('jobRoleName'));
        const bandSelect = await driver.findElement(By.id('band'));
        const capabilitySelect = await driver.findElement(By.id('capability'));
        const jobSpecSummaryInput = await driver.findElement(By.id('jobSpecSummary'));
        const responsibilitiesInput = await driver.findElement(By.id('responsibilities'));
        const sharePointInput = await driver.findElement(By.id('sharePoint'));
        const saveButton = await driver.findElement(By.css('button[type="submit"]'));
    
        await jobRoleNameInput.sendKeys('Updated Role');
        await bandSelect.sendKeys('2');
        await capabilitySelect.sendKeys('2');
        await jobSpecSummaryInput.sendKeys('Updated Summary');
        await responsibilitiesInput.sendKeys('Updated Responsibilities');
        await sharePointInput.sendKeys('this is an invalid url');
    
        await saveButton.click();
        const errorMessageElement = driver.findElement(webdriver.By.css('alert-danger'));
        errorMessageElement.getText().then(function (text) {
          expect(text).to.equal('Share point URL is invalid. Please supply a valid URL.');
      });
    await driver.quit();
    })
});