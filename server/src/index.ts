// Librarys
import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import http from "http";
import { Server as WebSocketServer } from "socket.io";
import passport from 'passport';

// Docs
import config from "./config/config";
import { router } from "./routes/routes";
import passportMiddleware from "./middlewares/auth.middleware";

// Sockets
import Sockets from "./routes/sockets";

class ChatApp {
  private app: express.Application;
  private server: http.Server;
  public io: WebSocketServer;
  private router: express.Router;

  constructor() {
    this.app = express();
    this.server = http.createServer(this.app);

    this.io = new WebSocketServer(this.server);

    this.router = router;
    this.config();
    this.connectDB();

    // calling sockets
    Sockets(this.io);
  }

  private config() {
    this.app.use(bodyParser.urlencoded({ extended: false }));
    this.app.use(bodyParser.json());
    this.app.use(passport.initialize());
    passport.use(passportMiddleware);

    this.app.use("/api", this.router);
  }

  public listen() {
    this.server.listen(3000, () => {
      console.log("SERVER RUNNING...");
    });
  }

  private connectDB() {
    mongoose.Promise = global.Promise;
    mongoose.set("strictQuery", false);
    mongoose
      .connect(config.DB.URL as string)
      .then(() => {
        console.log("CONECTION SUCCESSFULL");
      })
      .catch((err) => console.log(err));
  }
}

const chatApp = new ChatApp();
chatApp.listen();
