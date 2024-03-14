import { readFileSync } from "fs";

const conventionalCommitMessageRegExp =
    /^(build|chore|ci|docs|feat|fix|perf|refactor|revert|style|test|merge|wip){1}(\([\w\-\.]+\))?(!)?: \`?([\w ]+)\`?([\s\S]*)/g;
let exitCode = 0;
const message = readFileSync("./.git/COMMIT_EDITMSG", "utf8");
const isValid = conventionalCommitMessageRegExp.test(message);

if (!isValid) {
    console.log(
        "Invalid commit message. Please follow the conventional commit format.",
    );
    exitCode = 1;
}

process.exit(exitCode);
