import { connect } from "mongoose";
import { MONGO_URI } from "./constants";

const connectToDB = () => {
    connect(MONGO_URI)
        .then(() => console.log("DB Conneccted", MONGO_URI))
        .catch((error) => {
            console.log("Unable to connect to DB");
            console.log(error);
        });
};
export default connectToDB;
