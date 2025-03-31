import mongoose from "mongoose"
import slugify from "slugify"
import mongoosePaginate from "mongoose-paginate-v2"

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Tên sản phẩm là bắt buộc"],
      trim: true,
      maxlength: [200, "Tên sản phẩm không được vượt quá 200 ký tự"],
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
    },
    description: {
      type: String,
      required: [true, "Mô tả sản phẩm là bắt buộc"],
    },
    price: {
      type: Number,
      required: [true, "Giá sản phẩm là bắt buộc"],
      min: [0, "Giá sản phẩm không được âm"],
    },
    discountPrice: {
      type: Number,
      min: [0, "Giá khuyến mãi không được âm"],
    },
    images: [String],
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "Danh mục sản phẩm là bắt buộc"],
    },
    stock: {
      type: Number,
      required: [true, "Số lượng tồn kho là bắt buộc"],
      min: [0, "Số lượng tồn kho không được âm"],
      default: 0,
    },
    sku: {
      type: String,
      required: [true, "SKU sản phẩm là bắt buộc"],
      unique: true,
      trim: true,
    },
    isVariant: {
      type: Boolean,
      default: false,
    },
    attributes: [
      {
        name: {
          type: String,
          required: true,
        },
        values: [String],
      },
    ],
    defaultVariant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ProductVariant",
    },
    status: {
      type: String,
      enum: ["draft", "published", "archived"],
      default: "draft",
    },
    featured: {
      type: Boolean,
      default: false,
    },
    ratings: {
      type: Number,
      default: 0,
      min: [0, "Đánh giá thấp nhất là 0"],
      max: [5, "Đánh giá cao nhất là 5"],
      set: (val) => Math.round(val * 10) / 10, // Làm tròn đến 1 chữ số thập phân
    },
    numReviews: {
      type: Number,
      default: 0,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
)

// Plugins
productSchema.plugin(mongoosePaginate)

// Tạo slug từ tên sản phẩm
productSchema.pre("save", function (next) {
  if (this.isModified("name")) {
    this.slug = slugify(this.name, { lower: true }) + "-" + Date.now().toString().slice(-4)
  }
  next()
})

// Virtual để lấy tất cả biến thể của sản phẩm
productSchema.virtual("variants", {
  ref: "ProductVariant",
  localField: "_id",
  foreignField: "product",
})

// Phương thức tĩnh để tạo biến thể cho sản phẩm
productSchema.statics.generateVariants = async function (productId, attributes) {
  const product = await this.findById(productId)
  if (!product) throw new Error("Không tìm thấy sản phẩm")

  // Cập nhật sản phẩm thành sản phẩm biến thể
  product.isVariant = true
  product.attributes = attributes
  await product.save()

  // Tạo tất cả các kết hợp có thể của các giá trị thuộc tính
  const combinations = generateAttributeCombinations(attributes)

  // Tạo biến thể cho mỗi kết hợp
  const ProductVariant = mongoose.model("ProductVariant")
  const variants = []

  for (const combination of combinations) {
    const variant = await ProductVariant.create({
      product: productId,
      attributeValues: combination,
      sku: `${product.sku}-${combination.map((av) => av.value.substring(0, 2).toUpperCase()).join("")}`,
      price: product.price,
      stock: 0,
    })
    variants.push(variant)
  }

  // Đặt biến thể đầu tiên làm biến thể mặc định
  if (variants.length > 0) {
    product.defaultVariant = variants[0]._id
    await product.save()
  }

  return variants
}

// Hàm trợ giúp để tạo tất cả các kết hợp có thể của các giá trị thuộc tính
function generateAttributeCombinations(attributes) {
  const result = []

  function generateCombinations(index, current) {
    if (index === attributes.length) {
      result.push([...current])
      return
    }

    const attribute = attributes[index]
    for (const value of attribute.values) {
      current.push({ name: attribute.name, value })
      generateCombinations(index + 1, current)
      current.pop()
    }
  }

  generateCombinations(0, [])
  return result
}

const Product = mongoose.model("Product", productSchema)

export { Product }

