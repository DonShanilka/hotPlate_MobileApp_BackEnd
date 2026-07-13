import { Request } from "express";
import { UploadedFile } from "express-fileupload";

export function extractVideo(req: Request) {
  const video = req.files?.video as UploadedFile;
  return video ? video.data : Buffer.alloc(0);
}
