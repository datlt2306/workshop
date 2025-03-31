import Joi from "joi"

// Schema thêm sản phẩm vào giỏ hàng
export const addToCartSchema = Joi.object({
  productId: Joi.string().required().messages({
    "string.base": "ID sản phẩm phải là chuỗi",
    "string.empty": "ID sản phẩm không được để trống",
    "any.required": "ID sản phẩm là bắt buộc",
  }),
  variantId: Joi.string().allow(null, "").messages({
    "string.base": "ID biến thể phải là chuỗi",
  }),
  quantity: Joi.number().integer().min(1).default(1).messages({
    "number.base": "Số lượng phải là số",
    "number.integer": "Số lượng phải là số nguyên",
    "number.min": "Số lượng phải từ 1 trở lên",
  }),
})

// Schema cập nhật số lượng sản phẩm trong giỏ hàng
export const updateCartItemSchema = Joi.object({
  quantity: Joi.number().integer().min(1).required().messages({
    "number.base": "Số lượng phải là số",
    "number.integer": "Số lượng phải là số nguyên",
    "number.min": "Số lượng phải từ 1 trở lên",
    "any.required": "Số lượng là bắt buộc",
  }),
})

