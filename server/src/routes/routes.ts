import Express from "express";
// middlewares
import {
  checkUserSignUp,
  checkUserSignIn,
  checkFriendRequest,
} from "../middlewares/user.middlewares";
// controllers
import userController from "../controllers/user.controller";
import passport from "passport";

export const router = Express.Router();

router.post("/signUp", checkUserSignUp(), userController.signUp);
router.post("/signIn", checkUserSignIn(), userController.signIn);
router.post(
  "/friendRequest",
  passport.authenticate("jwt", { session: false }),
  checkFriendRequest(),
  userController.friendRequest
);
