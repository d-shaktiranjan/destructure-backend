import { Request, Response, NextFunction } from "express";
import aw from "./asyncWrap.middleware";

const requestBodyMiddleware = aw(
    async (req: Request, res: Response, next: NextFunction) => {
        if (!req.body) req.body = {};
        next();
    },
);

export default requestBodyMiddleware;
