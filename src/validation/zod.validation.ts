import z from "zod";

export const signUpZodSchema = z.object({
  name: z.string(),
  email: z.email(),
  password: z.string().min(6, "password must be greater than 6 charaters!"),
  role: z.literal(["teacher", "student"]),
});

export const loginZodSchema = z.object({
  email: z.email(),
  password: z.string().min(6, "password must be greater than 6 charaters!"),
});

export const createClassZodSchema = z.object({
  className: z.string("ClassName must be string"),
});
