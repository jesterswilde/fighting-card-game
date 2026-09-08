import "reflect-metadata";
import { createHttpServer } from "./app";
import { connectDatabase } from "./db";

await connectDatabase();
const { server } = createHttpServer();
const port = Number(process.env.PORT || 8080);
server.listen(port, () => console.log("listening on port " + port));
