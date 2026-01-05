import { exec } from "child_process";
import { createHash } from "crypto";
import { readFileSync } from "fs";
import sharp from "sharp";
import { promisify } from "util";

export const calculateFileHash = (filePath: string): string => {
    const fileBuffer = readFileSync(filePath);
    const hash = createHash("sha256").update(fileBuffer).digest("hex");
    return hash;
};

type Dimensions = { width: number; height: number };

export const compressImage = async (
    inputPath: string,
    outputPath: string,
    width: number = 1200,
): Promise<Dimensions> => {
    const image = await sharp(inputPath)
        .resize({
            width,
            withoutEnlargement: true,
        })
        .webp({
            quality: 100,
            effort: 3,
        })
        .toFile(outputPath);
    return { width: image.width, height: image.height };
};

export const getVideoDimensions = async (
    videoPath: string,
): Promise<Dimensions> => {
    const command = `
    ffprobe -v error \
    -select_streams v:0 \
    -show_entries stream=width,height \
    -of json \
    "${videoPath}"
  `;

    const execAsync = promisify(exec);
    const { stdout } = await execAsync(command);

    const parsed = JSON.parse(stdout);
    const stream = parsed.streams?.[0];

    if (!stream?.width || !stream?.height) {
        throw new Error("Unable to read video dimensions");
    }

    return {
        width: stream.width,
        height: stream.height,
    };
};
