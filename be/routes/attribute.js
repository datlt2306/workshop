import express from "express";
import {
    createAttribute,
    getAttributes,
    getAttributeById,
    updateAttribute,
    deleteAttribute,
} from "../controllers/attribute";

const router = express.Router();

// Định nghĩa các route cho Attribute
router.post("/attributes", createAttribute);
router.get("/attributes", getAttributes);
router.get("/attributes/:id", getAttributeById);
router.put("/attributes/:id", updateAttribute);
router.delete("/attributes/:id", deleteAttribute);

export default router;
