import { Product, ProductVariant, Category } from "../models";
import { AppError } from "../utils/appError";
import { asyncHandler } from "../utils/asyncHandler";
import { APIFeatures } from "../utils/apiFeatures";
import { StatusCodes } from "http-status-codes";

// Lấy tất cả sản phẩm
export const getAllProducts = asyncHandler(async (req, res) => {
    const features = new APIFeatures(Product, req.query)
        .filter()
        .sort()
        .limitFields()
        .search()
        .populate();

    const result = await features.execute();

    res.status(StatusCodes.OK).json({
        results: result.data.length,
        total: result.total,
        page: result.page,
        totalPages: result.totalPages,
        limit: result.limit,
        data: result.data,
    });
});

// Lấy chi tiết sản phẩm
export const getProductById = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const product = await Product.findById(id)
        .populate("category", "name")
        .populate("defaultVariant");

    if (!product) {
        throw new AppError("Không tìm thấy sản phẩm", StatusCodes.NOT_FOUND);
    }

    // Nếu là sản phẩm biến thể, lấy tất cả các biến thể
    if (product.isVariant) {
        await product.populate("variants");
    }

    return res.status(StatusCodes.OK).json({
        status: "success",
        data: product,
    });
});

// Lấy sản phẩm theo slug
export const getProductBySlug = asyncHandler(async (req, res) => {
    const { slug } = req.params;

    const product = await Product.findOne({ slug })
        .populate("category", "name")
        .populate("defaultVariant");

    if (!product) {
        throw new AppError("Không tìm thấy sản phẩm", StatusCodes.NOT_FOUND);
    }

    // Nếu là sản phẩm biến thể, lấy tất cả các biến thể
    if (product.isVariant) {
        await product.populate("variants");
    }

    return res.status(StatusCodes.OK).json({
        status: "success",
        data: product,
    });
});

// Tạo sản phẩm mới
export const createProduct = asyncHandler(async (req, res) => {
    const {
        name,
        description,
        price,
        discountPrice,
        category,
        stock,
        sku,
        images,
        status,
        featured,
        isVariant,
        attributes,
    } = req.body;

    // Kiểm tra danh mục tồn tại
    const existingCategory = await Category.findById(category);
    if (!existingCategory) {
        throw new AppError("Danh mục không tồn tại", StatusCodes.BAD_REQUEST);
    }

    // Kiểm tra SKU đã tồn tại chưa
    const existingSku = await Product.findOne({ sku });
    if (existingSku) {
        throw new AppError("SKU đã tồn tại", StatusCodes.BAD_REQUEST);
    }

    // Tạo sản phẩm mới
    const product = await Product.create({
        name,
        description,
        price,
        discountPrice,
        category,
        stock: isVariant ? 0 : stock, // Nếu là sản phẩm biến thể, stock sẽ được tính từ các biến thể
        sku,
        images: images || [],
        status: status || "draft",
        featured: featured || false,
        isVariant: isVariant || false,
        attributes: isVariant ? attributes : [],
        createdBy: req.user._id,
    });

    // Nếu là sản phẩm biến thể, tạo các biến thể
    if (isVariant && attributes && attributes.length > 0) {
        await Product.generateVariants(product._id, attributes);

        // Lấy lại sản phẩm với các biến thể
        await product.populate("variants");
        await product.populate("defaultVariant");
    }

    return res.status(StatusCodes.CREATED).json({
        status: "success",
        data: product,
    });
});

