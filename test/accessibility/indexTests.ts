
import pa11y from "pa11y";
import { processResults } from "./processResults";
import { loginActions } from "./loginActions";


describe('Index Page Accessibility Tests', async () => {

    it('Index page', async () => {

        const results = await pa11y(process.env.UI_TEST_URL + "/", {
            actions: loginActions(process.env.UI_TEST_URL + "/"),
            chromeLaunchConfig :  {
                //@ts-ignore   @types/pa11y missing valid property "args" for LaunchConfig type.
                "args": ["--no-sandbox"]
            }
        });
        processResults(results);
    
    });

});
