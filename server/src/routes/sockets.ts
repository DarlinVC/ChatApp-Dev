export default (io: any) => {
  io.on("connection", (socket: any) => {
    console.log("new conection: " + socket.id); 

    // chat.controller
    socket.on("disconnect", () => {
      console.log("Client Disconnect: " + socket.id);
    });
  });
};
