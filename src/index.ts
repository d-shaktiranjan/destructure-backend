import "dotenv/config";
import express, { Request, Response } from "express";
import { PORT, APP_MESSAGE } from "./config/constants";

// connect to DB
import connectToDB from "./config/db";
connectToDB();

const app = express();

// ejs config
app.set("views", "src/views");
app.set("view engine", "ejs");

app.get("/", (req: Request, res: Response) => {
    res.render("index", { user: "shakti" });
});

app.listen(PORT, () => {
    console.log(APP_MESSAGE.RUNNING);
});
