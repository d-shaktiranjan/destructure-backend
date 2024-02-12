import "dotenv/config";
import express, { Response, Request, json } from "express";
import { PORT, APP_MESSAGES } from "./config/constants";
import cookieParser from "cookie-parser";

// connect to DB
import connectToDB from "./config/db";
connectToDB();

// route imports
import blogRouter from "./routes/blog.routes";
import authRouter from "./routes/auth.routes";
import adminRouter from "./routes/admin.routes";

// util imports
import apiMetaData from "./utils/apiMetaData.util";

const app = express();

// middlewares
app.use(json());
app.use(cookieParser());

// route usages
app.use("/api/blogs", blogRouter);
app.use("/api/auth", authRouter);
app.use("/api/admin", adminRouter);

app.get("/", (req: Request, res: Response) => {
    const host = req.protocol + "://" + req.get("host") + req.originalUrl;
    apiMetaData.host = host;
    return res.json(apiMetaData);
});

app.listen(PORT, () => {
    console.log(APP_MESSAGES.RUNNING);
});
