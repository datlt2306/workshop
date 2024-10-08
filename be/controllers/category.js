import Category from "../models/category";
import { StatusCodes } from "http-status-codes";

// Tạo một danh mục mới
export const createCategory = async (req, res) => {
    try {
        const category = new Category(req.body);
        await category.save();
        res.status(StatusCodes.CREATED).json(category);
    } catch (error) {
        if (error.code === 11000) {
            // Mã lỗi cho trùng lặp key
            res.status(StatusCodes.BAD_REQUEST).json({ message: "Category title must be unique" });
        } else {
            res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
        }
    }
};

// Lấy tất cả các danh mục với phân trang và quan hệ
export const getCategories = async (req, res) => {
    try {
        const { _page = 1, _limit = 10, _expand } = req.query;
        const options = {
            page: parseInt(_page, 10),
            limit: parseInt(_limit, 10),
        };

        const result = await Category.paginate({}, options);
        const { docs, ...paginationData } = result;

        if (_expand === "products") {
            const categoriesWithProducts = await Promise.all(
                docs.map(async (category) => {
                    const products = await Product.find({ category: category._id });
                    return { ...category.toObject(), products };
                })
            );
            return res.status(StatusCodes.OK).json({
                categories: categoriesWithProducts,
                ...paginationData,
            });
        }

        return res.status(StatusCodes.OK).json({
            categories: docs,
            ...paginationData,
        });
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: error.message });
    }
};
