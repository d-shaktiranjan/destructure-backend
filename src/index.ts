import "dotenv/config";
import express, { Response, Request, json } from "express";
import { PORT, APP_MESSAGES } from "./config/constants";
import cookieParser from "cookie-parser";

// connect to DB
import connectToDB from "./config/db";
connectToDB();

// route imports
import blogRouter from "./routes/blog.routes";

const app = express();

// middlewares
app.use(json());
app.use(cookieParser());

// route usages
app.use("/api/blog", blogRouter);

app.get("/", (req: Request, res: Response) => {
    res.send("Hello World");
});

app.listen(PORT, () => {
    console.log(APP_MESSAGES.RUNNING);
});
