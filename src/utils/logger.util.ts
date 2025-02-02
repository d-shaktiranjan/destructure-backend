import { writeFile } from "fs/promises";
import { IS_STORE_LOG_IN_FILE } from "../config/constants";

export const colorize = (...args: Array<unknown>) => ({
    red: `\x1b[31m${args.join(" ")}\x1b[0m`,
    green: `\x1b[32m${args.join(" ")}\x1b[0m`,
    cyan: `\x1b[36m${args.join(" ")}\x1b[0m`,
    bgRed: `\x1b[41m${args.join(" ")}\x1b[0m`,
});

const LOG_RECORDS: Record<
    string,
    { filePath: string; color: keyof ReturnType<typeof colorize> }
> = {
    INFO: {
        filePath: ".logs/info.log",
        color: "cyan",
    },
    ERROR: {
        filePath: ".logs/error.log",
        color: "red",
    },
    SUCCESS: {
        filePath: ".logs/success.log",
        color: "green",
    },
};

export const loggerTest = (
    message: unknown,
    logType: "INFO" | "ERROR" | "SUCCESS",
) => {
    logger(message, LOG_RECORDS[logType].filePath, LOG_RECORDS[logType].color);
};

function logger(
    message: unknown,
    filePath: string,
    color: keyof ReturnType<typeof colorize> = "cyan",
) {
    const timeStamp = new Date().toLocaleString("sv-SE");
    const logMessage = `[${timeStamp}] ${message}\n`;

    console.log(`[${timeStamp}]`, colorize(message)[color]);

    // store in to file
    if (IS_STORE_LOG_IN_FILE) writeFile(filePath, logMessage, { flag: "a" });
}
