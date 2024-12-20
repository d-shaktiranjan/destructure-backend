import { Request, Response, NextFunction } from "express";
import Logger from "../models/Logger.model";
import { IS_STORE_LOG } from "../config/constants";

const logger = (req: Request, res: Response, next: NextFunction) => {
    const startTime = Date.now();
    const originalSend = res.send.bind(res);

    let responseBody: string | Buffer = "";

    res.send = (body) => {
        responseBody = body;
        return originalSend(body);
    };
    next();

    const colorize = (...args: Array<unknown>) => ({
        red: `\x1b[31m${args.join(" ")}`,
        green: `\x1b[32m${args.join(" ")}`,
        cyan: `\x1b[36m${args.join(" ")}`,
        bgRed: `\x1b[41m${args.join(" ")}\x1b[0m`,
    });

    res.on("finish", () => {
        const method = req.method;
        const route = req.baseUrl + req.url;
        const statusCode = res.statusCode;

        const endTime = Date.now();
        const timeStamp = new Date()
            .toISOString()
            .replace(/T/, " ")
            .replace(/\..+/, "");
        const logMessage = `[${timeStamp}] ${req.protocol}: ${method} ${route} ${statusCode} (${endTime - startTime}ms)`;

        if (statusCode >= 500) console.log(colorize(logMessage).bgRed);
        else if (statusCode >= 400) console.log(colorize(logMessage).red);
        else if (statusCode >= 300) console.log(colorize(logMessage).cyan);
        else if (statusCode >= 200) console.log(colorize(logMessage).green);
        else console.log(logMessage);

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
