import webdriver from 'selenium-webdriver';
import { expect } from 'chai';
import { By } from 'selenium-webdriver';

describe('viewing job-roles pages', () => {

    it('should display table of job roles', async () => {
        const driver = new webdriver.Builder().forBrowser('chrome').build();

        await driver.get(process.env.UI_TEST_URL + '/job-roles');

        const jobRole = await driver.findElement(By.id('job-roles-table'));
        expect(jobRole).to.not.be.null;
        
        await driver.quit();
    }) 
    
    it('should display a job role summary', async () => {
        const driver = new webdriver.Builder().forBrowser('chrome').build();
        await driver.get(process.env.UI_TEST_URL + '/view-job-role/1');
        
        const jobRole = await driver.findElement(By.id('summary'));
        expect(jobRole).to.not.be.null;
        
        await driver.quit();
    }) 

    it('should redirect to delete job role page when delete selected on view job roles page', async () => {
        const driver = new webdriver.Builder().forBrowser('chrome').build();
        await driver.get(process.env.UI_TEST_URL + '/job-roles');

        const deleteLink = await driver.findElement(webdriver.By.linkText('Delete'));
        await deleteLink.click();

        const currentUrl = await driver.getCurrentUrl();
        const expectedDeletePageUrl = process.env.UI_TEST_URL + '/delete-job-role/1'
        expect(currentUrl).to.equal(expectedDeletePageUrl);

        await driver.quit();
    }) 

    it('should redirect to delete job role page when delete selected on view a single job role page', async () => {
        const driver = new webdriver.Builder().forBrowser('chrome').build();
        await driver.get(process.env.UI_TEST_URL + '/view-job-role/2');

        const deleteLink = await driver.findElement(webdriver.By.className('btn btn-primary'));
        await deleteLink.click();

        const currentUrl = await driver.getCurrentUrl();
        const expectedDeletePageUrl = process.env.UI_TEST_URL + '/delete-job-role/2'
        expect(currentUrl).to.equal(expectedDeletePageUrl);

        await driver.quit();
    }) 
});