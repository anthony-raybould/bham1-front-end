import expressSession from 'express-session';
import express from 'express';
import nunjucks from 'nunjucks';
import path from 'path';
import type { User } from './model/user';
import router from './router';
import { user } from './middleware/authorisation';
       
const app = express();

// Configure Nunjucks.
const appViews = path.join(__dirname, "/views/")

const nunjucksConfig = {
    autoescape : true,
    noCache : true,
    express : app
};

nunjucks.configure(appViews, nunjucksConfig);

// Configure Express.
app.set("view engine", "html");

app.use("/static", express.static(path.join(__dirname, "static")));

app.use(express.json());
app.use(express.urlencoded({ extended : true}))

app.use(expressSession({ secret: "NOT HARDCODED SECRET", resave: true, cookie: { maxAge: 1000 * 60 * 60 * 24 } }))

declare module "express-session" {
    interface SessionData {
        token: string;
        user: User;
    }
}

app.use(user);

app.use('/', router);

const port = parseInt(process.env.PORT || "3000");

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
