import { Request, Response, NextFunction } from "express";

export function requireRole(requiredRole: string) {
    return function (req: Request, res: Response, next: NextFunction) {
        if (req.session && (req.session.user?.role == 'Admin' || req.session.user?.role === requiredRole)) {
            next();
        } else {
            if (req.session.user) {
                res.locals.errorMessage = `User ${req.session.user?.email} is not authorized to view this page.`;
            } else {
                res.locals.errorMessage = `You must be logged in to view this page.`;
            }
            res.render('forbidden');
        }
    }
}

export function requireLoggedOut() {
    return function (req: Request, res: Response, next: NextFunction) {
        if (req.session && req.session.user) {
            res.redirect('/');
        } else {
            next();
        }
    }
}

export function requireLoggedIn() {
    return function (req: Request, res: Response, next: NextFunction) {
        if (req.session && req.session.user) {
            next();
        } else {
            res.redirect('/login');
        }
    }
}

export function user() {
    return function (req: Request, res: Response, next: NextFunction) {
        if (req.session && req.session.user) {
            res.locals.user = req.session.user;
        }
        next();
    }
}