import { spawn } from "child_process";

const child = spawn("pnpm", ["type-check"], { stdio: "inherit" });
child.on("exit", (code) => {
    if (code !== 0) {
        console.error(`Typecheck failed with exit code ${code}`);
        process.exit(1);
    } else {
        import("./index");
    }
});
