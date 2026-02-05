"use server";

import fs from "fs/promises";
import path from "path";
import { nanoid } from "nanoid";

type UploadOptions = {
  maxSize?: number;
  allowedTypes?: string[];
  folder?: string;
};

export async function uploadImage(
  file: File,
  slug: string,
  options?: UploadOptions
): Promise<{imgPath:string|null,imgErr:string|null}> {
  if (!file || file.size === 0) {
     return { imgPath: null, imgErr: "choose an image" };
  }

  const MAX_SIZE = options?.maxSize ?? 2 * 1024 * 1024;
  const ALLOWED_TYPES =
    options?.allowedTypes ?? ["image/jpeg","image/png", "image/webp"];
  const FOLDER =
    // options?.folder ?? "public/uploads/others";
    (options?.folder) ?"/public/uploads/"+options?.folder :"/public/uploads/others" ;

  if (!ALLOWED_TYPES.includes(file.type)) {
    // throw new Error("Invalid file type");
    return { imgPath: null, imgErr: "Invalid image format" };
  }

  if (file.size > MAX_SIZE) {
    // throw new Error("File too large");
     return { imgPath: null, imgErr:"File too large"};
  }

  const ext = path.extname(file.name);
  const filename = `${slug}-${nanoid(6)}${ext}`;

  const uploadDir = path.join(process.cwd(), FOLDER);
  await fs.mkdir(uploadDir, { recursive: true });

  const buffer = Buffer.from(await file.arrayBuffer());

  await fs.writeFile(path.join(uploadDir, filename), buffer);

  return {imgPath:filename,imgErr:null};
}
