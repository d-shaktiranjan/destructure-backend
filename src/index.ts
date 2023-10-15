import express, { Request, Response } from "express";

const app = express();
const PORT = 4000;

app.get("/", (req: Request, res: Response) => {
    res.send("Hello from Express");
});

app.listen(PORT, () => {
    console.log(`App is running on ${PORT}`);
});
