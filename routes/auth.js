import { Router } from "express";
import {
  getLogin,
  getReset,
  getSignup,
  postLogin,
  postLogout,
  postSignup,
} from "../controllers/auth.js";
import { body, check } from "express-validator";

const router = Router();

router.get("/login", getLogin);
router.post("/login", [body("email").trim().isEmail()], postLogin);
router.post("/logout", postLogout);
router.get("/signup", getSignup);
router.post("/signup", body("email").trim().isEmail(), postSignup);
router.get("/reset", getReset);

export default router;
