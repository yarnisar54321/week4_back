import { Hono } from "hono";
import drizzle from "../db/drizzle.js";
import { students } from "../db/schema.js";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";
import dayjs from "dayjs";

const studentsRouter = new Hono();

studentsRouter.get("/", async (c) => {
    const allStudents = await drizzle.select().from(students);
    return c.json(allStudents);
});

studentsRouter.get("/:id", async (c) => {
  const id = Number(c.req.param("id"));
  const result = await drizzle.query.students.findFirst({
    where: eq(students.id, id),
  });
  if (!result) {
    return c.json({ error: "Student not found" }, 404);
  }
  return c.json(result);
});

studentsRouter.post(
    "/",
    zValidator(
        "json",
        z.object({
            firstName: z.string().min(1),
            lastName: z.string().min(1),
            studentId: z.string().length(7),
            DOB: z.string().refine((val) => !isNaN(Date.parse(val)), {
                message: "Invalid date format",
            }),
            gender: z.enum(["male", "female"])
        })
    ),
    async (c) => {
        const { firstName, lastName, studentId, DOB, gender } = c.req.valid("json");
        const result = await drizzle
            .insert(students)
            .values({
                firstName,
                lastName,
                studentId,
                DOB,
                gender,
            })
            .returning();
        return c.json({ success: true, student: result[0] }, 201);
    }
);

// Sample API body for POST /students
// {
//   "firstName": "John",
//   "lastName": "Doe",
//   "studentId": "1234567",
//   "DOB": "2000-01-01T00:00:00.000Z",
//   "gender": "male"
// }

studentsRouter.put(
  "/:id",
  zValidator(
    "json",
    z.object({
      firstName: z.string().min(1).optional(),
      lastName: z.string().min(1).optional(),
      studentId: z.string().length(7).optional(),
      DOB: z.string().refine((val) => !isNaN(Date.parse(val)), {
                message: "Invalid date format",
            }).optional(),
      gender: z.enum(["male", "female"]).optional(),
    })
  ),
  async (c) => {
    const id = Number(c.req.param("id"));
    const data = c.req.valid("json");
    const updated = await drizzle.update(students).set(data).where(eq(students.id, id)).returning();
    if (updated.length === 0) {
      return c.json({ error: "Book not found" }, 404);
    }
    return c.json({ success: true, book: updated[0] });
  }
);

studentsRouter.delete("/:id", async (c) => {
  const id = Number(c.req.param("id"));
  const deleted = await drizzle.delete(students).where(eq(students.id, id)).returning();
  if (deleted.length === 0) {
    return c.json({ error: "Book not found" }, 404);
  }
  return c.json({ success: true, book: deleted[0] });
});

export default studentsRouter;