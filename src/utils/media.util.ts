import { createHash } from "crypto";
import { readFileSync } from "fs";
import sharp from "sharp";

export const calculateFileHash = (filePath: string): string => {
    const fileBuffer = readFileSync(filePath);
    const hash = createHash("sha256").update(fileBuffer).digest("hex");
    return hash;
};

export const compressImage = async (
    inputPath: string,
    outputPath: string,
    width: number = 1200,
): Promise<{ width: number; height: number }> => {
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
