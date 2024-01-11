import "dotenv/config";
import express, { Request, Response } from "express";
import { PORT, APP_MESSAGE } from "./config/constants";

// connect to DB
import connectToDB from "./config/db";
connectToDB();

const app = express();

app.get("/", (req: Request, res: Response) => {
    res.send(APP_MESSAGE.HELLO);
});

app.listen(PORT, () => {
    console.log(APP_MESSAGE.RUNNING);
});
