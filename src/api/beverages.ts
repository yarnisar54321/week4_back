import { Hono } from "hono";
import drizzle from "../db/drizzle.js";
import { beverage } from "../db/schema.js";
import { eq } from "drizzle-orm/sql/expressions/conditions";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";

const beveragesRouter = new Hono();

beveragesRouter.get("/", async (c) => {
  const allBeverages = await drizzle.select().from(beverage);
  return c.json(allBeverages);
});

beveragesRouter.get("/:id", async (c) => {
  const id = Number(c.req.param("id"));
  const result = await drizzle.query.beverage.findFirst({
    where: eq(beverage.id, id),
  });
  if (!result) {
    return c.json({ error: "Beverage not found" }, 404);
  }
  return c.json(result);
});

beveragesRouter.post(
  "/",
  zValidator(
    "json",
    z.object({
      name: z.string().min(1),
      price: z.number().positive(),
      description: z.string().optional().default(""),
      imageUrl: z.string().optional().default(""),
    })
  ),
  async (c) => {
    const { name, price, description, imageUrl } = c.req.valid("json");
    const result = await drizzle
      .insert(beverage)
      .values({
        name,
        price: price.toString(),
        description,
        imageUrl,
      })
      .returning();
    return c.json({ success: true, beverage: result[0] }, 201);
  }
);

export default beveragesRouter;