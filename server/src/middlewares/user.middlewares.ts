import { body } from "express-validator";
import Users from "../models/user.model";

export const checkUserSignUp = () => {
  return [
    body("username")
      .trim()
      .not()
      .isEmpty()
      .withMessage("FieldIsRequired")
      .isString()
      .isLength({ min: 5, max: 24 })
      .withMessage("LengthLessOrExceed"),
    body("password")
      .trim()
      .not()
      .isEmpty()
      .withMessage("FieldIsRequired")
      .isString()
      .isLength({ min: 5, max: 24 })
      .withMessage("LengthLessOrExceed"),
  ];
};

export const checkUserSignIn = () => {
  return [
    body("username")
      .trim()
      .not()
      .isEmpty()
      .withMessage("FieldIsRequired")
      .isString(),
    body("password")
      .trim()
      .not()
      .isEmpty()
      .withMessage("FieldIsRequired")
      .isString(),
  ];
};

export const checkFriendRequest = () => {
  return [
    body("friend")
      .trim()
      .not()
      .isEmpty()
      .withMessage("fieldIsRequired")
      .custom(async (value, { req }) => {
        const userRequesting = req.user.username;
        const friend = await Users.findOne({ username: value });
        if (!friend) {
          throw new Error("FriendNotFound.");
        }
        const isAlreadyFriend = friend.friends.some(
          (friend: any) => friend.user === userRequesting
        );
        const hasSentFriendRequest = friend.friendsRequestReceived.some(
          (request: any) => request.user === userRequesting
        );
        if (isAlreadyFriend) {
          throw new Error("AlreadyFriends");
        } else if (hasSentFriendRequest) {
          throw new Error("AlreadyFriendRequestSent");
        }
      }),
  ];
};
