import webdriver from 'selenium-webdriver';
import { expect } from 'chai';
import { By } from 'selenium-webdriver';

describe('job-roles page', () => {

    it('should display page for edit job roles', async () => {
        const driver = new webdriver.Builder().forBrowser('chrome').build();

        await driver.get(process.env.UI_TEST_URL + '/job-roles/edit/1');
        const pageTitle = await driver.findElement(By.css('h2')).getText();
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
    
    //   it('should submit the form', async function () {
    //     // Navigate to the edit job role page
    //     await driver.get('http://your-website.com/job-roles/edit/1'); // Replace with your actual URL
    
    //     // Fill out the form fields
    //     const jobRoleNameInput = await driver.findElement(By.id('jobRoleName'));
    //     const bandSelect = await driver.findElement(By.id('band'));
    //     const capabilitySelect = await driver.findElement(By.id('capability'));
    //     const jobSpecSummaryInput = await driver.findElement(By.id('jobSpecSummary'));
    //     const responsibilitiesInput = await driver.findElement(By.id('responsibilities'));
    //     const sharePointInput = await driver.findElement(By.id('sharePoint'));
    //     const saveButton = await driver.findElement(By.css('button[type="submit"]'));
    
    //     await jobRoleNameInput.sendKeys('Updated Role');
    //     await bandSelect.sendKeys('Updated Band');
    //     await capabilitySelect.sendKeys('Updated Capability');
    //     await jobSpecSummaryInput.sendKeys('Updated Summary');
    //     await responsibilitiesInput.sendKeys('Updated Responsibilities');
    //     await sharePointInput.sendKeys('Updated SharePoint');
    
    //     // Submit the form
    //     await saveButton.click();
    
    //     // You can add assertions here to verify that the form was submitted successfully
    //     // For example, you can check for a success message or navigate to a confirmation page.
    //   });
});