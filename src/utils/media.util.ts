import { createHash } from "crypto";
import { readFileSync } from "fs";

export const calculateFileHash = (filePath: string): string => {
    const fileBuffer = readFileSync(filePath);
    const hash = createHash("sha256").update(fileBuffer).digest("hex");
    return hash;
};
