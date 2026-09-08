import express from "express";
import socketIO from "socket.io";
import * as path from "path";
import cors from "cors";
import * as http from "http";
import lobby from "./gameServer/lobby";
import apiRouter from "./router";

export function createHttpServer() {
  const app = express();
  const server = http.createServer(app);

  const io = socketIO(server, {
    pingInterval: 10000,
    pingTimeout: 60000,
  });
  lobby(io);

  app.use(express.json());
  app.use(cors());
  app.use("/api", apiRouter);

  app.use(express.static(path.join(__dirname, "..", "game-client", "dist")));

  app.get("*", (req, res) => {
    res.status(200).sendFile(path.resolve(__dirname, "..", "game-client", "dist", "index.html"));
  });

  return { app, server, io };
}
