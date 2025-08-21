import { Hono } from "hono";
import drizzle from "../db/drizzle.js";
import { genres } from "../db/schema.js";
import { eq } from "drizzle-orm/sql/expressions/conditions";

const genresRouter = new Hono();

genresRouter.get("/", async (c) => {
  const allGenres = await drizzle.select().from(genres);
  return c.json(allGenres);
});
genresRouter.get("/:id", async (c) => {
  const id = Number(c.req.param("id"));
  const result = await drizzle.query.genres.findFirst({
    where: eq(genres.id, id),
  });
  if (!result) {
    return c.json({ error: "Genre not found" }, 404);
  }
  return c.json(result);
});

export default genresRouter;