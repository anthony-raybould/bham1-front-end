import type {Request, Response } from "express";
import type { Login, Register } from "../model/auth";
import { authService } from "../service/authService";
import { registerValidator } from "../validator/registerValidator";

export namespace Auth
{
    export function getLogin(req: Request, res: Response): void {
        if (req.query?.registered) {
            res.locals.successMessage = "Account has been registered successfully. Please log in."
        }
        res.render("login")
    }

    export async function postLogin(req: Request, res: Response): Promise<void> {
        const data: Login = req.body;
        try {
            req.session.token  = await authService.login(data);
            req.session.user = await authService.whoami(req.session.token);

            res.redirect('/')
        } catch (e) {
            res.locals.errorMessage = (e as Error).message;
            res.render('login', req.body);
        }
    }
    
    export async function getRegister(req: Request, res: Response): Promise<void> {
        res.locals.roles = await authService.getRoles();

        res.render("register")
    }
    
    export async function postRegister(req: Request, res: Response): Promise<void> {
        const data: Register = req.body;
        
        const rerender = async (error: string) => {
            res.locals.errorMessage = error;
            res.locals.roles = await authService.getRoles();
            res.locals = {...res.locals, ...req.body};

            res.render("register");
        }
        
        const validationError = await registerValidator.validateRequest(data);
        if (validationError) {
            await rerender(`Please check your details: ${validationError}`);
            return;
        }
        
        try {
            await authService.register(data);
            
            res.redirect("/login?registered=true")
        } catch (e) {
            await rerender((e as Error).message);
        }
    }        
    
    export function getLogout(req: Request, res: Response): void {
        req.session.destroy(() => {
            res.redirect('/');
        });
    }
}