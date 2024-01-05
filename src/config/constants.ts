// environment variables
export const PORT = process.env.PORT;
export const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017";

export const DB_MESSAGES = {
    CONNECTED: "DB Connected",
    FAILED: "Unable to connect to DB",
};
