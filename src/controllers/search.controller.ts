import { Response } from "express";
import asyncWrapper from "../middlewares/asyncWrap.middleware";
import { errorResponse, successResponse } from "../utils/apiResponse.util";
import { AuthRequest } from "../libs/AuthRequest.lib";
import { SearchDocument } from "../libs/Documents.lib";
import nullChecker from "../utils/nullChecker.util";

export const addSearchItem = asyncWrapper(
    async (req: AuthRequest, res: Response) => {
        const query = req.query.query;
        nullChecker(res, { query });

        const user = req.user;
        if (!user) return errorResponse(res, "");

        user.searches.push({ query } as SearchDocument);
        user?.save();
        return successResponse(res, "");
    },
);
