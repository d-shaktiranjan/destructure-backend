import { Schema, model } from "mongoose";

const userSchema = new Schema(
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
        },
    },
    { timestamps: true },
);

export default model("User", userSchema);
