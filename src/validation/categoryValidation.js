import Joi from "joi"

// Schema xác thực danh mục
export const categorySchema = Joi.object({
  name: Joi.string().required().max(100).messages({
    "string.base": "Tên danh mục phải là chuỗi",
    "string.empty": "Tên danh mục không được để trống",
    "string.max": "Tên danh mục không được vượt quá {#limit} ký tự",
    "any.required": "Tên danh mục là bắt buộc",
  }),
  description: Joi.string().allow("").messages({
    "string.base": "Mô tả danh mục phải là chuỗi",
  }),
  parent: Joi.string().allow(null, "").messages({
    "string.base": "ID danh mục cha phải là chuỗi",
  }),
  image: Joi.string().allow("").messages({
    "string.base": "Đường dẫn hình ảnh phải là chuỗi",
  }),
  isFeatured: Joi.boolean().messages({
    "boolean.base": "isFeatured phải là boolean",
  }),
  order: Joi.number().integer().min(0).messages({
    "number.base": "Thứ tự hiển thị phải là số",
    "number.integer": "Thứ tự hiển thị phải là số nguyên",
    "number.min": "Thứ tự hiển thị không được âm",
  }),
  slug: Joi.string().allow("").messages({
    "string.base": "Slug phải là chuỗi",
  }),
  seoTitle: Joi.string().allow("").messages({
    "string.base": "SEO Title phải là chuỗi",
  }),
  seoDescription: Joi.string().allow("").messages({
    "string.base": "SEO Description phải là chuỗi",
  }),
  seoKeywords: Joi.array().items(Joi.string()).messages({
    "array.base": "SEO Keywords phải là mảng các chuỗi",
  }),
  isActive: Joi.boolean().messages({
    "boolean.base": "isActive phải là boolean",
  }),
})

