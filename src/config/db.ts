import { connect } from "mongoose";
import { logger } from "lorin";
import { MONGO_URI } from "./constants";
import { DB_MESSAGES } from "./messages";

const connectToDB = () => {
    connect(MONGO_URI)
        .then(() => logger.success(DB_MESSAGES.CONNECTED))
        .catch((error) => {
            logger.error(`${DB_MESSAGES.FAILED} ${error}`);
            process.exit();
        });
};
export default connectToDB;
