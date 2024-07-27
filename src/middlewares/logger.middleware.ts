import { Request, Response, NextFunction } from "express";

const logger = (req: Request, res: Response, next: NextFunction) => {
    const originalSend = res.send.bind(res);

    let responseBody: string | Buffer = "";

    res.send = (body) => {
        responseBody = body;
        return originalSend(body);
    };
    next();

    res.on("finish", () => {
        console.log("base url", req.baseUrl);
        console.log("METHOD", req.method);
        console.log(res.getHeaders());
        console.log("Request Body:", JSON.stringify(req.body));
        console.log("Response Body:", responseBody);
    });
};

export default logger;
