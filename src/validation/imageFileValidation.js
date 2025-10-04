import fs from "fs/promises";
import { fileTypeFromFile } from "file-type";
import { ALLOWED_IMAGE_TYPE } from "../config/app_config.js";
import { ImageUploadError } from "../utils/error.js";

export async function imageFileValidation(request, response, next) {
  if (!request.file) return next();
  const mimetypeFile = await fileTypeFromFile(request.file.path);
  if (!mimetypeFile || !ALLOWED_IMAGE_TYPE.includes(mimetypeFile.mime)) {
    await fs.unlink(request.file.path);
    return next(
      new ImageUploadError(
        "invalid image file. are you sure this is valid image?"
      )
    );
  }
  return next();
}
