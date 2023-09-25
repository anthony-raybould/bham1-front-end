import pa11y from "pa11y";
import { processResults } from "./processResults";


describe('Job Roles Matrix Page Accessibility Tests', async () => {

  it('Matrix page', async () => {

    const results = await pa11y(process.env.UI_TEST_URL + "/job-roles/matrix", {
      chromeLaunchConfig :  {
        //@ts-ignore   @types/pa11y missing valid property "args" for LaunchConfig type.
        "args": ["--no-sandbox"]
      }
    });
    processResults(results);
    
  });

});