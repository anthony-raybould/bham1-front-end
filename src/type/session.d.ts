import { User } from "../model/user";

declare module "express-session" {
    interface SessionData {
        token: string;
        user: User;
    }
}
