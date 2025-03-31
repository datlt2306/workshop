import Joi from "joi"

// Schema for creating a new order
export const createOrderSchema = Joi.object({
  shippingAddress: Joi.object({
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
  })
    .required()
    .messages({
      "object.base": "Địa chỉ giao hàng phải là đối tượng",
      "any.required": "Địa chỉ giao hàng là bắt buộc",
    }),
  paymentMethod: Joi.string().valid("cod", "vnpay", "momo", "zalopay", "credit_card").required().messages({
    "string.base": "Phương thức thanh toán phải là chuỗi",
    "string.empty": "Phương thức thanh toán không được để trống",
    "any.only": "Phương thức thanh toán phải là một trong các giá trị: cod, vnpay, momo, zalopay, credit_card",
    "any.required": "Phương thức thanh toán là bắt buộc",
  }),
  note: Joi.string().allow("").messages({
    "string.base": "Ghi chú phải là chuỗi",
  }),
  couponCode: Joi.string().allow("").messages({
    "string.base": "Mã giảm giá phải là chuỗi",
  }),
})

// Schema for updating order status
export const updateOrderStatusSchema = Joi.object({
  status: Joi.string().valid("pending", "processing", "shipped", "delivered", "cancelled").required().messages({
    "string.base": "Trạng thái đơn hàng phải là chuỗi",
    "string.empty": "Trạng thái đơn hàng không được để trống",
    "any.only": "Trạng thái đơn hàng phải là một trong các giá trị: pending, processing, shipped, delivered, cancelled",
    "any.required": "Trạng thái đơn hàng là bắt buộc",
  }),
  note: Joi.string().allow("").messages({
    "string.base": "Ghi chú phải là chuỗi",
  }),
})

// Schema for cancelling an order
export const cancelOrderSchema = Joi.object({
  cancelReason: Joi.string().allow("").messages({
    "string.base": "Lý do hủy đơn hàng phải là chuỗi",
  }),
})

// Schema for payment success
export const paymentSuccessSchema = Joi.object({
  paymentIntentId: Joi.string().required().messages({
    "string.base": "ID giao dịch thanh toán phải là chuỗi",
    "string.empty": "ID giao dịch thanh toán không được để trống",
    "any.required": "ID giao dịch thanh toán là bắt buộc",
  }),
  paymentMethod: Joi.string().messages({
    "string.base": "Phương thức thanh toán phải là chuỗi",
  }),
})

// Schema for creating payment intent
export const createPaymentIntentSchema = Joi.object({
  paymentProcessor: Joi.string().valid("stripe", "vnpay", "momo", "zalopay").default("stripe").messages({
    "string.base": "Nhà cung cấp dịch vụ thanh toán phải là chuỗi",
    "any.only": "Nhà cung cấp dịch vụ thanh toán không được hỗ trợ",
  }),
  returnUrl: Joi.string().uri().messages({
    "string.base": "URL chuyển hướng phải là chuỗi",
    "string.uri": "URL chuyển hướng phải là URL hợp lệ",
  }),
})

