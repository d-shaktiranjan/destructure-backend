import { Request, Response, NextFunction } from "express";
import Logger from "../models/Logger.model";

const logger = (req: Request, res: Response, next: NextFunction) => {
    const originalSend = res.send.bind(res);

    let responseBody: string | Buffer = "";

    res.send = (body) => {
        responseBody = body;
        return originalSend(body);
    };
    next();

    res.on("finish", () => {
        const method = req.method;
        const route = req.baseUrl || "/";
        const statusCode = res.statusCode;

        console.log(`${method}- ${route} ${statusCode}`);

        // create log
        const log = new Logger({
            route,
            statusCode,
            method,
            headers: req.headers,
            query: req.query,
            body: req.body,
            response: JSON.parse((responseBody as string) || "{}"),
        });
        log.save();
    });
};

export default logger;
