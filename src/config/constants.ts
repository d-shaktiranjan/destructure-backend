// environment variables
export const PORT = process.env.PORT || 8000;
export const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017";

export const APP_MESSAGE = {
    HELLO: "Hello from Express",
    RUNNING: `App is running on ${PORT}`,
};

export const DB_MESSAGES = {
    CONNECTED: "DB Connected",
    FAILED: "Unable to connect to DB",
};
