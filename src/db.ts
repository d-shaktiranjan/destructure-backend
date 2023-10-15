import { connect } from "mongoose";

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017";

const connectToDB = () => {
    connect(MONGO_URI)
        .then(() => console.log("DB Conneccted", MONGO_URI))
        .catch((error) => {
            console.log("Unable to connect to DB");
            console.log(error);
        });
};
export default connectToDB;
