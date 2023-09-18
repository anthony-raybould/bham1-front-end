
import pa11y from "pa11y";
import { processResults } from "./processResults";


describe('Login Page Accessibility Tests', async () => {

  it('Login form', async () => {

    const results = await pa11y(process.env.UI_TEST_URL + "/login");
    processResults(results);

  });

  it('Login form invalid credentials', async () => {

    const results = await pa11y(process.env.UI_TEST_URL + "/login", {
      actions: [
        "set field #email to abc",
        "set field #password to xyz",
        "click element button[type=\"submit\"]"
      ]
    });

    processResults(results);
  });

});