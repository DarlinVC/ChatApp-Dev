// will add users later...

import { Schema, model, Document } from "mongoose";

export interface IChat extends Document {
  roomName: string;
  chat: [
    {
      user: string;
      message: string;
    }
  ];
}

const ChatSchema = new Schema({
  roomName: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  chat: [
    {
      user: {
        type: String,
        required: false /* Will change... */,
        trim: true,
      },
      message: { type: String },
    },
  ],
});

export default model<IChat>("chats", ChatSchema);
