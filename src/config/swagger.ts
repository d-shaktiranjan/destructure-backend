import { readFileSync } from "fs";
import { parse } from "yaml";

const file = readFileSync("docs/openapi.yaml", "utf8");
const swaggerDocument = parse(file);

export const swaggerOptions = {
    swaggerOptions: {
        docExpansion: "none", // keep all the sections collapsed by default
    },
    customSiteTitle: "Destructure docs",
};

export default swaggerDocument;
