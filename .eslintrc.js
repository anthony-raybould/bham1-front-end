module.exports = {
    "env": {
        "es2022": true,
        "node": true
    },
    "extends": [
        "eslint:recommended",
        "plugin:@typescript-eslint/recommended"
    ],
    "overrides": [
        {
            "env": {
                "node": true
            },
            "files": [
                ".eslintrc.{js,cjs}"
            ],
            "parserOptions": {
                "sourceType": "script"
            }
        }
    ],
    "parser": "@typescript-eslint/parser",
    "parserOptions": {
        "ecmaVersion": "2022",
        "sourceType": "module"
    },
    "plugins": [
        "@typescript-eslint"
    ],
    "rules": {
        "max-len": ["error", { "code": 140 }], //enforce a max line length
        "indent": ["error", 4], //enforce two spaces for indentation
        "@typescript-eslint/no-unused-vars": [
            "error", // or "error"
            {
                "argsIgnorePattern": "^_",
                "varsIgnorePattern": "^_",
                "caughtErrorsIgnorePattern": "^_"
            }
        ],
        "@typescript-eslint/no-namespace": "off",
        "@typescript-eslint/ban-ts-comment": "warn",
    }
}
