import dotenv from "dotenv";
dotenv.config();
import app from "./app.js";
import { createServer } from "node:http";
import connectDB from "./lib/db.js";
import { initWebsocket } from "./ws/ws.js";

const PORT = process.env.PORT || 8080;

const server = createServer(app);
initWebsocket(server);

(async () => {
  try {
    await connectDB();
    server.listen(PORT, () => {
      console.log(`server is listening at ${PORT}`);
    });
  } catch (err) {
    console.error("Startup failed:", err);
    process.exit(1);
  }
})();
