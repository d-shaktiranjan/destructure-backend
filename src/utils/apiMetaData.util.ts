import { readFileSync } from "fs";
import { logger } from "lorin";

import { ENVIRONMENT } from "../config/constants";

const getMetaDataFromPackage = () => {
    const packageJson = readFileSync("package.json", "utf8");
    const { name, version, description } = JSON.parse(packageJson);
    return { name, description, version };
};

const getCurrentGitBranchInfo = () => {
    const data = {
        runningBranch: "unknown",
        commitHash: "unknown",
    };
    try {
        const commitFile = readFileSync(".git/HEAD", "utf8");
        const branchName = commitFile
            .replace("ref: refs/heads/", "")
            .replaceAll("\n", "");
        const hashFile = readFileSync(".git/refs/heads/" + branchName, "utf8");
        data.runningBranch = branchName;
        data.commitHash = hashFile.replaceAll("\n", "");
    } catch {
        logger.error(
            "Failed to read git branch or commit hash. Running in a non-git environment.",
        );
    }
    return data;
};

const getBuildInfo = () => {
    try {
        const buildInfo = readFileSync("build-info.json", "utf8");
        return JSON.parse(buildInfo);
    } catch {
        return {};
    }
};

const apiMetaData = {
    ...getMetaDataFromPackage(),
    environment: ENVIRONMENT,
    host: "",
    ...getCurrentGitBranchInfo(),
    ...getBuildInfo(),
    documentation: "https://postman.destructure.in",
    license: "CC BY-NC-ND 4.0",
};

export default apiMetaData;
