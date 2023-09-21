import webdriver from 'selenium-webdriver';
import { expect } from 'chai';
import { By } from 'selenium-webdriver';

describe('job-roles page', () => {

    it('should display page for edit job roles', async () => {
        const driver = new webdriver.Builder().forBrowser('chrome').build();

        await driver.get(process.env.UI_TEST_URL + '/job-roles/edit/1');

        const jobRole = await driver.findElement(By.id('job-roles-table'));
        expect(jobRole).to.not.be.null;
        
        await driver.quit();
    })    
});