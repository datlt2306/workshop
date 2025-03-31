import Joi from "joi"

// Schema cập nhật thông tin người dùng
export const updateUserProfileSchema = Joi.object({
  name: Joi.string().max(100).messages({
    "string.base": "Tên phải là chuỗi",
    "string.empty": "Tên không được để trống",
    "string.max": "Tên không được vượt quá {#limit} ký tự",
  }),
  email: Joi.string().email().messages({
    "string.base": "Email phải là chuỗi",
    "string.empty": "Email không được để trống",
    "string.email": "Email không hợp lệ",
  }),
  phone: Joi.string()
    .pattern(/^\d{10}$/)
    .messages({
      "string.base": "Số điện thoại phải là chuỗi",
      "string.pattern.base": "Số điện thoại phải có 10 chữ số",
    }),
  avatar: Joi.string().allow("").messages({
    "string.base": "Đường dẫn ảnh đại diện phải là chuỗi",
  }),
  dateOfBirth: Joi.date().allow(null).messages({
    "date.base": "Ngày sinh phải là ngày hợp lệ",
  }),
  gender: Joi.string().valid("male", "female", "other").allow("").messages({
    "string.base": "Giới tính phải là chuỗi",
    "any.only": "Giới tính phải là một trong các giá trị: male, female, other",
  }),
})
  .min(1)
  .messages({
    "object.min": "Phải có ít nhất một trường cần cập nhật",
  })

// Schema tạo địa chỉ mới
export const addressSchema = Joi.object({
  fullName: Joi.string().required().max(100).messages({
    "string.base": "Họ tên phải là chuỗi",
    "string.empty": "Họ tên không được để trống",
    "string.max": "Họ tên không được vượt quá {#limit} ký tự",
    "any.required": "Họ tên là bắt buộc",
  }),
  phone: Joi.string()
    .pattern(/^\d{10}$/)
    .required()
    .messages({
      "string.base": "Số điện thoại phải là chuỗi",
      "string.pattern.base": "Số điện thoại phải có 10 chữ số",
      "any.required": "Số điện thoại là bắt buộc",
    }),
  province: Joi.string().required().messages({
    "string.base": "Tỉnh/thành phố phải là chuỗi",
    "string.empty": "Tỉnh/thành phố không được để trống",
    "any.required": "Tỉnh/thành phố là bắt buộc",
  }),
  district: Joi.string().required().messages({
    "string.base": "Quận/huyện phải là chuỗi",
    "string.empty": "Quận/huyện không được để trống",
    "any.required": "Quận/huyện là bắt buộc",
  }),
  ward: Joi.string().required().messages({
    "string.base": "Phường/xã phải là chuỗi",
    "string.empty": "Phường/xã không được để trống",
    "any.required": "Phường/xã là bắt buộc",
  }),
  streetAddress: Joi.string().required().messages({
    "string.base": "Địa chỉ cụ thể phải là chuỗi",
    "string.empty": "Địa chỉ cụ thể không được để trống",
    "any.required": "Địa chỉ cụ thể là bắt buộc",
  }),
  isDefault: Joi.boolean().messages({
    "boolean.base": "isDefault phải là boolean",
  }),
  addressType: Joi.string().valid("home", "office", "other").default("home").messages({
    "string.base": "Loại địa chỉ phải là chuỗi",
    "any.only": "Loại địa chỉ phải là một trong các giá trị: home, office, other",
  }),
})

// Schema cập nhật địa chỉ
export const updateAddressSchema = addressSchema
  .fork(["fullName", "phone", "province", "district", "ward", "streetAddress"], (schema) => schema.optional())
  .min(1)
  .messages({
    "object.min": "Phải có ít nhất một trường cần cập nhật",
  })

// Schema tạo người dùng bởi admin
export const createUserSchema = Joi.object({
  name: Joi.string().required().max(100).messages({
    "string.base": "Tên phải là chuỗi",
    "string.empty": "Tên không được để trống",
    "string.max": "Tên không được vượt quá {#limit} ký tự",
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
  role: Joi.string().valid("user", "admin").default("user").messages({
    "string.base": "Vai trò phải là chuỗi",
    "any.only": "Vai trò phải là một trong các giá trị: user, admin",
  }),
  emailVerified: Joi.boolean().default(false).messages({
    "boolean.base": "emailVerified phải là boolean",
  }),
  accountStatus: Joi.string().valid("active", "pending", "blocked").default("active").messages({
    "string.base": "Trạng thái tài khoản phải là chuỗi",
    "any.only": "Trạng thái tài khoản phải là một trong các giá trị: active, pending, blocked",
  }),
})

// Schema cập nhật người dùng bởi admin
export const updateUserSchema = Joi.object({
  name: Joi.string().max(100).messages({
    "string.base": "Tên phải là chuỗi",
    "string.empty": "Tên không được để trống",
    "string.max": "Tên không được vượt quá {#limit} ký tự",
  }),
  email: Joi.string().email().messages({
    "string.base": "Email phải là chuỗi",
    "string.empty": "Email không được để trống",
    "string.email": "Email không hợp lệ",
  }),
  phone: Joi.string()
    .pattern(/^\d{10}$/)
    .messages({
      "string.base": "Số điện thoại phải là chuỗi",
      "string.pattern.base": "Số điện thoại phải có 10 chữ số",
    }),
  role: Joi.string().valid("user", "admin").messages({
    "string.base": "Vai trò phải là chuỗi",
    "any.only": "Vai trò phải là một trong các giá trị: user, admin",
  }),
  emailVerified: Joi.boolean().messages({
    "boolean.base": "emailVerified phải là boolean",
  }),
  accountStatus: Joi.string().valid("active", "pending", "blocked").messages({
    "string.base": "Trạng thái tài khoản phải là chuỗi",
    "any.only": "Trạng thái tài khoản phải là một trong các giá trị: active, pending, blocked",
  }),
})
  .min(1)
  .messages({
    "object.min": "Phải có ít nhất một trường cần cập nhật",
  })

