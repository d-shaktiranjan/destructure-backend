import { Schema, model } from "mongoose";
import { sign } from "jsonwebtoken";
import { JWT_SECRET, AUTH_TOKEN_EXPIRY } from "../config/constants";
import { UserDocument } from "../libs/UserDocument.lib";

const userSchema = new Schema<UserDocument>(
    {
        name: {
            type: String,
            minLength: 3,
            required: true,
        },
        email: {
            type: String,
            minLength: 5,
            required: true,
            unique: true,
        },
        picture: {
            type: String,
        },
        isAdmin: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true },
);

userSchema.methods.generateAuthToken = function () {
    return sign(
        {
            _id: this._id,
            email: this.email,
            name: this.name,
        },
        JWT_SECRET,
        {
            expiresIn: AUTH_TOKEN_EXPIRY,
        },
    );
};

export default model<UserDocument>("User", userSchema);
