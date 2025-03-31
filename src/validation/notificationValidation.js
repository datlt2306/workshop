import Joi from "joi"

// Schema tạo thông báo mới
export const createNotificationSchema = Joi.object({
  userId: Joi.string().required().messages({
    "string.base": "ID người dùng phải là chuỗi",
    "string.empty": "ID người dùng không được để trống",
    "any.required": "ID người dùng là bắt buộc",
  }),
  title: Joi.string().required().max(200).messages({
    "string.base": "Tiêu đề thông báo phải là chuỗi",
    "string.empty": "Tiêu đề thông báo không được để trống",
    "string.max": "Tiêu đề thông báo không được vượt quá {#limit} ký tự",
    "any.required": "Tiêu đề thông báo là bắt buộc",
  }),
  content: Joi.string().required().messages({
    "string.base": "Nội dung thông báo phải là chuỗi",
    "string.empty": "Nội dung thông báo không được để trống",
    "any.required": "Nội dung thông báo là bắt buộc",
  }),
  type: Joi.string().valid("system", "order", "product", "promotion", "other").default("system").messages({
    "string.base": "Loại thông báo phải là chuỗi",
    "any.only": "Loại thông báo phải là một trong các giá trị: system, order, product, promotion, other",
  }),
  relatedId: Joi.string().allow("").messages({
    "string.base": "ID liên quan phải là chuỗi",
  }),
  isRead: Joi.boolean().default(false).messages({
    "boolean.base": "isRead phải là boolean",
  }),
  image: Joi.string().allow("").messages({
    "string.base": "Đường dẫn hình ảnh phải là chuỗi",
  }),
  link: Joi.string().allow("").messages({
    "string.base": "Đường dẫn liên kết phải là chuỗi",
  }),
})

// Schema cập nhật thông báo
export const updateNotificationSchema = Joi.object({
  title: Joi.string().max(200).messages({
    "string.base": "Tiêu đề thông báo phải là chuỗi",
    "string.empty": "Tiêu đề thông báo không được để trống",
    "string.max": "Tiêu đề thông báo không được vượt quá {#limit} ký tự",
  }),
  content: Joi.string().messages({
    "string.base": "Nội dung thông báo phải là chuỗi",
    "string.empty": "Nội dung thông báo không được để trống",
  }),
  type: Joi.string().valid("system", "order", "product", "promotion", "other").messages({
    "string.base": "Loại thông báo phải là chuỗi",
    "any.only": "Loại thông báo phải là một trong các giá trị: system, order, product, promotion, other",
  }),
  relatedId: Joi.string().allow("").messages({
    "string.base": "ID liên quan phải là chuỗi",
  }),
  isRead: Joi.boolean().messages({
    "boolean.base": "isRead phải là boolean",
  }),
  image: Joi.string().allow("").messages({
    "string.base": "Đường dẫn hình ảnh phải là chuỗi",
  }),
  link: Joi.string().allow("").messages({
    "string.base": "Đường dẫn liên kết phải là chuỗi",
  }),
})
  .min(1)
  .messages({
    "object.min": "Phải có ít nhất một trường cần cập nhật",
  })

// Schema đánh dấu đã đọc thông báo
export const markAsReadSchema = Joi.object({
  isRead: Joi.boolean().required().valid(true).messages({
    "boolean.base": "isRead phải là boolean",
    "any.only": "isRead phải có giá trị true",
    "any.required": "isRead là bắt buộc",
  }),
})

// Schema gửi thông báo cho nhiều người dùng
export const sendBulkNotificationSchema = Joi.object({
  userIds: Joi.array().items(Joi.string()).min(1).required().messages({
    "array.base": "Danh sách người dùng phải là mảng",
    "array.min": "Phải có ít nhất một người dùng",
    "any.required": "Danh sách người dùng là bắt buộc",
  }),
  title: Joi.string().required().max(200).messages({
    "string.base": "Tiêu đề thông báo phải là chuỗi",
    "string.empty": "Tiêu đề thông báo không được để trống",
    "string.max": "Tiêu đề thông báo không được vượt quá {#limit} ký tự",
    "any.required": "Tiêu đề thông báo là bắt buộc",
  }),
  content: Joi.string().required().messages({
    "string.base": "Nội dung thông báo phải là chuỗi",
    "string.empty": "Nội dung thông báo không được để trống",
    "any.required": "Nội dung thông báo là bắt buộc",
  }),
  type: Joi.string().valid("system", "order", "product", "promotion", "other").default("system").messages({
    "string.base": "Loại thông báo phải là chuỗi",
    "any.only": "Loại thông báo phải là một trong các giá trị: system, order, product, promotion, other",
  }),
  relatedId: Joi.string().allow("").messages({
    "string.base": "ID liên quan phải là chuỗi",
  }),
  image: Joi.string().allow("").messages({
    "string.base": "Đường dẫn hình ảnh phải là chuỗi",
  }),
  link: Joi.string().allow("").messages({
    "string.base": "Đường dẫn liên kết phải là chuỗi",
  }),
})

