import multer from "multer"
import path from "path"
import { AppError } from "../utils/appError"
import dotenv from "dotenv"
dotenv.config()
// Cấu hình storage cho multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/")
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9)
    const ext = path.extname(file.originalname)
    cb(null, file.fieldname + "-" + uniqueSuffix + ext)
  },
})

// Kiểm tra loại file
const fileFilter = (req, file, cb) => {
  // Chấp nhận các loại hình ảnh
  if (file.mimetype.startsWith("image")) {
    cb(null, true)
  } else {
    cb(new AppError("File không phải là hình ảnh! Vui lòng tải lên hình ảnh.", 400), false)
  }
}

// Cấu hình upload
export const upload = multer({
  storage: storage,
  limits: {
    fileSize: process.env.MAX_FILE_SIZE || 5000000, // 5MB
  },
  fileFilter: fileFilter,
})

// Middleware upload một hình ảnh
export const uploadSingle = (fieldName) => upload.single(fieldName)

// Middleware upload nhiều hình ảnh
export const uploadMultiple = (fieldName, maxCount) => upload.array(fieldName, maxCount)

// Middleware upload nhiều field
export const uploadFields = (fields) => upload.fields(fields)

