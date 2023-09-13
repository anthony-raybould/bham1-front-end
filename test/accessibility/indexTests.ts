
import pa11y from "pa11y";
import { processResults } from "./processResults";

const baseUrl = "http://localhost:3000";

describe('Index Page Accessibility Tests', async () => {

  it('Index page', async () => {

    const results = await pa11y(baseUrl + "/");
    processResults(results);

  });

});
