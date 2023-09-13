
import pa11y from "pa11y";
import { processResults } from "./processResults";

const baseUrl = "http://localhost:3000";

describe('Login Page Accessibility Tests', async () => {

  it('Login form', async () => {

    const results = await pa11y(baseUrl + "/login");
    processResults(results);

  });

  it('Login form invalid credentials', async () => {

    const results = await pa11y(baseUrl + "/login", {
      actions: [
        "set field #username to abc",
        "set field #password to xyz",
        "click element button[type=\"submit\"]"
      ]
    });

    processResults(results);
  });

});
