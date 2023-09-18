import expressSession from 'express-session';
import express from 'express';
import nunjucks from 'nunjucks';
import path from 'path';
import router from "./router"
       
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

app.use(expressSession({secret : "NOT HARDCODED SECRET", cookie : {maxAge : 60000}}))

declare module "express-session" {
    interface SessionData {
        token: string;
    }
}
app.use('/', router);

let port = parseInt(process.env.UI_PORT) || 3000;

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});

app.get("/", (req, res) => {
    res.render("index");
});