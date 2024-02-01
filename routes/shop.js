import { Router } from "express";

import {
  getProducts,
  getIndex,
  getProduct,
  getCart,
  postCart,
  postCartDeleteProduct,
  getOrders,
  getCheckout,
  cartCheckOut,
} from "../controllers/shop.js";
import { authMiddleware } from "../middleware/authMiddelware.js";

const router = Router();
router.get("/", getIndex);

router.get("/products", getProducts);

router.get("/products/:productId", getProduct);

router.get("/cart", authMiddleware, getCart);

router.post("/cart", authMiddleware, postCart);

router.post("/cart-delete-item", authMiddleware, postCartDeleteProduct);
router.post("/create-order", authMiddleware, cartCheckOut);

router.get("/orders", authMiddleware, getOrders);

router.get("/checkout", authMiddleware, getCheckout);

export default router;
