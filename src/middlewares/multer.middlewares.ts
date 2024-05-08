import multer, { diskStorage } from "multer";
import { mkdirSync, existsSync } from "fs";

const storage = diskStorage({
    destination: (req, file, cb) => {
        const path = "./public/images";
        if (!existsSync(path)) mkdirSync(path);
        cb(null, path);
    },
    filename: (req, file, cb) => {
        // Get extension, handling no extension case
        const fileExtension = file.originalname.split(".").pop() || "";
        const filenameWithoutExtension = file.originalname
            .toLowerCase()
            .replace(/\s+/g, "-") // Sanitize filename and handle spaces
            .split(".")[0];
        cb(
            null,
            `${filenameWithoutExtension}${Date.now()}${Math.ceil(Math.random() * 1e5)}.${fileExtension}`,
        );
    },
});

export const upload = multer({
    storage,
    limits: {
        fileSize: 1 * 1000 * 1000, // 1 MB file size limit
    },
});
