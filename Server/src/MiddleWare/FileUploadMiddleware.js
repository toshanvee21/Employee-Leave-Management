import multer from "multer";
import path from "path";

let imageStorage = multer.diskStorage({
    destination: (req, file, next) => {
        next(null, "Uploadimages")
    },
    filename: (req, file, next) => {
        next(null, `${Date.now()}${path.extname(file.originalname)}`)
    }
})

export const upload = multer({ storage: imageStorage })