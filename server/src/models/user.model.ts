import mongoose, { Schema, Document } from "mongoose";
import bcrypt from "bcrypt";
import { NextFunction } from "express";

import { notifyFriendRequest } from "../handlers/socket-handlers/friendsRequest.handler";

export interface IUser extends Document {
  username: string;
  password: string;
  friendsRequestReceived: [{ user: string }];
  friendsRequestSent: [{ user: string }];
  friends: [{ user: string; chatRoom: string }];
  comparePassword: (password: string) => Promise<boolean>;
}

export const userSchema = new Schema<IUser>(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
    },
    friendsRequestReceived: [
      {
        user: {
          type: String,
          trim: true,
        },
      },
    ],
    friendsRequestSent: [
      {
        user: {
          type: String,
          trim: true,
        },
      },
    ],
    friends: [
      {
        user: {
          type: String,
          trim: true,
        },
        chatRoom: {
          type: String,
          trim: true,
        },
      },
    ],
  },
  {
    collection: "users",
    timestamps: true,
  }
);

userSchema.pre<IUser>("save", async function (next) {
  const user = this;
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(user.password, salt);
  user.password = hash;
  next();
});

userSchema.methods.comparePassword = async function (
  password: string
): Promise<boolean> {
  return await bcrypt.compare(password, this.password);
};

// declare type of "casesPush"
interface CasesPush {
  [key: string]: (...args: any[]) => void;
}
// To save all the functions that will be executed when a push is executed
const casesPush: CasesPush = {
  friendsRequestReceived: notifyFriendRequest,
};

userSchema.post<IUser>(
  "findOneAndUpdate",
  async function (this: any, next: NextFunction) {
    const update = this.getUpdate();

    if (update.$push) {
      // if the action exist in the "casesPush", that function will be execute
      const action = Object.keys(update.$push)[0];
      for (const cases in casesPush) {
        if (action.toString() === cases) {
          casesPush[cases]();
        }
      }
    }
    next;
  }
);

export const Users = mongoose.model<IUser>("users", userSchema);
