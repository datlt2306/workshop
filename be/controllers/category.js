import Category from "../models/category";

// Tạo một danh mục mới
export const createCategory = async (req, res) => {
    try {
        const category = new Category(req.body);
        await category.save();
        res.status(201).json(category);
    } catch (error) {
        if (error.code === 11000) {
            // Mã lỗi cho trùng lặp key
            res.status(400).json({ message: "Category title must be unique" });
        } else {
            res.status(400).json({ message: error.message });
        }
    }
};

// Lấy tất cả các danh mục với phân trang
export const getCategories = async (req, res) => {
    try {
        const { _page = 1, _limit = 10 } = req.query;
        const options = {
            page: parseInt(_page, 10),
            limit: parseInt(_limit, 10),
        };

        const result = await Category.paginate({}, options);
        res.status(200).json({
            categories: result.docs,
            totalPages: result.totalPages,
            currentPage: result.page,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Lấy chi tiết một danh mục theo ID
export const getCategoryById = async (req, res) => {
    try {
        const { id } = req.params;
        const category = await Category.findById(id);
        if (!category) {
            return res.status(404).json({ message: "Category not found" });
        }
        res.status(200).json(category);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Cập nhật một danh mục theo ID
export const updateCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const category = await Category.findByIdAndUpdate(id, req.body, { new: true });
        if (!category) {
            return res.status(404).json({ message: "Category not found" });
        }
        res.status(200).json(category);
    } catch (error) {
        if (error.code === 11000) {
            // Mã lỗi cho trùng lặp key
            res.status(400).json({ message: "Category title must be unique" });
        } else {
            res.status(400).json({ message: error.message });
        }
    }
};

// Xóa một danh mục theo ID
export const deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const category = await Category.findByIdAndDelete(id);
        if (!category) {
            return res.status(404).json({ message: "Category not found" });
        }
        res.status(200).json({ message: "Category deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
