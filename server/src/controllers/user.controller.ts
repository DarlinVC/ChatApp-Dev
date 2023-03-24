import { Request, Response } from "express";
import { validationResult } from "express-validator";
// utils
import { createToken, jwtPayload } from "../utils/handle.jwt";
import { getUsername } from "../utils/getUsername";
// models
import Users from "../models/user.model";

class userController {
  /**
   *
   * @param req
   * @param res
   * @returns action and successfull = User created successfully.
   */
  async signUp(req: Request, res: Response): Promise<Response> {
    try {
      // handle validation errors...
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const user = new Users(req.body);
      await user.save();
      return res.status(201).send({
        action: "SavingUser",
        msg: "Successfull",
      });
    } catch (e: any) {
      if (e.name == "MongoServerError") {
        if (e.keyValue.username)
          return res.status(409).send({
            action: "SavingUser",
            msg: "UsernameAlreadyExists",
          });
      }
      return res.status(500).send({
        action: "SavingUser",
        msg: "ServerError",
      });
    }
  }
  /**
   *
   * @param req
   * @param res
   * @returns jwt token.
   */
  async signIn(req: Request, res: Response): Promise<Response> {
    try {
      // handle validation errors...
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const user = await Users.findOne({ username: req.body.username });
      if (!user)
        return res.status(404).send({
          action: "LogIn",
          msg: "FieldsIncorrect",
          token: "",
        });
      const isMatch = await user.comparePassword(req.body.password);
      if (isMatch)
        return res.status(200).send({
          action: "LogIn",
          msg: "Successfull",
          token: createToken(user._id.toString()),
        });
      return res.status(400).send({
        action: "LogIn",
        msg: "FieldsInvalids",
        token: "",
      });
    } catch (e) {
      return res.status(500).send({
        action: "LogIn",
        msg: "ServerError",
        token: "",
      });
    }
  }
  /**
   * Sends a friend request from the authenticated user to the specified friend.
   * @param req The HTTP request object.
   * @param res The HTTP response object.
   * @returns A JSON response indicating whether the friend request was
   *          successful or not.
   */
  async friendRequest(req: Request, res: Response): Promise<Response> {
    // Get the username of the authenticated user from the JWT token.
    const sendingUser = await getUsername(
      jwtPayload(req.headers.authorization).id
    );

    // handle validation errors...
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    if (sendingUser == req.body.FriendRequested)
      return res.status(409).send({
        action: "friendRequest",
        msg: "CantSendRequestYourself",
      });
    /* Find the friend in the database and add a friend
    request to their received requests. */
    const friendRequested = await Users.findOneAndUpdate(
      { username: req.body.FriendRequested },
      {
        $addToSet: {
          friendsRequestReceived: {
            user: sendingUser,
          },
        },
      }
    );
    // If the friend is not found, return an error response.
    if (!friendRequested) {
      return res.status(404).send({
        action: "friendRequest",
        msg: "userFriendNotFound",
      });
    }
    // Add the friend request to the authenticated user's sent requests.
    await Users.findOneAndUpdate(
      { username: sendingUser },
      {
        $addToSet: {
          friendsRequestSent: {
            user: friendRequested.username,
          },
        },
      }
    );
    return res.status(200).send({
      action: "friendRequest",
      msg: "successfull",
    });
  }
  /**
   *
   * @param req
   * @param res
   * @returns successfull or Error server
   * @description Both users are removed from sent and received requests to
   *  later add both to the friends list.
   */
  async FriendRequestAccept(req: Request, res: Response): Promise<Response> {
    try {
      const params = req.body;
      const receiver = await getUsername(
        jwtPayload(req.headers.authorization).id
      );

      // middlewares errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      // Remove the applicant and sender from the friend requests list
      await Users.findOneAndUpdate(
        { username: receiver },
        { $pull: { friendsRequestReceived: { user: params.sender } } }
      );
      await Users.findOneAndUpdate(
        { username: params.sender },
        { $pull: { friendsRequestSent: { user: receiver } } }
      );

      // add both users to your friends list
      await Users.findOneAndUpdate(
        { username: receiver },
        { $addToSet: { friends: { user: params.sender } } }
      );
      await Users.findOneAndUpdate(
        { username: params.sender },
        { $addToSet: { friends: { user: receiver } } }
      );

      // return all its okay
      return res.status(200).send({
        action: "acceptFriendRequested",
        msg: "successfull",
      });
    } catch (e) {
      return res.status(500).send({
        action: "acceptFriendRequested",
        msg: "ErrorServer",
      });
    }
  }
}

export default new userController();
