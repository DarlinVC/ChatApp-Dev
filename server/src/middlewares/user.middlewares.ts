import { body } from "express-validator";
import Users from "../models/user.model";
// utils
//import { jwtPayload } from "../utils/handle.jwt";
//import { getUsername } from "../utils/getUsername";

export const verifyUserSignUp = () => {
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

export const verifyUserSignIn = () => {
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

export const verifyFriendRequest = () => {
  return [
    body("friend")
      .trim()
      .not()
      .isEmpty()
      .withMessage("fieldIsRequired")
      .custom(async (value, { req }) => {
        const receiver = req.user.username;
        const sender = await Users.findOne({ username: value });
        if (!sender) {
          throw new Error("FriendRequestedNotFound");
        }
        const isAlreadyFriend = sender.friends.some(
          (friend: any) => friend.user === receiver
        );
        const hasSentFriendRequest =
          sender.friendsRequestReceived.some(
            (request: any) => request.user === receiver
          );
        if (isAlreadyFriend) {
          throw new Error("AlreadyFriends");
        } else if (hasSentFriendRequest) {
          throw new Error("AlreadyFriendRequestSent");
        }
      }),
  ];
};

/**
 * 
 * @returns ...
 * @description It is verified if the user who sent the request exists, if it exists,
 *  then it proceeds with the verification of if the user is not trying in some
 *  way to accept himself and generate an error, and also if the user is already in the friends list .
 */
export const verifyFriendRequestAccept = () => {
  return [
    body("sender")
      .trim()
      .not()
      .isEmpty()
      .withMessage("fieldIsRequired")
      .custom(async (value, { req }) => {
        const receiver = req.user.username;
        const sender: any = await Users.findOne({ username: value });
        if (sender) {
          if (sender === receiver)
            throw new Error("CantAcceptFriendRequestYourself");
          const isAlreadyFriend = sender.friends.some(
            (friend: any) => friend.user === receiver
          );
          if (isAlreadyFriend) throw new Error("AlreadyFriends");
        }
      }),
  ];
};
