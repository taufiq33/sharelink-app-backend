import multer from "multer";
import { ImageUploadError } from "../utils/error.js";
import {
  ALLOWED_IMAGE_TYPE,
  MAX_FILE_IMAGE_SIZE,
  PHOTO_PROFILE_DIR,
} from "../config/app_config.js";

export function imageUploadMiddleware(fieldFileName) {
  const storage = multer.diskStorage({
    destination: PHOTO_PROFILE_DIR,
    filename: (request, file, callback) => {
      const extension = file.originalname.split(".").pop();
      callback(null, `${Date.now()}-${crypto.randomUUID()}.${extension}`);
    },
  });

  const upload = multer({
    storage: storage,
    limits: { fileSize: MAX_FILE_IMAGE_SIZE },
    fileFilter: (request, file, callback) => {
      if (!ALLOWED_IMAGE_TYPE.includes(file.mimetype)) {
        return callback(
          new ImageUploadError(
            "invalid image file. make sure your file is png/jpeg/jpg/webp."
          ),
          false
        );
      }
      return callback(null, true);
    },
  }).single(fieldFileName);

  return (request, response, next) => {
    upload(request, response, (error) => {
      console.log(PHOTO_PROFILE_DIR);
      if (error) {
        if (error.code === "LIMIT_FILE_SIZE") {
          return next(
            new ImageUploadError("invalid image file. max image size is 3MB.")
          );
        }
        return next(error);
      }
      return next();
    });
  };
}
