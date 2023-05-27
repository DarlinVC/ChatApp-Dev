import { jwtPayload } from "../utils/jwt";
import { getUsername } from "../utils/getUsername";
import { Users, IUser } from "../models/user.model";
import { IFriends } from "../models/interfaces/friends.interface";

export default (io: any) => {
  io.on("connection", async (socket: any) => {
    console.log("new conection: " + socket.id);
    if (!socket.handshake.headers.authorization) {
      socket.emit("tokenError", "Se espera un token");
      return;
    }
    
    const user: String = await getUsername(
      jwtPayload(socket.handshake.headers.authorization.toString()).id
    ) as string;
    
    // joins to all chats when the user is ON.
    Users.findOne({username: user}, (_err: Error, response: IUser)=> {
      const friends: IFriends[] = response.friends;
      friends.forEach((e: IFriends)=>{
        socket.join(e.chatRoom);
      });
    });

    // closing...
    socket.on("disconnect", () => {
      console.log("Client Disconnect: " + socket.id);
    });
  });
};
