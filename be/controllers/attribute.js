import { StatusCodes } from "http-status-codes";
import Attribute from "../models/attribute";

// Tạo một thuộc tính mới
export const createAttribute = async (req, res) => {
    try {
        const attribute = new Attribute(req.body);
        await attribute.save();
        res.status(StatusCodes.CREATED).json(attribute);
    } catch (error) {
        res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
    }
};

// Lấy tất cả các thuộc tính
export const getAttributes = async (req, res) => {
    try {
        const attributes = await Attribute.find();
        res.status(StatusCodes.OK).json(attributes);
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: error.message });
    }
};

// Lấy một thuộc tính theo ID
export const getAttributeById = async (req, res) => {
    try {
        const attribute = await Attribute.findById(req.params.id);
        if (!attribute) {
            return res.status(StatusCodes.NOT_FOUND).json({ message: "Attribute not found" });
        }
        res.status(StatusCodes.OK).json(attribute);
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: error.message });
    }
};

// Cập nhật một thuộc tính theo ID
export const updateAttribute = async (req, res) => {
    try {
        const attribute = await Attribute.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });
        if (!attribute) {
            return res.status(StatusCodes.NOT_FOUND).json({ message: "Attribute not found" });
        }
        res.status(StatusCodes.OK).json(attribute);
    } catch (error) {
        res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
    }
};

// Xóa một thuộc tính theo ID
export const deleteAttribute = async (req, res) => {
    try {
        const attribute = await Attribute.findByIdAndDelete(req.params.id);
        if (!attribute) {
            return res.status(StatusCodes.NOT_FOUND).json({ message: "Attribute not found" });
        }
        res.status(StatusCodes.OK).json({ message: "Attribute deleted successfully" });
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: error.message });
    }
};
