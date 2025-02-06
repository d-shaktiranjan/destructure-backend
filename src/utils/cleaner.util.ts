import "dotenv/config";
import { unlinkSync } from "fs";
import { loggerTest } from "./logger.util";
import Logger from "../models/Logger.model";
import connectToDB from "../config/db";

const args = process.argv.slice(2)[0];
const allowedValues = ["file", "db"];
if (!args || !allowedValues.includes(args))
    throw new Error(`${allowedValues} is only allowed`);

if (args === "db") databaseCleaner();
else fileCleaner();

async function databaseCleaner() {
    connectToDB();
    const loggerData = await Logger.deleteMany();
    loggerTest(
        `Successfully logs cleared from DB - ${loggerData.deletedCount}`,
        "SUCCESS",
    );
    process.exit();
}

function fileCleaner() {
    const filePaths = ["api.log", "info.log", "success.log"];
    for (const path of filePaths) {
        unlinkSync(`.logs/${path}`);
    }
    loggerTest("Successfully log filed deleted", "SUCCESS");
    process.exit();
}
