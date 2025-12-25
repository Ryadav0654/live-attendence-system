import mongoose from "mongoose";

const DB_NAME = process.env.DBNAME || "attendance";
const DB_URI = process.env.DBURI || "mongodb://127.0.0.1:27017";

export const connectDB = async () => {
  try {
    await mongoose.connect(`${DB_URI}/${DB_NAME}`);

    console.log(`MongoDB connected: ${DB_NAME}`);

    mongoose.connection.on("error", (err) => {
      console.error("MongoDB connection error:", err);
    });

    mongoose.connection.on("disconnected", () => {
      console.warn("MongoDB disconnected");
    });

    process.on("SIGINT", async () => {
      await mongoose.connection.close();
      console.log("MongoDB connection closed");
      process.exit(0);
    });
  } catch (error) {
    console.error("MongoDB connection failed:", error);
    process.exit(1);
  }
};

export default connectDB;
