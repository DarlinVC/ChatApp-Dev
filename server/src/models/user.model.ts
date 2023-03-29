import { Schema, model, Document } from "mongoose";
import bcrypt from "bcrypt";

export interface IUser extends Document {
  username: string;
  password: string;
  friendsRequestReceived: [
    {
      user: string;
    }
  ];
  friendsRequestSent: [
    {
      user: string;
    }
  ];
  friends: [
    {
      user: string;
      chatRoom: string;
    }
  ];
  comparePassword: (password: string) => Promise<boolean>;
}

const userSchema = new Schema<IUser>({
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
});

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

export const Users = model<IUser>("users", userSchema);
