import multer from "multer";
import { v2 as cloudinary } from "cloudinary";

const storage = multer.memoryStorage();
const upload = multer({ storage, });

export default {
  single(fieldname: string) {
    return upload.single(fieldname);
  },
  multiple(fieldname: string) {
    return upload.array(fieldname);
  },
};
