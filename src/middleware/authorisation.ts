import { Request, Response, NextFunction } from "express";

export function requireRole(requiredRole: string) {
    return function (req: Request, res: Response, next: NextFunction) {
        if (req.session && (req.session.user?.role.roleName == 'Admin' || req.session.user?.role.roleName === requiredRole)) {
            return next();
        } 

        if (req.session.user) {
            res.locals.errorMessage = `User ${req.session.user?.email} is not authorized to view this page.`;
        } else {
            res.locals.errorMessage = `You must be logged in to view this page.`;
        }
        res.render('forbidden');
    }
}

export const requireLoggedOut = (req: Request, res: Response, next: NextFunction) => {
    if (req.session && req.session.user && req.session.token) {
        res.redirect('/');
    } else {
        next();
    }
}

export const requireLoggedIn = (req: Request, res: Response, next: NextFunction) => {
    if (req.session && req.session.user && req.session.token) {
        next();
    } else {
        res.redirect('/login');
    }
}

export const user = (req: Request, res: Response, next: NextFunction) => {
    if (req.session && req.session.user) {
        res.locals.user = req.session.user;
    }
    next();
}