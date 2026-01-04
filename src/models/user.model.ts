import mongoose, { Document, Schema, model } from "mongoose";
import bcrypt from "bcryptjs";
import type { IUser } from "../types/type.js";
import { ROLE } from "../types/type.js";

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      minLength: 6,
      select: false,
    },
    role: {
      type: String,
      enum: Object.values(ROLE),
      required: true,
    },
  },
  { timestamps: true }
);

// ❌ Arrow functions do not bind this
// ➡️ this is undefined

userSchema.pre("save", async function () {
  if (this.isModified("password")) {
    const hashedPassword = await bcrypt.hash(this.password, 10);
    this.password = hashedPassword;
  }
});

const User = model<IUser>("User", userSchema);

export default User;
