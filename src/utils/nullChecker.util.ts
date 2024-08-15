import { GENERIC_MESSAGES } from "../config/messages";
import ApiError from "../libs/ApiError.lib";

const nullChecker = (elementObject: Record<string, unknown>) => {
    const errors: Record<string, string[]> = {};

    for (const [key, value] of Object.entries(elementObject)) {
        if (!Object.prototype.hasOwnProperty.call(elementObject, key)) continue;

        if (value == null || (typeof value === "string" && value.trim() === ""))
            errors[key] = [GENERIC_MESSAGES.KEY_MISSING_OR_NULL];
    }
    if (Object.keys(errors).length > 0)
        throw new ApiError(GENERIC_MESSAGES.FIELD_ERROR, 400, errors);
};
export default nullChecker;
