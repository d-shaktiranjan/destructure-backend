import { readdir } from "fs/promises";
import { Request, Response } from "express";

import asyncWrapper from "../middlewares/asyncWrap.middleware";
import { successResponse } from "../utils/apiResponse.util";
import { IMAGE_MESSAGES } from "../config/messages";

export const imageList = asyncWrapper(async (req: Request, res: Response) => {
    const host = req.protocol + "://" + req.get("host") + "/images/";

    const dirList = (await readdir("public/images"))
        .filter((item) => item != ".gitkeep")
        .map((item) => host + item);

    return successResponse(res, IMAGE_MESSAGES.LIST_FETCHED, 200, dirList);
});
