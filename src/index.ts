import "dotenv/config";
import cors from "cors";
import express, { Response, Request, json, static as static_ } from "express";
import cookieParser from "cookie-parser";

import { PORT, CORS_ORIGINS } from "./config/constants";
import { APP_MESSAGES } from "./config/messages";

// connect to DB
import connectToDB from "./config/db";
connectToDB();

// route imports
import blogRouter from "./routes/blog.routes";
import authRouter from "./routes/auth.routes";
import adminRouter from "./routes/admin.routes";
import commentRouter from "./routes/comment.routes";
import reactRouter from "./routes/react.routes";
import searchRouter from "./routes/search.routes";

// util imports
import apiMetaData from "./utils/apiMetaData.util";
import loggerMiddleware from "./middlewares/logger.middleware";
import { loggerTest } from "./utils/logger.util";

const app = express();

// middlewares
app.use(cors({ origin: CORS_ORIGINS }));
app.use(json());
app.use(cookieParser());
app.use(static_("public"));

app.use(loggerMiddleware);

// route usages
app.use("/api/blogs", blogRouter);
app.use("/api/auth", authRouter);
app.use("/api/admin", adminRouter);
app.use("/api/comment", commentRouter);
app.use("/api/reaction", reactRouter);
app.use("/api/search", searchRouter);

app.get("/api", (req: Request, res: Response) => {
    const host = req.protocol + "://" + req.get("host") + req.originalUrl;
    apiMetaData.host = host;
    res.json(apiMetaData);
});

app.listen(PORT, () => {
    loggerTest(APP_MESSAGES.RUNNING, "INFO");
});
