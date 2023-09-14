# bham1-front-end

How to start the Express service application
---

1. Run `npm start` to build and start your application.
1. Start application with `java -jar target/bham1-backend-1.0-SNAPSHOT.jar server config.yml`
1. To check that your application is running enter url `http://localhost:3000`

How to test
---
1. Ensure that your application has been built.
1. Run the command `npm test` for unit tests.
1. Run the command `export UI_TEST_URL=http://localhost:3000 && npm run test-ui` for UI tests. [Ensure that your application is running locally before running this command]