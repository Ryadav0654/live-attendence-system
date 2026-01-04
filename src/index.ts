import dotenv from "dotenv";
dotenv.config();
import server from "./app.js";
import connectDB from "./lib/db.js";

const PORT = process.env.PORT || 8080;

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
