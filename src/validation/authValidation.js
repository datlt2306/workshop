import Joi from "joi"

// Schema đăng ký tài khoản
export const signupSchema = Joi.object({
  name: Joi.string().required().messages({
    "string.base": "Tên phải là chuỗi",
    "string.empty": "Tên không được để trống",
    "any.required": "Tên là bắt buộc",
  }),
  email: Joi.string().email().required().messages({
    "string.base": "Email phải là chuỗi",
    "string.empty": "Email không được để trống",
    "string.email": "Email không hợp lệ",
    "any.required": "Email là bắt buộc",
  }),
  password: Joi.string().min(6).required().messages({
    "string.base": "Mật khẩu phải là chuỗi",
    "string.empty": "Mật khẩu không được để trống",
    "string.min": "Mật khẩu phải có ít nhất {#limit} ký tự",
    "any.required": "Mật khẩu là bắt buộc",
  }),
  phone: Joi.string()
    .pattern(/^\d{10}$/)
    .messages({
      "string.base": "Số điện thoại phải là chuỗi",
      "string.pattern.base": "Số điện thoại phải có 10 chữ số",
    }),
})

// Schema đăng nhập
export const loginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.base": "Email phải là chuỗi",
    "string.empty": "Email không được để trống",
    "string.email": "Email không hợp lệ",
    "any.required": "Email là bắt buộc",
  }),
  password: Joi.string().required().messages({
    "string.base": "Mật khẩu phải là chuỗi",
    "string.empty": "Mật khẩu không được để trống",
    "any.required": "Mật khẩu là bắt buộc",
  }),
})

// Schema cập nhật mật khẩu
export const updatePasswordSchema = Joi.object({
  passwordCurrent: Joi.string().required().messages({
    "string.base": "Mật khẩu hiện tại phải là chuỗi",
    "string.empty": "Mật khẩu hiện tại không được để trống",
    "any.required": "Mật khẩu hiện tại là bắt buộc",
  }),
  password: Joi.string().min(6).required().messages({
    "string.base": "Mật khẩu mới phải là chuỗi",
    "string.empty": "Mật khẩu mới không được để trống",
    "string.min": "Mật khẩu mới phải có ít nhất {#limit} ký tự",
    "any.required": "Mật khẩu mới là bắt buộc",
  }),
  passwordConfirm: Joi.any().valid(Joi.ref("password")).required().messages({
    "any.only": "Xác nhận mật khẩu phải trùng với mật khẩu mới",
    "any.required": "Xác nhận mật khẩu là bắt buộc",
  }),
})

