import pa11y from "pa11y";
import { processResults } from "./processResults";

describe('Create Capability Page Accessibility Tests', async () => {

    it('Create capability form', async () => {
        const results = await pa11y(process.env.UI_TEST_URL + "/capabilities/create", {
            actions: [
                "navigate to " + process.env.UI_TEST_URL! + "/login",
                "set field #email to " + process.env.LOGIN_CRED_EMAIL!,
                "set field #password to " + process.env.LOGIN_CRED_PWD!,
                "click element button[type=\"submit\"]",
                "wait for path to be /",
                "navigate to " + process.env.UI_TEST_URL + "/capabilities/create"
            ],
            chromeLaunchConfig :  {
                //@ts-ignore   @types/pa11y missing valid property "args" for LaunchConfig type.
                "args": ["--no-sandbox"]
            }
        });

        processResults(results);

    });

    it('Create capability form invalid input', async () => {
        const results = await pa11y(process.env.UI_TEST_URL + "/capabilities/create", {
            actions: [
                "navigate to " + process.env.UI_TEST_URL! + "/login",
                "set field #email to " + process.env.LOGIN_CRED_EMAIL!,
                "set field #password to " + process.env.LOGIN_CRED_PWD!,
                "click element button[type=\"submit\"]",
                "wait for path to be /",
                "navigate to " + process.env.UI_TEST_URL + "/capabilities/create",
                "set field #capabilityName to tooLongtooLongtooLongtooLongtooLongtooLongtooLongtooLongtooLongtooLongtooLong",
                "click element button[type=\"submit\"]",
                "wait for element #errorMessage to be visible"
            ],
            chromeLaunchConfig :  {
                //@ts-ignore   @types/pa11y missing valid property "args" for LaunchConfig type.
                "args": ["--no-sandbox"]
            }
        });

        processResults(results);

    });

    it('Create capability form success page', async () => {
        const results = await pa11y(process.env.UI_TEST_URL + "/capabilities/create", {
            actions: [
                "navigate to " + process.env.UI_TEST_URL! + "/login",
                "set field #email to " + process.env.LOGIN_CRED_EMAIL!,
                "set field #password to " + process.env.LOGIN_CRED_PWD!,
                "click element button[type=\"submit\"]",
                "wait for path to be /",
                "navigate to " + process.env.UI_TEST_URL + "/capabilities/create",
                "set field #capabilityName to AccessibilityTestCapability",
                "click element button[type=\"submit\"]",
                "wait for element h5 to be visible"
            ],
            chromeLaunchConfig :  {
                //@ts-ignore   @types/pa11y missing valid property "args" for LaunchConfig type.
                "args": ["--no-sandbox"]
            }
        });

        processResults(results);

    });

});
