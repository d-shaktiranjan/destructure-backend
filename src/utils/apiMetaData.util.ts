import { readFileSync } from "fs";
import { logger } from "lorin";

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

const apiMetaData = {
    ...getMetaDataFromPackage(),
    tag: process.env.TAG,
    host: "",
    ...getCurrentGitBranchInfo(),
    documentation: "https://postman.destructure.in",
    license: "CC BY-NC-ND 4.0",
};

export default apiMetaData;
