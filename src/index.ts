import dotenv from "dotenv";
dotenv.config();
import app from "./app.js";
import connectDB from "./lib/db.js";

const PORT: string | number = process.env.PORT || 8080;

(async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`server is listening at ${PORT}`);
    });
  } catch (err) {
    console.error("Startup failed:", err);
    process.exit(1);
  }
})();
