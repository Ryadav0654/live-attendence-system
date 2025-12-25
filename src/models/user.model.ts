import mongoose, { Document, Schema, model } from "mongoose";
import bcrypt from "bcryptjs";

export enum ROLE {
  TEACHER = "teacher",
  STUDENT = "student",
}

export interface IUser {
  name: string;
  email: string;
  password: string;
  role: ROLE;
}

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
