import Joi from "joi"

// Schema tạo sản phẩm mới
export const createProductSchema = Joi.object({
  name: Joi.string().required().max(200).messages({
    "string.base": "Tên sản phẩm phải là chuỗi",
    "string.empty": "Tên sản phẩm không được để trống",
    "string.max": "Tên sản phẩm không được vượt quá {#limit} ký tự",
    "any.required": "Tên sản phẩm là bắt buộc",
  }),
  description: Joi.string().required().messages({
    "string.base": "Mô tả sản phẩm phải là chuỗi",
    "string.empty": "Mô tả sản phẩm không được để trống",
    "any.required": "Mô tả sản phẩm là bắt buộc",
  }),
  price: Joi.number().required().min(0).messages({
    "number.base": "Giá sản phẩm phải là số",
    "number.min": "Giá sản phẩm không được âm",
    "any.required": "Giá sản phẩm là bắt buộc",
  }),
  priceDiscount: Joi.number().min(0).less(Joi.ref("price")).messages({
    "number.base": "Giá khuyến mãi phải là số",
    "number.min": "Giá khuyến mãi không được âm",
    "number.less": "Giá khuyến mãi phải nhỏ hơn giá gốc",
  }),
  category: Joi.string().required().messages({
    "string.base": "ID danh mục phải là chuỗi",
    "string.empty": "ID danh mục không được để trống",
    "any.required": "Danh mục sản phẩm là bắt buộc",
  }),
  brand: Joi.string().allow("").messages({
    "string.base": "Thương hiệu phải là chuỗi",
  }),
  tags: Joi.array().items(Joi.string()).messages({
    "array.base": "Tags phải là mảng các chuỗi",
  }),
  isFeatured: Joi.boolean().messages({
    "boolean.base": "isFeatured phải là boolean",
  }),
  isActive: Joi.boolean().messages({
    "boolean.base": "isActive phải là boolean",
  }),
  attributes: Joi.array()
    .items(
      Joi.object({
        attribute: Joi.string().required().messages({
          "string.base": "ID thuộc tính phải là chuỗi",
          "string.empty": "ID thuộc tính không được để trống",
          "any.required": "ID thuộc tính là bắt buộc",
        }),
        value: Joi.string().required().messages({
          "string.base": "Giá trị thuộc tính phải là chuỗi",
          "string.empty": "Giá trị thuộc tính không được để trống",
          "any.required": "Giá trị thuộc tính là bắt buộc",
        }),
      }),
    )
    .messages({
      "array.base": "Attributes phải là mảng các đối tượng",
    }),
  hasVariants: Joi.boolean().messages({
    "boolean.base": "hasVariants phải là boolean",
  }),
  variants: Joi.when("hasVariants", {
    is: true,
    then: Joi.array()
      .min(1)
      .items(
        Joi.object({
          name: Joi.string().required().messages({
            "string.base": "Tên biến thể phải là chuỗi",
            "string.empty": "Tên biến thể không được để trống",
            "any.required": "Tên biến thể là bắt buộc",
          }),
          sku: Joi.string().required().messages({
            "string.base": "SKU biến thể phải là chuỗi",
            "string.empty": "SKU biến thể không được để trống",
            "any.required": "SKU biến thể là bắt buộc",
          }),
          price: Joi.number().required().min(0).messages({
            "number.base": "Giá biến thể phải là số",
            "number.min": "Giá biến thể không được âm",
            "any.required": "Giá biến thể là bắt buộc",
          }),
          priceDiscount: Joi.number().min(0).less(Joi.ref("price")).messages({
            "number.base": "Giá khuyến mãi biến thể phải là số",
            "number.min": "Giá khuyến mãi biến thể không được âm",
            "number.less": "Giá khuyến mãi biến thể phải nhỏ hơn giá gốc",
          }),
          stock: Joi.number().min(0).default(0).messages({
            "number.base": "Số lượng tồn kho biến thể phải là số",
            "number.min": "Số lượng tồn kho biến thể không được âm",
          }),
          attributes: Joi.array()
            .items(
              Joi.object({
                attribute: Joi.string().required().messages({
                  "string.base": "ID thuộc tính biến thể phải là chuỗi",
                  "string.empty": "ID thuộc tính biến thể không được để trống",
                  "any.required": "ID thuộc tính biến thể là bắt buộc",
                }),
                value: Joi.string().required().messages({
                  "string.base": "Giá trị thuộc tính biến thể phải là chuỗi",
                  "string.empty": "Giá trị thuộc tính biến thể không được để trống",
                  "any.required": "Giá trị thuộc tính biến thể là bắt buộc",
                }),
              }),
            )
            .min(1)
            .required()
            .messages({
              "array.base": "Thuộc tính biến thể phải là mảng các đối tượng",
              "array.min": "Phải có ít nhất một thuộc tính cho biến thể",
              "any.required": "Thuộc tính biến thể là bắt buộc",
            }),
        }),
      )
      .required()
      .messages({
        "array.base": "Variants phải là mảng các đối tượng",
        "array.min": "Phải có ít nhất một biến thể",
        "any.required": "Variants là bắt buộc khi sản phẩm có biến thể",
      }),
    // otherwise: Joi.valid(null, []).messages({
    //     "any.only": "Variants phải là null hoặc mảng rỗng khi sản phẩm không có biến thể",
    // }),
  }),
  sku: Joi.when("hasVariants", {
    is: false,
    then: Joi.string().required().messages({
      "string.base": "SKU phải là chuỗi",
      "string.empty": "SKU không được để trống",
      "any.required": "SKU là bắt buộc khi sản phẩm không có biến thể",
    }),
    // otherwise: Joi.valid(null, "").messages({
    //     "any.only": "SKU phải là null hoặc chuỗi rỗng khi sản phẩm có biến thể",
    // }),
  }),
  stock: Joi.when("hasVariants", {
    is: false,
    then: Joi.number().min(0).required().messages({
      "number.base": "Số lượng tồn kho phải là số",
      "number.min": "Số lượng tồn kho không được âm",
      "any.required": "Số lượng tồn kho là bắt buộc khi sản phẩm không có biến thể",
    }),
    // otherwise: Joi.valid(0).messages({
    //     "any.only": "Số lượng tồn kho phải là 0 khi sản phẩm có biến thể",
    // }),
  }),
  weight: Joi.number().min(0).messages({
    "number.base": "Trọng lượng phải là số",
    "number.min": "Trọng lượng không được âm",
  }),
  dimensions: Joi.object({
    length: Joi.number().min(0).messages({
      "number.base": "Chiều dài phải là số",
      "number.min": "Chiều dài không được âm",
    }),
    width: Joi.number().min(0).messages({
      "number.base": "Chiều rộng phải là số",
      "number.min": "Chiều rộng không được âm",
    }),
    height: Joi.number().min(0).messages({
      "number.base": "Chiều cao phải là số",
      "number.min": "Chiều cao không được âm",
    }),
  }).messages({
    "object.base": "Kích thước phải là đối tượng",
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
})

// Schema cập nhật sản phẩm
export const updateProductSchema = createProductSchema.fork(
  ["name", "description", "price", "category", "hasVariants", "variants", "sku", "stock"],
  (schema) => schema.optional(),
)

