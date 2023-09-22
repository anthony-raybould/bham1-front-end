import webdriver from 'selenium-webdriver';
import _chai from 'chai';

describe('Login Page UI Tests', async () => {
  let driver: webdriver.WebDriver;

  beforeEach(async () => {
      driver = new webdriver.Builder().
          withCapabilities(webdriver.Capabilities.chrome()).
          build();
  });

  afterEach(async () => {
      await driver.quit();
  });

  it('should display the login form', async () => {
    await driver.get(process.env.UI_TEST_URL + '/login');
    const form = await driver.findElement(webdriver.By.tagName('form'));
    _chai.expect(await form.isDisplayed()).to.be.true;
  });

  it('should submit the login form with valid credentials', async () => {
    await driver.get(process.env.UI_TEST_URL + '/login');
    const emailInput = await driver.findElement(webdriver.By.id('email'));
    const passwordInput = await driver.findElement(webdriver.By.id('password'));
    const loginButton = await driver.findElement(webdriver.By.css('button[type="submit"]'));

    await emailInput.sendKeys(process.env.LOGIN_CRED_EMAIL!);
    await passwordInput.sendKeys(process.env.LOGIN_CRED_PWD!);
    await loginButton.click();
  });
  it("should display error when invalid creds", async () => {
    await driver.get(process.env.UI_TEST_URL + '/login');
    const emailInput = await driver.findElement(webdriver.By.id('email'))
    const passwordInput = await driver.findElement(webdriver.By.id('password'));
    const loginButton = await driver.findElement(webdriver.By.css('button[type="submit"]'));

    await emailInput.sendKeys("thisIs@anInvalidEmail.com");
    await passwordInput.sendKeys(process.env.LOGIN_CRED_PWD!);
    await loginButton.click();
    _chai.expect(await driver.getCurrentUrl()).to.equal(process.env.UI_TEST_URL + '/login');
    _chai.expect(await driver.findElement(webdriver.By.id('errorMessage')).getText()).to.equal('Invalid credentials - 401');
  });
});