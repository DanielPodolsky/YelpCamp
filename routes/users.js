import { Router } from "express";
import passport from "passport";
import { storeReturnTo } from "../middleware.js";
import {
  renderRegister,
  renderLogin,
  registerUser,
  loginUser,
  logoutUser,
} from "../controllers/users.js";

const router = Router();

router.route("/register").get(renderRegister).post(registerUser);

router
  .route("/login")
  .get(renderLogin)
  .post(
    storeReturnTo,
    passport.authenticate("local", {
      failureFlash: true,
      failureRedirect: "/login",
    }),
    loginUser
  );

router.get("/logout", logoutUser);

export default router;
