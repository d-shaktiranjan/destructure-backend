import { readFileSync } from "fs";

const getMetaDataFromPackage = () => {
    const packageJson = readFileSync("package.json", "utf8");
    const { name, version, description } = JSON.parse(packageJson);
    return { name, description, version };
};

const getRunningBranch = (): string => {
    try {
        const file = readFileSync(".git/HEAD", "utf8");
        return file.replace("ref: refs/heads/", "").replaceAll("\n", "");
    } catch (error) {
        if (error instanceof Error) return error.message;
        return "Error";
    }
};

const apiMetaData = {
    ...getMetaDataFromPackage(),
    tag: process.env.TAG,
    host: "",
    runningBranch: getRunningBranch(),
    documentation: "https://postman.destructure.in",
    license: "CC BY-NC-ND 4.0",
};

export default apiMetaData;
