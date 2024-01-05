import { connect } from "mongoose";
import { MONGO_URI, DB_MESSAGES } from "./constants";

const connectToDB = () => {
    connect(MONGO_URI)
        .then(() => console.log(DB_MESSAGES.CONNECTED, MONGO_URI))
        .catch((error) => {
            console.log(DB_MESSAGES.FAILED);
            console.log(error);
        });
};
export default connectToDB;
