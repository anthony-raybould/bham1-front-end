import { expect } from 'chai';
import { By } from 'selenium-webdriver';
import { buildDriver } from './buildDriver';
import { login } from './generateCredentials';

describe('Job Roles Matrix page', () => {

    it('should display matrix of job roles', async () => {
        const driver = buildDriver();

        await login(driver);

        await driver.get(process.env.UI_TEST_URL + '/job-roles/matrix');

        const jobRole = await driver.findElement(By.id('matrix-table'));
        expect(jobRole).to.not.be.null;

        const principalBand = await driver.findElement(By.xpath('//*[@id="matrix-table"]/tbody/tr[2]/th')).getText();
        expect(principalBand).to.equal("Principal")
        
        await driver.quit();
    })

    it('should have link to job role in matrix', async () => {
        const driver = buildDriver();

        await login(driver);

        await driver.get(process.env.UI_TEST_URL + '/job-roles/matrix');

        const jobRoleLink = await driver.findElement(By.linkText("Associate Software Engineer"));
        expect(jobRoleLink).to.not.be.null;
        
        await driver.quit();
    })  

})