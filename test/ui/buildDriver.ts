const webdriver = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');

export const buildDriver = function() {

    return new webdriver.Builder()
      .withCapabilities(webdriver.Capabilities.chrome())
      .setChromeOptions(new chrome.Options().addArguments('--headless'))
      .build();
} 