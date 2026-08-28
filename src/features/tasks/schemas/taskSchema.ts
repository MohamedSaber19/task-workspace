import { z } from "zod";

export const taskSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters long").max(100),
  description: z
    .string()
    .min(5, "Description must be at least 5 characters long"),
  priority: z.enum(["Low", "Medium", "High", "Urgent"]),
  status: z.enum(["To Do", "In Progress", "In Review", "Done"]),
  dueDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Please provide a valid date",
  }),
});

export type TaskFormData = z.infer<typeof taskSchema>;
