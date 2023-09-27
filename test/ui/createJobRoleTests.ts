import webdriver from 'selenium-webdriver';
import { expect } from 'chai';
import { By } from 'selenium-webdriver';

describe('create-job-role page', () => {

    it('should display page for create job roles', async () => {
        const driver = new webdriver.Builder().forBrowser('chrome').build();

        await driver.get(process.env.UI_TEST_URL + '/create-job-role');
        
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

      it('should submit the create job role form', async function () {
        const driver = new webdriver.Builder().forBrowser('chrome').build();
        await driver.get(process.env.UI_TEST_URL + '/create-job-role');

        const jobRoleNameInput = await driver.findElement(By.id('jobRoleName'));
        const bandSelect = await driver.findElement(By.id('band'));
        const capabilitySelect = await driver.findElement(By.id('capability'));
        const jobSpecSummaryInput = await driver.findElement(By.id('jobSpecSummary'));
        const responsibilitiesInput = await driver.findElement(By.id('responsibilities'));
        const sharePointInput = await driver.findElement(By.id('sharePoint'));
        const createButton = await driver.findElement(By.css('button[type="submit"]'));

        await jobRoleNameInput.sendKeys('Created Role');
        await bandSelect.sendKeys('2');
        await capabilitySelect.sendKeys('2');
        await jobSpecSummaryInput.sendKeys('Created Summary');
        await responsibilitiesInput.sendKeys('Created Responsibilities');
        await sharePointInput.sendKeys('https://www.something.com/');

        await createButton.click();
        await driver.quit();

      });

      it('should get error message display when invalid form', async function () {
        const driver = new webdriver.Builder().forBrowser('chrome').build();
        await driver.get(process.env.UI_TEST_URL + '/create-job-role');

        const jobRoleNameInput = await driver.findElement(By.id('jobRoleName'));
        const bandSelect = await driver.findElement(By.id('band'));
        const capabilitySelect = await driver.findElement(By.id('capability'));
        const jobSpecSummaryInput = await driver.findElement(By.id('jobSpecSummary'));
        const responsibilitiesInput = await driver.findElement(By.id('responsibilities'));
        const sharePointInput = await driver.findElement(By.id('sharePoint'));
        const createButton = await driver.findElement(By.css('button[type="submit"]'));

        await jobRoleNameInput.sendKeys('Created Role');
        await bandSelect.sendKeys('2');
        await capabilitySelect.sendKeys('2');
        await jobSpecSummaryInput.sendKeys('Created Summary');
        await responsibilitiesInput.sendKeys('Created Responsibilities');
        await sharePointInput.sendKeys('Invalid URL');

        await createButton.click();
        const errorMessageElement = driver.findElement(webdriver.By.css('alert alert-danger'));
        errorMessageElement.getText().then(function (text) {
          expect(text).to.equal('Invalid sharepoint link.');
      });
      await driver.quit();
    })
    
});