// Cập nhật sản phẩm
// Cập nhật sản phẩm
export const updateProduct = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { name, description, price, discountPrice, category, stock, images, status, featured } =
        req.body;

    const product = await Product.findById(id);
    if (!product) {
        throw new AppError("Không tìm thấy sản phẩm", StatusCodes.NOT_FOUND);
    }

    // Lưu giá cũ để so sánh sau này
    const previousPrice = product.price;

    // Cập nhật thông tin sản phẩm
    if (name) product.name = name;
    if (description) product.description = description;
    if (price) {
        if (price < 0) {
            throw new AppError("Giá sản phẩm không được âm", StatusCodes.BAD_REQUEST);
        }
        product.price = price;
    }
    if (discountPrice !== undefined) {
        if (discountPrice < 0) {
            throw new AppError("Giá khuyến mãi không được âm", StatusCodes.BAD_REQUEST);
        }
        product.discountPrice = discountPrice;
    }
    if (category) {
        // Kiểm tra danh mục tồn tại
        const existingCategory = await Category.findById(category);
        if (!existingCategory) {
            throw new AppError("Danh mục không tồn tại", StatusCodes.BAD_REQUEST);
        }
        product.category = category;
    }
    if (stock !== undefined && !product.isVariant) {
        if (stock < 0) {
            throw new AppError("Số lượng tồn kho không được âm", StatusCodes.BAD_REQUEST);
        }
        product.stock = stock;
    }
    if (images) product.images = images;
    if (status) product.status = status;
    if (featured !== undefined) product.featured = featured;

    await product.save();

    // Nếu là sản phẩm biến thể, lấy tất cả các biến thể
    if (product.isVariant) {
        await product.populate("variants");
        await product.populate("defaultVariant");

        // Nếu giá sản phẩm chính thay đổi, cập nhật giá cho các biến thể chưa có giá riêng
        if (price && price !== previousPrice) {
            await ProductVariant.updateMany(
                {
                    product: product._id,
                    price: previousPrice, // Chỉ cập nhật các biến thể có giá bằng giá cũ
                },
                { price: price }
            );
        }
    }

    return res.status(StatusCodes.OK).json({
        status: "success",
        data: product,
    });
});

// Xóa sản phẩm
export const deleteProduct = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const product = await Product.findById(id);
    if (!product) {
        throw new AppError("Không tìm thấy sản phẩm", StatusCodes.NOT_FOUND);
    }

    // Nếu là sản phẩm biến thể, xóa tất cả các biến thể
    if (product.isVariant) {
        await ProductVariant.deleteMany({ product: product._id });
    }

    await product.deleteOne();

    return res.status(StatusCodes.NO_CONTENT).json({
        status: "success",
        data: null,
    });
});

// === CÁC PHƯƠNG THỨC CHO BIẾN THỂ SẢN PHẨM ===

// Lấy tất cả biến thể của sản phẩm
export const getProductVariants = asyncHandler(async (req, res) => {
    const { productId } = req.params;

    const product = await Product.findById(productId);
    if (!product) {
        throw new AppError("Không tìm thấy sản phẩm", StatusCodes.NOT_FOUND);
    }

    if (!product.isVariant) {
        throw new AppError("Sản phẩm này không phải là sản phẩm biến thể", StatusCodes.BAD_REQUEST);
    }

    const variants = await ProductVariant.find({ product: productId });

    return res.status(StatusCodes.OK).json({
        status: "success",
        results: variants.length,
        data: variants,
    });
});

// Lấy chi tiết biến thể
export const getVariantById = asyncHandler(async (req, res) => {
    const { variantId } = req.params;

    const variant = await ProductVariant.findById(variantId).populate("product", "name slug");

    if (!variant) {
        throw new AppError("Không tìm thấy biến thể", StatusCodes.NOT_FOUND);
    }

    return res.status(StatusCodes.OK).json({
        status: "success",
        data: variant,
    });
});

// Tạo biến thể mới
export const createVariant = asyncHandler(async (req, res) => {
    const { productId } = req.params;
    const { attributeValues, sku, price, discountPrice, stock, images, status } = req.body;

    const product = await Product.findById(productId);
    if (!product) {
        throw new AppError("Không tìm thấy sản phẩm", StatusCodes.NOT_FOUND);
    }

    if (!product.isVariant) {
        throw new AppError("Sản phẩm này không phải là sản phẩm biến thể", StatusCodes.BAD_REQUEST);
    }

    // Kiểm tra SKU đã tồn tại chưa
    const existingSku = await ProductVariant.findOne({ sku });
    if (existingSku) {
        throw new AppError("SKU đã tồn tại", StatusCodes.BAD_REQUEST);
    }

    // Kiểm tra các giá trị thuộc tính có hợp lệ không
    if (!attributeValues || !Array.isArray(attributeValues)) {
        throw new AppError("Giá trị thuộc tính không hợp lệ", StatusCodes.BAD_REQUEST);
    }

    // Kiểm tra xem tất cả các thuộc tính của sản phẩm đã được cung cấp chưa
    const productAttributes = product.attributes || [];
    const providedAttributes = attributeValues.map((av) => av.name);

    for (const attr of productAttributes) {
        if (!providedAttributes.includes(attr.name)) {
            throw new AppError(
                `Thiếu giá trị cho thuộc tính ${attr.name}`,
                StatusCodes.BAD_REQUEST
            );
        }
    }

    // Kiểm tra xem kết hợp thuộc tính đã tồn tại chưa
    const existingVariant = await ProductVariant.findOne({
        product: productId,
        attributeValues: {
            $all: attributeValues.map((av) => ({
                $elemMatch: { name: av.name, value: av.value },
            })),
        },
    });

    if (existingVariant) {
        throw new AppError(
            "Biến thể với kết hợp thuộc tính này đã tồn tại",
            StatusCodes.BAD_REQUEST
        );
    }

    // Tạo biến thể mới
    const variant = await ProductVariant.create({
        product: productId,
        attributeValues,
        sku,
        price: price || product.price,
        discountPrice,
        stock: stock || 0,
        images: images || [],
        status: status || "active",
    });

    // Cập nhật tổng số lượng tồn kho của sản phẩm
    await updateProductStock(productId);

    // Nếu chưa có biến thể mặc định, đặt biến thể này làm mặc định
    if (!product.defaultVariant) {
        product.defaultVariant = variant._id;
        await product.save();
    }

    return res.status(StatusCodes.CREATED).json({
        status: "success",
        data: variant,
    });
});

