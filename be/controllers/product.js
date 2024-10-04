import Product from "../models/product";
import Attribute from "../models/attribute";

export const createProduct = async (req, res) => {
    try {
        const { product_attributes } = req.body;

        const attributes = await Attribute.find({ _id: { $in: product_attributes } });
        if (attributes.length !== product_attributes.length) {
            return res.status(400).json({ message: "One or more attributes not found" });
        }

        const product = await Product.create(req.body);
        res.status(201).json(product);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const getProductById = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findById(id).populate("product_attributes");
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getProducts = async (req, res) => {
    try {
        const { _page = 1, _limit = 10 } = req.query;
        const options = {
            page: parseInt(_page, 10),
            limit: parseInt(_limit, 10),
        };
        const result = await Product.paginate({}, options);
        return res.status(200).json({
            products: result.docs,
            docs: undefined,
            ...result,
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};
