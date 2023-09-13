import expressSession from 'express-session';
import express from 'express';
import nunjucks from 'nunjucks';
import path from 'path';


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

app.use("/public", express.static(path.join(__dirname, "public")));

app.use(express.json());
app.use(express.urlencoded({ extended : true}))

app.use(expressSession({
    secret : "NOT HARDCODED SECRET",
    resave : true,
    saveUninitialized : true,
    cookie : {maxAge : 60000},

}))

declare module "express-session" {
    interface SessionData {
    }
}

let port : number;
if (!process.env.UI_PORT || isNaN(parseInt(process.env.UI_PORT))) {
    port = 3000;
}
else {
    port = parseInt(process.env.UI_PORT);
}
app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
