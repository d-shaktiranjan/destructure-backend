import sharp from "sharp";

export const compressImage = async (
    inputPath: string,
    outputPath: string,
    width: number = 1200,
): Promise<void> => {
    await sharp(inputPath)
        .resize({
            width,
            withoutEnlargement: true,
        })
        .webp({
            quality: 85,
            effort: 3,
        })
        .toFile(outputPath);
};
