import type {Request, Response, Application, response} from "express";
import type { Login } from "../model/auth";
import { authService } from "../service/authService";

export namespace Auth
{
    export function getLogin(req: Request, res: Response): void {
        res.render("login")
    }

    export async function postLogin(req: Request, res: Response): Promise<void> {
        let data: Login = req.body;

        try {
            req.session.token  = await authService.login(data);
            req.session.user = await authService.whoami(req.session.token);

            res.redirect('/')
        } catch (e) {
            res.locals.errormessage = (e as Error).message;
            res.render('login', req.body);
        }
    }
    
    export function getLogout(req: Request, res: Response): void {
        req.session.destroy(() => {
            res.redirect('/');
        });
    }
}