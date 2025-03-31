import Joi from "joi"

// Schema tạo thuộc tính mới
export const attributeSchema = Joi.object({
  name: Joi.string().required().max(100).messages({
    "string.base": "Tên thuộc tính phải là chuỗi",
    "string.empty": "Tên thuộc tính không được để trống",
    "string.max": "Tên thuộc tính không được vượt quá {#limit} ký tự",
    "any.required": "Tên thuộc tính là bắt buộc",
  }),
  code: Joi.string().required().max(50).messages({
    "string.base": "Mã thuộc tính phải là chuỗi",
    "string.empty": "Mã thuộc tính không được để trống",
    "string.max": "Mã thuộc tính không được vượt quá {#limit} ký tự",
    "any.required": "Mã thuộc tính là bắt buộc",
  }),
  description: Joi.string().allow("").messages({
    "string.base": "Mô tả thuộc tính phải là chuỗi",
  }),
  values: Joi.array().items(Joi.string()).messages({
    "array.base": "Giá trị thuộc tính phải là mảng các chuỗi",
  }),
  type: Joi.string().valid("select", "checkbox", "radio", "color", "size").default("select").messages({
    "string.base": "Loại thuộc tính phải là chuỗi",
    "any.only": "Loại thuộc tính phải là một trong các giá trị: select, checkbox, radio, color, size",
  }),
  isRequired: Joi.boolean().messages({
    "boolean.base": "isRequired phải là boolean",
  }),
  isFilterable: Joi.boolean().messages({
    "boolean.base": "isFilterable phải là boolean",
  }),
  isActive: Joi.boolean().messages({
    "boolean.base": "isActive phải là boolean",
  }),
})

// Schema tạo giá trị thuộc tính mới
export const attributeValueSchema = Joi.object({
  value: Joi.string().required().max(100).messages({
    "string.base": "Giá trị thuộc tính phải là chuỗi",
    "string.empty": "Giá trị thuộc tính không được để trống",
    "string.max": "Giá trị thuộc tính không được vượt quá {#limit} ký tự",
    "any.required": "Giá trị thuộc tính là bắt buộc",
  }),
})

