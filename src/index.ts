import cookieParser from "cookie-parser";
import cors from "cors";
import "dotenv/config";
import express, { Request, Response, json, static as static_ } from "express";
import { logger, loggerMiddleware } from "lorin";
import swaggerUi from "swagger-ui-express";

// middlewares imports
import requestBodyMiddleware from "./middlewares/body.middleware";
import dbLogger from "./middlewares/logger.middleware";

// config & utils imports
import { CORS_ORIGINS, PORT } from "./config/constants";
import { APP_MESSAGES } from "./config/messages";
import swaggerDocument, { swaggerOptions } from "./config/swagger";
import apiMetaData from "./utils/apiMetaData.util";

// connect to DB
import connectToDB from "./config/db";
connectToDB();

// route imports
import adminRouter from "./routes/admin.routes";
import authRouter from "./routes/auth.routes";
import blogRouter from "./routes/blog.routes";
import commentRouter from "./routes/comment.routes";
import reactRouter from "./routes/react.routes";
import searchRouter from "./routes/search.routes";

const app = express();

// middlewares usages
app.use(cors({ origin: CORS_ORIGINS }));
app.use(json());
app.use(cookieParser());
app.use(static_("public"));
app.use(requestBodyMiddleware);
app.use(loggerMiddleware);
app.use(dbLogger);

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

app.use(
    "/docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerDocument, swaggerOptions),
);

app.listen(PORT, () => {
    logger.success(APP_MESSAGES.RUNNING);
});
