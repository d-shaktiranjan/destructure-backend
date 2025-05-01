import { Schema, model } from "mongoose";
import { sign } from "jsonwebtoken";
import {
    JWT_SECRET,
    AUTH_TOKEN_EXPIRY_IN_DAYS,
    SEARCH_ARRAY_MAX_LENGTH,
} from "../config/constants";
import { SearchDocument, UserDocument } from "../libs/Documents.lib";

const searchSchema = new Schema<SearchDocument>({
    query: {
        type: String,
        required: true,
    },
    blog: {
        type: Schema.Types.ObjectId,
        ref: "Blog",
        required: false,
    },
    createdAt: {
        type: Schema.Types.Date,
        default: Date.now,
    },
});

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
        searches: {
            type: [searchSchema],
            validate: [
                (val: unknown[]): boolean =>
                    val.length <= SEARCH_ARRAY_MAX_LENGTH,
                `Exceeds the limit of ${SEARCH_ARRAY_MAX_LENGTH}.`,
            ],
        },
    },
    { timestamps: true },
);

userSchema.methods.generateAuthToken = function () {
    const payload = {
        _id: this._id,
        email: this.email,
        name: this.name,
        isAdmin: this.isAdmin,
        picture: this.picture,
    };

    return sign(payload, JWT_SECRET, {
        expiresIn: `${AUTH_TOKEN_EXPIRY_IN_DAYS}d`,
    });
};

userSchema.methods.storeSearchResult = function (query: string) {
    if (this.searches.length >= 5) this.searches.shift();
    this.searches.push({ query });
    this.save();
};

export default model<UserDocument>("User", userSchema);
