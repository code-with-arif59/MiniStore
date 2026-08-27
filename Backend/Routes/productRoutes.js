import express from "express";
import { createProduct,  getProduct,  updateProduct,  deleteProduct,} from "../Controller/product.js";

const router = express.Router();

router.post("/add", createProduct);
router.get("/", getProduct);
router.put("/update/:id", updateProduct);
router.delete("/delete/:id", deleteProduct);

export default router;