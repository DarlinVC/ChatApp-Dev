import Express from "express";
// middlewares
import {
  verifyUserSignUp,
  verifyUserSignIn,
  verifyFriendRequest,
  verifyFriendRequestAccept
} from "../middlewares/user.middlewares";
// controllers
import userController from "../controllers/user.controller";
import passport from "passport";

export const router = Express.Router();

router.post("/signUp", verifyUserSignUp(), userController.signUp);
router.post("/signIn", verifyUserSignIn(), userController.signIn);
router.post(
  "/friendRequest",
  passport.authenticate("jwt", { session: false }),
  verifyFriendRequest(),
  userController.friendRequest
);

router.post(
  "/acceptFriendRequest",
  passport.authenticate("jwt", { session: false }),
  verifyFriendRequestAccept(),
  userController.FriendRequestAccept
);
