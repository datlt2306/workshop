import { Attribute } from "../models";
import { asyncHandler } from "../utils/asyncHandler";
import { AppError } from "../utils/appError";
import { StatusCodes } from "http-status-codes";

// Get all attributes
export const getAllAttributes = asyncHandler(async (req, res) => {
    const attributes = await Attribute.find();

    res.status(StatusCodes.OK).json({
        status: "success",
        results: attributes.length,
        data: {
            attributes,
        },
    });
});

// Get a single attribute
export const getAttribute = asyncHandler(async (req, res) => {
    const attribute = await Attribute.findById(req.params.id);

    if (!attribute) {
        throw new AppError("Không tìm thấy thuộc tính", StatusCodes.NOT_FOUND);
    }

    res.status(StatusCodes.OK).json({
        status: "success",
        data: {
            attribute,
        },
    });
});

// Create a new attribute
export const createAttribute = asyncHandler(async (req, res) => {
    const newAttribute = await Attribute.create(req.body);

    res.status(StatusCodes.CREATED).json({
        status: "success",
        data: {
            attribute: newAttribute,
        },
    });
});

// Update an attribute
export const updateAttribute = asyncHandler(async (req, res) => {
    const updatedAttribute = await Attribute.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    });

    if (!updatedAttribute) {
        throw new AppError("Không tìm thấy thuộc tính", StatusCodes.NOT_FOUND);
    }

    res.status(StatusCodes.OK).json({
        status: "success",
        data: {
            attribute: updatedAttribute,
        },
    });
});

// Delete an attribute
export const deleteAttribute = asyncHandler(async (req, res) => {
    const attribute = await Attribute.findByIdAndDelete(req.params.id);

    if (!attribute) {
        throw new AppError("Không tìm thấy thuộc tính", StatusCodes.NOT_FOUND);
    }

    res.status(204).json({
        status: "success",
        data: null,
    });
});

// Add a new value to an attribute
export const addAttributeValue = asyncHandler(async (req, res) => {
    const attribute = await Attribute.findById(req.params.id);

    if (!attribute) {
        throw new AppError("Không tìm thấy thuộc tính", StatusCodes.NOT_FOUND);
    }

    attribute.values.push(req.body);
    await attribute.save();

    res.status(StatusCodes.OK).json({
        status: "success",
        data: {
            attribute,
        },
    });
});

// Update an attribute value
export const updateAttributeValue = asyncHandler(async (req, res) => {
    const attribute = await Attribute.findById(req.params.id);

    if (!attribute) {
        throw new AppError("Không tìm thấy thuộc tính", StatusCodes.NOT_FOUND);
    }

    const valueIndex = attribute.values.findIndex(
        (val) => val._id.toString() === req.params.valueId
    );

    if (valueIndex === -1) {
        throw new AppError("Không tìm thấy giá trị thuộc tính", StatusCodes.NOT_FOUND);
    }

    attribute.values[valueIndex] = { ...attribute.values[valueIndex].toObject(), ...req.body };
    await attribute.save();

    res.status(StatusCodes.OK).json({
        status: "success",
        data: {
            attribute,
        },
    });
});

// Delete an attribute value
export const deleteAttributeValue = asyncHandler(async (req, res) => {
    const attribute = await Attribute.findById(req.params.id);

    if (!attribute) {
        throw new AppError("Không tìm thấy thuộc tính", StatusCodes.NOT_FOUND);
    }

    const valueIndex = attribute.values.findIndex(
        (val) => val._id.toString() === req.params.valueId
    );

    if (valueIndex === -1) {
        throw new AppError("Không tìm thấy giá trị thuộc tính", StatusCodes.NOT_FOUND);
    }

    attribute.values.splice(valueIndex, 1);
    await attribute.save();

    res.status(204).json({
        status: "success",
        data: null,
    });
});
