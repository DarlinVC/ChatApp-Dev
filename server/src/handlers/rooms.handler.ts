import chatsModel, { IChat } from "../models/chats.model";

/**
 *
 * @param roomName
 * @returns successfull o error: string.
 * @description Create the chat in the database when both users are added as friends
 */
export async function createChat(roomName: string) {
  try {
    const newChat = new chatsModel<IChat>();
    newChat.roomName = roomName;
    await newChat.save();

    return "successfull";
  } catch (e) {
    return "Error";
  }
}
