import { expect } from 'chai';
import { By } from 'selenium-webdriver';
import { buildDriver } from './buildDriver';

describe('job-roles page', () => {

    it('should display table of job roles', async () => {
        const driver = buildDriver();

        await driver.get(process.env.UI_TEST_URL + '/job-roles');

        const jobRole = await driver.findElement(By.id('job-roles-table'));
        expect(jobRole).to.not.be.null;
        
        await driver.quit();
    })    

})