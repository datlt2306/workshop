import { User } from "../models";
import { asyncHandler } from "../utils/asyncHandler";
import { AppError } from "../utils/appError";
import { StatusCodes } from "http-status-codes";

// Get all users (admin only)
export const getAllUsers = asyncHandler(async (req, res) => {
    const users = await User.find().select("-password");

    res.status(StatusCodes.OK).json({
        status: "success",
        results: users.length,
        data: {
            users,
        },
    });
});

// Get user by ID (admin only)
export const getUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id).select("-password");

    if (!user) {
        throw new AppError("Không tìm thấy người dùng", StatusCodes.NOT_FOUND);
    }

    res.status(StatusCodes.OK).json({
        status: "success",
        data: {
            user,
        },
    });
});

// Create user (admin only)
export const createUser = asyncHandler(async (req, res) => {
    const newUser = await User.create(req.body);

    // Remove password from response
    newUser.password = undefined;

    res.status(StatusCodes.CREATED).json({
        status: "success",
        data: {
            user: newUser,
        },
    });
});

// Update user (admin only)
export const updateUser = asyncHandler(async (req, res) => {
    // Prevent password update through this route
    if (req.body.password) {
        throw new AppError(
            "Không thể cập nhật mật khẩu tại đây. Vui lòng sử dụng /auth/update-password",
            StatusCodes.BAD_REQUEST
        );
    }

    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    }).select("-password");

    if (!updatedUser) {
        throw new AppError("Không tìm thấy người dùng", StatusCodes.NOT_FOUND);
    }

    res.status(StatusCodes.OK).json({
        status: "success",
        data: {
            user: updatedUser,
        },
    });
});

// Delete user (admin only)
export const deleteUser = asyncHandler(async (req, res) => {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
        throw new AppError("Không tìm thấy người dùng", StatusCodes.NOT_FOUND);
    }

    res.status(204).json({
        status: "success",
        data: null,
    });
});

// Update current user profile
export const updateMe = asyncHandler(async (req, res) => {
    // Prevent password update through this route
    if (req.body.password) {
        throw new AppError(
            "Không thể cập nhật mật khẩu tại đây. Vui lòng sử dụng /auth/update-password",
            StatusCodes.BAD_REQUEST
        );
    }

    // Remove fields that shouldn't be updated by regular users
    const filteredBody = { ...req.body };
    ["role", "emailVerified", "accountStatus"].forEach((field) => delete filteredBody[field]);

    // Add user photo if uploaded
    if (req.file) filteredBody.photo = req.file.filename;

    const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
        new: true,
        runValidators: true,
    }).select("-password");

    res.status(StatusCodes.OK).json({
        status: "success",
        data: {
            user: updatedUser,
        },
    });
});

// Get user addresses
export const getMyAddresses = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user.id).select("addresses");

    res.status(StatusCodes.OK).json({
        status: "success",
        data: {
            addresses: user.addresses,
        },
    });
});

// Add new address
export const addAddress = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user.id);

    user.addresses.push(req.body);
    await user.save();

    res.status(StatusCodes.CREATED).json({
        status: "success",
        data: {
            addresses: user.addresses,
        },
    });
});

// Update address
export const updateAddress = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user.id);
    const addressIndex = user.addresses.findIndex(
        (addr) => addr._id.toString() === req.params.addressId
    );

    if (addressIndex === -1) {
        throw new AppError("Không tìm thấy địa chỉ", StatusCodes.NOT_FOUND);
    }

    user.addresses[addressIndex] = { ...user.addresses[addressIndex].toObject(), ...req.body };
    await user.save();

    res.status(StatusCodes.OK).json({
        status: "success",
        data: {
            addresses: user.addresses,
        },
    });
});

// Delete address
export const deleteAddress = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user.id);
    const addressIndex = user.addresses.findIndex(
        (addr) => addr._id.toString() === req.params.addressId
    );

    if (addressIndex === -1) {
        throw new AppError("Không tìm thấy địa chỉ", StatusCodes.NOT_FOUND);
    }

    user.addresses.splice(addressIndex, 1);
    await user.save();

    res.status(204).json({
        status: "success",
        data: null,
    });
});

// Set default address
export const setDefaultAddress = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user.id);
    const addressIndex = user.addresses.findIndex(
        (addr) => addr._id.toString() === req.params.addressId
    );

    if (addressIndex === -1) {
        throw new AppError("Không tìm thấy địa chỉ", StatusCodes.NOT_FOUND);
    }

    // Remove isDefault from all addresses
    user.addresses.forEach((addr) => (addr.isDefault = false));

    // Set the selected address as default
    user.addresses[addressIndex].isDefault = true;
    await user.save();

    res.status(StatusCodes.OK).json({
        status: "success",
        data: {
            addresses: user.addresses,
        },
    });
});

// Count users by role
export const countUsersByRole = asyncHandler(async (req, res) => {
    const { role } = req.query;

    const filter = {};
    if (role) {
        filter.role = role;
    }

    const count = await User.countDocuments(filter);

    res.status(StatusCodes.OK).json({
        status: "success",
        data: {
            count,
        },
    });
});
