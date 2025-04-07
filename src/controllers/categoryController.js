import { Category } from "../models";
import { APIFeatures } from "../utils/apiFeatures";
import { AppError } from "../utils/appError";
import { asyncHandler } from "../utils/asyncHandler";
import { StatusCodes } from "http-status-codes";
// Lấy tất cả danh mục
export const getAllCategories = asyncHandler(async (req, res, next) => {
    const features = new APIFeatures(Category.find(), req.query)
        .filter()
        .sort()
        .limitFields()
        .paginate()
        .search()
        .populate();

    const categories = await features.query;
    const total = await Category.countDocuments(features.query._conditions);

    res.status(StatusCodes.OK).json({
        success: true,
        count: categories.length,
        total,
        data: categories,
    });
});

// Lấy danh mục theo ID
export const getCategory = asyncHandler(async (req, res, next) => {
    const category = await Category.findById(req.params.id).populate("parent").populate("children");

    if (!category) {
        return next(new AppError("Không tìm thấy danh mục với ID này", StatusCodes.NOT_FOUND));
    }

    res.status(StatusCodes.OK).json({
        success: true,
        data: category,
    });
});

// Tạo danh mục mới
export const createCategory = asyncHandler(async (req, res, next) => {
    const { name, description, parent, image, isFeatured, order } = req.body;

    // Tính toán level dựa trên danh mục cha
    let level = 1;

    if (parent) {
        const parentCategory = await Category.findById(parent);
        if (!parentCategory) {
            return next(new AppError("Danh mục cha không tồn tại", StatusCodes.NOT_FOUND));
        }

        level = parentCategory.level + 1;
    }

    // Tạo danh mục mới
    const newCategory = await Category.create({
        name,
        description,
        parent,
        level,
        image,
        isFeatured,
        order,
    });

    res.status(StatusCodes.CREATED).json({
        success: true,
        data: newCategory,
    });
});

// Cập nhật danh mục
export const updateCategory = asyncHandler(async (req, res, next) => {
    const { parent } = req.body;

    // Nếu parent được cập nhật, tính toán lại level
    if (parent !== undefined) {
        if (parent) {
            const parentCategory = await Category.findById(parent);
            if (!parentCategory) {
                return next(new AppError("Danh mục cha không tồn tại", StatusCodes.NOT_FOUND));
            }

            req.body.level = parentCategory.level + 1;
        } else {
            req.body.level = 1;
        }
    }

    // Cập nhật danh mục
    const category = await Category.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    });

    if (!category) {
        return next(new AppError("Không tìm thấy danh mục với ID này", StatusCodes.NOT_FOUND));
    }

    res.status(StatusCodes.OK).json({
        success: true,
        data: category,
    });
});

// Xóa danh mục
export const deleteCategory = asyncHandler(async (req, res, next) => {
    const category = await Category.findById(req.params.id);

    if (!category) {
        return next(new AppError("Không tìm thấy danh mục với ID này", StatusCodes.NOT_FOUND));
    }

    // Kiểm tra xem có danh mục con không
    const hasChildren = await Category.countDocuments({ parent: category._id });

    if (hasChildren > 0) {
        return next(
            new AppError("Không thể xóa danh mục có danh mục con", StatusCodes.BAD_REQUEST)
        );
    }

    // Xóa danh mục
    await category.deleteOne();

    res.status(204).json({
        success: true,
        data: null,
    });
});

// Lấy danh mục cấp cao nhất (không có parent)
export const getRootCategories = asyncHandler(async (req, res, next) => {
    const categories = await Category.find({ parent: null }).populate("children");

    res.status(StatusCodes.OK).json({
        success: true,
        count: categories.length,
        data: categories,
    });
});

// Lấy danh mục con
export const getSubcategories = asyncHandler(async (req, res, next) => {
    const parentId = req.params.id;

    const subcategories = await Category.find({ parent: parentId });

    res.status(StatusCodes.OK).json({
        success: true,
        count: subcategories.length,
        data: subcategories,
    });
});

// Lấy cấu trúc danh mục dạng cây
export const getCategoryTree = asyncHandler(async (req, res, next) => {
    // Lấy tất cả danh mục
    const allCategories = await Category.find().sort({ level: 1, order: 1 });

    // Xây dựng cây danh mục
    const categoryMap = {};
    const rootCategories = [];

    // Tạo map các danh mục theo ID
    allCategories.forEach((category) => {
        categoryMap[category._id] = {
            _id: category._id,
            name: category.name,
            slug: category.slug,
            level: category.level,
            image: category.image,
            isFeatured: category.isFeatured,
            order: category.order,
            children: [],
        };
    });

    // Xây dựng cấu trúc cây
    allCategories.forEach((category) => {
        if (category.parent) {
            // Nếu có parent, thêm vào children của parent
            if (categoryMap[category.parent]) {
                categoryMap[category.parent].children.push(categoryMap[category._id]);
            }
        } else {
            // Nếu không có parent, thêm vào rootCategories
            rootCategories.push(categoryMap[category._id]);
        }
    });

    res.status(StatusCodes.OK).json({
        success: true,
        data: rootCategories,
    });
});
