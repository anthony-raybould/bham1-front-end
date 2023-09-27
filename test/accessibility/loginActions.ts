export const loginActions = (path : string) => {

    return [
        "navigate to " + process.env.UI_TEST_URL! + "/login",
        "set field #email to " + process.env.LOGIN_CRED_EMAIL!,
        "set field #password to " + process.env.LOGIN_CRED_PWD!,
        "click element button[type=\"submit\"]",
        "wait for path to be /",
        "navigate to " + path
    ];
}