import type { Request, Response } from "express";


export namespace Index {
    
    export async function getIndex(req: Request, res: Response): Promise<void> {
        res.render("index");
    }
}

