import { body } from "express-validator";
import Users from "../models/user.model";
// utils
//import { jwtPayload } from "../utils/handle.jwt";
//import { getUsername } from "../utils/getUsername";

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

export const verifyFriendRequest = () => {
  return [
    body("friend")
      .trim()
      .not()
      .isEmpty()
      .withMessage("fieldIsRequired")
      .custom(async (value, { req }) => {
        const userRequesting = req.user.username;
        const friendRequested = await Users.findOne({ username: value });
        if (!friendRequested) {
          throw new Error("FriendRequestedNotFound");
        }
        const isAlreadyFriend = friendRequested.friends.some(
          (friend: any) => friend.user === userRequesting
        );
        const hasSentFriendRequest =
          friendRequested.friendsRequestReceived.some(
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
        const userRequesting = req.user.username;
        const friendRequested: any = await Users.findOne({ username: value });
        if (friendRequested) {
          if (friendRequested === userRequesting)
            throw new Error("CantAcceptFriendRequestYourself");
          const isAlreadyFriend = friendRequested.friends.some(
            (friend: any) => friend.user === userRequesting
          );
          if (isAlreadyFriend) throw new Error("AlreadyFriends");
        }
      }),
  ];
};
