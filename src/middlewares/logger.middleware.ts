import { Request, Response, NextFunction } from "express";
import Logger from "../models/Logger.model";
import { IS_STORE_LOG } from "../config/constants";
console.log("IS_STORE_LOG", IS_STORE_LOG);

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
        if (IS_STORE_LOG) {
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
        }
    });
};

export default logger;
