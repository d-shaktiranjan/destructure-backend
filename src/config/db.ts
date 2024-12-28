import { connect } from "mongoose";
import { MONGO_URI } from "./constants";
import { DB_MESSAGES } from "./messages";
import { loggerTest } from "../utils/logger.util";

const connectToDB = () => {
    connect(MONGO_URI)
        .then(() => loggerTest(DB_MESSAGES.CONNECTED, "SUCCESS"))
        .catch((error) => {
            loggerTest(`${DB_MESSAGES.FAILED} ${error}`, "ERROR");
            process.exit();
        });
};
export default connectToDB;
