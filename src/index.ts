import "dotenv/config";
import express, { Request, Response } from "express";
import { PORT } from "./config/constants";

// connect to DB
import connectToDB from "./db";
connectToDB();

const app = express();

app.get("/", (req: Request, res: Response) => {
    res.send("Hello from Express");
});

app.listen(PORT, () => {
    console.log(`App is running on ${PORT}`);
});
