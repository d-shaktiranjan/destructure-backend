import { exec } from "child_process";
import { createHash } from "crypto";
import { readFileSync } from "fs";
import { unlink } from "fs/promises";
import sharp from "sharp";
import { promisify } from "util";

import { MediaDocument } from "@/libs/Documents.lib";

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
    if (inputPath === outputPath) {
        const image = await sharp(inputPath).metadata();
        return {
            width: image.width,
            height: image.height,
        };
    }

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

    // delete original file
    unlink(inputPath);

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

export const createUrlFromRecord = (
    host: string,
    record: MediaDocument,
): string => {
    // normalize path (remove leading "public/")
    const pathname = record.filePath.replace(/^public\//, "/");

    const url = new URL(pathname, host);

    if (record.width) {
        url.searchParams.set("width", String(record.width));
    }
    if (record.height) {
        url.searchParams.set("height", String(record.height));
    }
    if (record.blurDataURL) {
        url.searchParams.set("blurDataURL", record.blurDataURL);
    }

    return url.toString();
};
