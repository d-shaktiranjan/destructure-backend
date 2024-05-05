import { COOKIES_OPTIONS, DEBUG } from "../config/constants";

const getCookiesOptions = (): Record<string, unknown> => {
    if (DEBUG) {
        return { ...COOKIES_OPTIONS, sameSite: "none" };
    }
    return COOKIES_OPTIONS;
};

export default getCookiesOptions;
