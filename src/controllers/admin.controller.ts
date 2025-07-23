import { Request, Response } from "express";

// libs, middlewares, models
import { AuthRequest } from "../libs/AuthRequest.lib";
import aw from "../middlewares/asyncWrap.middleware";
import User from "../models/User.model";

// configs & utils
import { ADMIN_MESSAGES } from "../config/messages";
import { AdminAddSchema } from "../schemas/admin.schema";
import { errorResponse, successResponse } from "../utils/apiResponse.util";
import nullChecker from "../utils/nullChecker.util";

export const getAdminList = aw(async (req: AuthRequest, res: Response) => {
    const adminList = await User.find({
        isAdmin: true,
        _id: { $ne: req.user?._id },
    }).select("_id name picture");

    return successResponse(res, ADMIN_MESSAGES.LIST, {
        statusCode: 200,
        data: adminList,
    });
});

export const addAdmin = aw(async (req: Request, res: Response) => {
    const email = (req.body as AdminAddSchema).email;

    const user = await User.findOne({ email });

    if (user) {
        // if user is already an admin
        if (user.isAdmin)
            return errorResponse(res, ADMIN_MESSAGES.ALREADY_EXISTS, {
                statusCode: 409,
            });

        // if user is not an admin
        user.isAdmin = true;
        await user.save();
    } else {
        // if user does not exist
        await new User({
            email,
            name: email.split("@")[0],
            isAdmin: true,
        }).save();
    }

    return successResponse(res, ADMIN_MESSAGES.ADDED, { statusCode: 201 });
});

export const removeAdmin = aw(async (req: Request, res: Response) => {
    const email = req.query.email;
    nullChecker({ email });

    const admin = await User.findOne({ email, isAdmin: true });
    if (!admin)
        return errorResponse(res, ADMIN_MESSAGES.NOT_FOUND, {
            statusCode: 409,
        });

    await admin.deleteOne();

    return successResponse(res, ADMIN_MESSAGES.REMOVED);
});