// Cập nhật biến thể
export const updateVariant = asyncHandler(async (req, res) => {
    const { variantId } = req.params;
    const { sku, price, discountPrice, stock, images, status } = req.body;

    const variant = await ProductVariant.findById(variantId);
    if (!variant) {
        throw new AppError("Không tìm thấy biến thể", StatusCodes.NOT_FOUND);
    }

    // Kiểm tra SKU đã tồn tại chưa (nếu thay đổi)
    if (sku && sku !== variant.sku) {
        const existingSku = await ProductVariant.findOne({ sku, _id: { $ne: variantId } });
        if (existingSku) {
            throw new AppError("SKU đã tồn tại", StatusCodes.BAD_REQUEST);
        }
        variant.sku = sku;
    }

    // Cập nhật thông tin biến thể
    if (price) variant.price = price;
    if (discountPrice !== undefined) variant.discountPrice = discountPrice;
    if (stock !== undefined) variant.stock = stock;
    if (images) variant.images = images;
    if (status) variant.status = status;

    await variant.save();

    // Cập nhật tổng số lượng tồn kho của sản phẩm
    await updateProductStock(variant.product);

    return res.status(StatusCodes.OK).json({
        status: "success",
        data: variant,
    });
});

// Xóa biến thể
export const deleteVariant = asyncHandler(async (req, res) => {
    const { variantId } = req.params;

    const variant = await ProductVariant.findById(variantId);
    if (!variant) {
        throw new AppError("Không tìm thấy biến thể", StatusCodes.NOT_FOUND);
    }

    const productId = variant.product;

    // Kiểm tra xem đây có phải là biến thể mặc định không
    const product = await Product.findById(productId);
    if (product.defaultVariant && product.defaultVariant.toString() === variantId) {
        // Tìm biến thể khác để đặt làm mặc định
        const otherVariant = await ProductVariant.findOne({
            product: productId,
            _id: { $ne: variantId },
        });

        if (otherVariant) {
            product.defaultVariant = otherVariant._id;
        } else {
            product.defaultVariant = undefined;
        }

        await product.save();
    }

    await variant.deleteOne();

    // Cập nhật tổng số lượng tồn kho của sản phẩm
    await updateProductStock(productId);

    return res.status(StatusCodes.NO_CONTENT).json({
        status: "success",
        data: null,
    });
});

// Đặt biến thể mặc định
export const setDefaultVariant = asyncHandler(async (req, res) => {
    const { productId, variantId } = req.params;

    const product = await Product.findById(productId);
    if (!product) {
        throw new AppError("Không tìm thấy sản phẩm", StatusCodes.NOT_FOUND);
    }

    if (!product.isVariant) {
        throw new AppError("Sản phẩm này không phải là sản phẩm biến thể", StatusCodes.BAD_REQUEST);
    }

    const variant = await ProductVariant.findOne({
        _id: variantId,
        product: productId,
    });

    if (!variant) {
        throw new AppError("Không tìm thấy biến thể", StatusCodes.NOT_FOUND);
    }

    product.defaultVariant = variantId;
    await product.save();

    return res.status(StatusCodes.OK).json({
        status: "success",
        data: { defaultVariant: variantId },
    });
});

// Hàm trợ giúp để cập nhật tổng số lượng tồn kho của sản phẩm
async function updateProductStock(productId) {
    const variants = await ProductVariant.find({ product: productId });
    const totalStock = variants.reduce((sum, variant) => sum + variant.stock, 0);

    await Product.findByIdAndUpdate(productId, { stock: totalStock });
}
