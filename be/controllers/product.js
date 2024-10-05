import Product from "../models/product";

export const getProducts = async (req, res) => {
    try {
        const products = await Product.find();
        return res.status(200).json(products);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};
export const createProduct = async (req, res) => {
    try {
        // Tạo sản phẩm mới với dữ liệu từ request body
        const product = await Product.create(req.body);
        // Trả về phản hồi thành công với mã trạng thái 201 và dữ liệu sản phẩm mới
        res.status(201).json(product);
    } catch (error) {
        // Xử lý lỗi và trả về phản hồi lỗi với mã trạng thái 400
        res.status(400).json({ message: error.message });
    }
};

// Lấy giá trị form
// axios.post(`API/products`, { name: "Dat"})
// req.body : { name: "Dat"}

// axios.get(`API/product/:id`)
// req.params: { id: 10}

// axios.get(`API/products?page=10&limit=20`)
// req.query = { page: 10, limit: 20}
