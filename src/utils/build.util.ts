import { writeFileSync } from "fs";
import { logger } from "lorin";

const timestamp = new Date().toISOString();
const buildId = `build_${timestamp.replace(/[-:.TZ]/g, "")}`;

const buildInfo = {
    buildId,
    lastUpdated: timestamp,
};

writeFileSync("build-info.json", JSON.stringify(buildInfo, null, 2));
logger.success(`Build completed at ${timestamp} — ID: ${buildId}`);
