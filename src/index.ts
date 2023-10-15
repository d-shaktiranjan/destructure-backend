import express, { Request, Response } from "express";
import "dotenv/config";

import connectToDB from "./db";
connectToDB();

const app = express();
const { PORT } = process.env;

app.get("/", (req: Request, res: Response) => {
    res.send("Hello from Express");
});

app.listen(PORT, () => {
    console.log(`App is running on ${PORT}`);
});
