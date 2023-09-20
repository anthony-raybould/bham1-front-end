
import pa11y from "pa11y";
import { processResults } from "./processResults";
import { assert } from "chai";
const _chai = require('chai');

describe('Index Page Accessibility Tests', async () => {

  it('Index page', async () => {

    try {
      const results = await pa11y(process.env.UI_TEST_URL + "/");
      processResults(results);

    } catch (e) {
      assert.fail(e);
    }
    

  });

});
