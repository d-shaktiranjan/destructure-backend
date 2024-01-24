import "dotenv/config";
import express, { Response, Request } from "express";
import { PORT, APP_MESSAGES } from "./config/constants";
import session from "express-session";
import cookieParser from "cookie-parser";

// connect to DB
import connectToDB from "./config/db";
connectToDB();

// route imports
import authRouter from "./routes/auth.routes";
import blogRouter from "./routes/blog.routes";

const app = express();

declare module "express-session" {
    interface SessionData {
        user: object;
    }
}

app.use(cookieParser());
app.use(
    session({
        secret: "keyboard cat",
        resave: false,
        saveUninitialized: true,
        cookie: { secure: false },
    })
);

// ejs config
app.set("views", "src/views");
app.set("view engine", "ejs");

// route usages
app.use("/auth", authRouter);
app.use("/blog", blogRouter);

app.get("/", (req: Request, res: Response) => {
    res.render("index", { user: req.session.user });
});

app.listen(PORT, () => {
    console.log(APP_MESSAGES.RUNNING);
});
