import type {Request, Response, Application, response} from "express";
import type { Login } from "../model/auth";
import {login} from "../service/authService";

export const authController = (app: Application) =>
{
    app.get('/login', async (req:Request, res:Response) => {
        res.render("login")
    })
    app.post('/login', async (req:Request, res:Response) => {
        let data: Login = req.body;

        try{
            req.session.token  = await login(data)
            console.log(req.session)
            res.redirect('/index')
        }
        catch(e){
            console.error(e)
            res.locals.errormessage = (e as Error).message
            res.render('login', req.body)
        }

    })
}