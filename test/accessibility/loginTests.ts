
import pa11y from "pa11y";
import { Results } from "./results";

const baseUrl = "http://localhost:3000/";

describe('Login Page Accessibility Tests', async () => {

  it('Login Form', async () => {

    const results = await pa11y(baseUrl + "login");
    processResults(results);

  });

  it('should submit the login form with valid credentials', async () => {

  });

});

function processResults(results : Results) {
  throw new Error("Function not implemented." + results);
}
