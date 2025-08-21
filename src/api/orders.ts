import { Hono } from "hono";
import drizzle from "../db/drizzle.js";
import { order } from "../db/schema.js";
import { eq } from "drizzle-orm/sql/expressions/conditions";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";

const ordersRouter = new Hono();
ordersRouter.get("/", async (c) => {
  const allOrders = await drizzle.select().from(order);
  return c.json(allOrders);
});
ordersRouter.get("/:id", async (c) => {
  const id = Number(c.req.param("id"));
  const result = await drizzle.query.order.findFirst({
    where: eq(order.id, id),
  });
  if (!result) {
    return c.json({ error: "Order not found" }, 404);
  }
  return c.json(result);
});
ordersRouter.post(
    "/",
    zValidator(
        "json",
        z.object({
            beverageId: z.number().int().positive(),
            quantity: z.number().int().positive().default(1),
            note: z.string().max(500).optional(),
            orderDate: z.string().optional().refine((val) => !val || !isNaN(Date.parse(val)), {
                message: "Invalid date format",
            }),
        })
    ),
    async (c) => {
        const { beverageId, quantity, note, orderDate } = c.req.valid("json");
        const result = await drizzle
            .insert(order)
            .values({
                beverageId,
                quantity,
                note,
                orderDate: orderDate ? new Date(orderDate) : undefined,
            })
            .returning();
        return c.json({ success: true, order: result[0] }, 201);
    }
);
export default ordersRouter;