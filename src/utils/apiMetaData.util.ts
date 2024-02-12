import { readFileSync } from "fs";

const getMetaDataFromPackage = () => {
    const packageJson = readFileSync("package.json", "utf8");
    const { name, version, description } = JSON.parse(packageJson);
    return { name, description, version };
};

const getRunningBranch = () => {
    const file = readFileSync(".git/HEAD", "utf8");
    return file.replace("ref: refs/heads/", "").replaceAll("\n", "");
};

const apiMetaData = {
    ...getMetaDataFromPackage(),
    tag: process.env.TAG,
    host: "",
    runningBranch: getRunningBranch(),
    documentation: null,
    license: null,
};

export default apiMetaData;
