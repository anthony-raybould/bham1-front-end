
import pa11y from "pa11y";
import { processResults } from "./processResults";


describe('Index Page Accessibility Tests', async () => {

  it('Index page', async () => {

    const results = await pa11y(process.env.UI_TEST_URL + "/");
    processResults(results);
    
  });

});
