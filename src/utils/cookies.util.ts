import { Request } from "express";
import { COOKIES_OPTIONS } from "../config/constants";

const getCookiesOptions = (req: Request): Record<string, unknown> => {
    if (req.get("origin")?.split("//")[1].startsWith("localhost")) {
        return { ...COOKIES_OPTIONS, sameSite: "none" };
    }
    return COOKIES_OPTIONS;
};

export default getCookiesOptions;
