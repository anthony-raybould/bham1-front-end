import expressSession from 'express-session';
import express from 'express';
import nunjucks from 'nunjucks';
import path from 'path';
import { authController } from './controller/authController';
import cors from 'cors'

const app = express();
// app.use(cors)
// app.use(express.json());


// app.use((req, res, next) => {
//   if (req.headers['x-forwarded-proto'] !== 'https') {
//     return res.redirect(`https://${req.headers.host}${req.url}`);
//   }
//   return next();
// });

// const corsOptions = {
//   methods: 'GET,PUT,POST,DELETE',
// };

// app.use(cors(corsOptions));

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

app.listen(3000, () => {
    console.log("Server listening on port 3000");
});

app.get("/", (req, res) => {
    res.render("index");
});

authController(app);