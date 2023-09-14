import type {Request, Response, Application, response} from "express";
import type { Login } from "../model/auth";
import {login} from "../service/authService";

export namespace Auth
{
    export function get(req:Request, res:Response): void {
        res.render("login")
    }

    export async function post(req:Request, res:Response) : Promise<void>  {
        let data: Login = req.body;

        try{
            req.session.token  = await login(data)
            res.redirect('/index')
        }
        catch(e){
            res.locals.errormessage = (e as Error).message
            res.render('login', req.body)
        }
    }
}