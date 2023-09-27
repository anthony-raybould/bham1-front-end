import axios from "axios"
import { By, WebDriver } from "selenium-webdriver";
import webdriver from 'selenium-webdriver';

export const login = async function(driver : webdriver.ThenableWebDriver) {
    await driver.get(process.env.UI_TEST_URL + '/login');
    const emailInput = await driver.findElement(By.id('email'));
    const passwordInput = await driver.findElement(By.id('password'));
    const loginButton = await driver.findElement(By.css('button[type="submit"]'));
    await emailInput.sendKeys(process.env.LOGIN_CRED_EMAIL!);
    await passwordInput.sendKeys(process.env.LOGIN_CRED_PWD!);
    await loginButton.click();
}