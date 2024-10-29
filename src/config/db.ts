import { connect } from "mongoose";
import { MONGO_URI } from "./constants";
import { DB_MESSAGES } from "./messages";

const connectToDB = () => {
    connect(MONGO_URI)
        .then(() => console.log(DB_MESSAGES.CONNECTED, MONGO_URI))
        .catch((error) => {
            console.log(DB_MESSAGES.FAILED);
            console.log(error);
            process.exit();
        });
};
export default connectToDB;
