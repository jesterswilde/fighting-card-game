import * as express from "express";
import * as bodyParser from "body-parser";
import * as socketIO from "socket.io";
import * as path from "path";
import * as cors from "cors";
import * as http from "http";
import lobby from "./gameServer/lobby";
import apiRouter from "./router";
import "./db/index";

process.on("uncaughtException", function(err) {
  console.log(err);
});

const port = process.env.PORT || 8080;
const app = express();
const server = http.createServer(app);

const io = socketIO(server);
lobby(io);

app.use(bodyParser.json());
app.use(cors());

app.use("/api", apiRouter);

app.use(express.static(path.join(__dirname, "..", "game-client", "dist")));

app.get("*", (req, res) => {
  res
    .status(200)
    .sendfile(
      path.resolve(__dirname, "..", "game-client", "dist", "index.html")
    );
});

server.listen(port, () => console.log("listening on port " + port));
