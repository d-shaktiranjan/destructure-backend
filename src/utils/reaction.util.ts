import { Schema } from "mongoose";
import Reaction from "../models/Reaction.model";

export const getReactionCountOfBlog = async (
    blog: Schema.Types.ObjectId,
): Promise<number> => {
    return await Reaction.countDocuments({ blog });
};
