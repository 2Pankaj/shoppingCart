import { Router } from "express";

import {
  getAddProduct,
  postAddProduct,
  getProducts,
  getEditProduct,
  postEditProduct,
  postDeleteProduct,
} from "../controllers/admin.js";
import { authMiddleware } from "../middleware/authMiddelware.js";

const router = Router();

/// /admin/add-product => GET
router.get("/add-product", authMiddleware, getAddProduct);

// /admin/products => GET
router.get("/products", authMiddleware, getProducts);

// /admin/add-product => POST
router.post("/add-product", authMiddleware, postAddProduct);

router.get("/edit-product/:productId", authMiddleware, getEditProduct);

router.post("/edit-product", authMiddleware, postEditProduct);

router.post("/delete-product", authMiddleware, postDeleteProduct);

export default router;
