import { StatusCodes } from "http-status-codes";
import Attribute from "../models/attribute";
import Product from "../models/product";
import { productSchema } from "../utils/validators/product";
import slugify from "slugify";
export const createProduct = async (req, res) => {
    try {
        // Xác thực dữ liệu đầu vào
        const { error, value } = productSchema.validate(req.body);
        if (error) {
            return res.status(StatusCodes.BAD_REQUEST).json({ message: error.details[0].message });
        }

        const { name } = value;

        // Kiểm tra xem sản phẩm với tên này đã tồn tại chưa
        const existingProduct = await Product.findOne({ name });
        if (existingProduct) {
            return res
                .status(StatusCodes.BAD_REQUEST)
                .json({ message: "Sản phẩm với tên này đã tồn tại" });
        }

        // const productAttributes = await Attribute.find({ _id: { $in: attributes } });
        // if (productAttributes.length !== attributes.length) {
        //     return res
        //         .status(StatusCodes.BAD_REQUEST)
        //         .json({ message: "Một hoặc nhiều thuộc tính không tìm thấy" });
        // }

        // Tạo slug từ tên sản phẩm
        const slug = slugify(name, { lower: true });

        const product = await Product.create({ ...value, slug });
        res.status(StatusCodes.CREATED).json(product);
    } catch (error) {
        res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
    }
};

export const getProductById = async (req, res) => {
    try {
        const { id } = req.params;
        const { _embed } = req.query;

        const product = await Product.findById(id).populate(_embed ? _embed.split(",") : []);
        if (!product) {
            return res.status(StatusCodes.NOT_FOUND).json({ message: "Sản phẩm không tồn tại" });
        }

        res.status(StatusCodes.OK).json(product);
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: error.message });
    }
};

export const getProducts = async (req, res) => {
    try {
        const { _page = 1, _limit = 10, _embed } = req.query;
        const options = {
            page: parseInt(_page, 10),
            limit: parseInt(_limit, 10),
        };

        let query = Product.find();

        if (_embed) {
            const embeds = _embed.split(",");
            embeds.forEach((embed) => {
                query = query.populate(embed);
            });
        }

        const result = await Product.paginate(query, options);
        const { docs, ...paginationData } = result; // Loại bỏ trường docs

        return res.status(StatusCodes.OK).json({
            products: docs,
            ...paginationData,
        });
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: error.message });
    }
};

// Cập nhật một sản phẩm theo ID
export const updateProduct = async (req, res) => {
    try {
        // Xác thực dữ liệu đầu vào
        const { error, value } = productSchema.validate(req.body);
        if (error) {
            return res.status(StatusCodes.BAD_REQUEST).json({ message: error.details[0].message });
        }

        const { id } = req.params;
        const product = await Product.findByIdAndUpdate(id, value, {
            new: true,
        });
        if (!product) {
            return res
                .status(StatusCodes.NOT_FOUND)
                .json({ message: "Không tìm thấy sản phẩm nào" });
        }
        res.status(StatusCodes.OK).json(product);
    } catch (error) {
        res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
    }
};

// Xóa một sản phẩm theo ID
export const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findByIdAndDelete(id);
        if (!product) {
            return res
                .status(StatusCodes.NOT_FOUND)
                .json({ message: "Không tìm thấy sản phẩm nào" });
        }
        res.status(StatusCodes.OK).json({ message: "Xóa sản phẩm thành công" });
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: error.message });
    }
};
