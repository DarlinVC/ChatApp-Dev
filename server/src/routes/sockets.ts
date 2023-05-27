import { jwtPayload } from "../utils/jwt";
import { getUsername } from "../utils/getUsername";
import { Users } from "../models/user.model";
import { IFriends } from "../models/interfaces/friends.interface";

export default (io: any) => {
  io.on("connection", async (socket: any) => {
    console.log("new conection: " + socket.id);
    if (!socket.handshake.headers.authorization) {
      socket.emit("tokenError", "tokenExpected");
      return;
    }
    const token = `Bearer ${socket.handshake.headers.authorization}`;
    const user: String = (await getUsername(jwtPayload(token).id)) as string;

    // joins to all chats when the user is ON.
    const response = await Users.findOne({ username: user }).exec();

    if (response !== null) {
      const friends: IFriends[] = response.friends;
      friends.forEach((e: IFriends) => {
        socket.join(e.chatRoom);
      });
    }

    // closing...
    socket.on("disconnect", () => {
      console.log("Client Disconnect: " + socket.id);

      // closing chat rooms.
      if (response !== null) {
        const friends: IFriends[] = response.friends;
        friends.forEach((e: IFriends) => {
          socket.leave(e.chatRoom);
        });
      }
    });
  });
};
