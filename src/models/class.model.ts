import { Schema, model, Types } from "mongoose";

export interface IClass {
  className: string;
  teacherId: Types.ObjectId;
  studentIds: Types.ObjectId[];
}

const classSchema = new Schema<IClass>(
  {
    className: {
      type: String,
      required: true,
      trim: true,
    },
    teacherId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    studentIds: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true }
);

// prevent duplicate students
classSchema.path("studentIds").validate(function (value: Types.ObjectId[]) {
  return new Set(value.map(String)).size === value.length;
}, "Duplicate students are not allowed");

export const Class = model<IClass>("Class", classSchema);
export default Class;
