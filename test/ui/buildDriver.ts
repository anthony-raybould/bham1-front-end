import {Builder, Capabilities} from "selenium-webdriver";
import {Options} from "selenium-webdriver/chrome"

export const buildDriver = function() {

    const driver = new Builder()
      .withCapabilities(Capabilities.chrome())
      .setChromeOptions(new Options().headless())
      .build();

      /* Enforces a minimum wait before failing when getting elements, 
       * else headless mode goes too fast and fails before elements can load. */
      driver.manage().setTimeouts({implicit: 5000});

      return driver;
} 