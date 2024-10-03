import Product from "../models/product";

export const getProducts = async (req, res) => {
    try {
        const products = await Product.find();
        return res.status(200).json(products);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};
export const addProduct = async (req, res) => {
    try {
        const product = await Product.create(req.body);
        return res.status(201).json(product);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// Lấy giá trị form
// axios.post(`API/products`, { name: "Dat"})
// req.body : { name: "Dat"}

// axios.get(`API/product/:id`)
// req.params: { id: 10}

// axios.get(`API/products?page=10&limit=20`)
// req.query = { page: 10, limit: 20}
