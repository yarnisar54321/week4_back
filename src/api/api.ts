import { Hono } from "hono";
import studentsRouter from "./students.js";
import { bearerAuth } from "hono/bearer-auth";
import { env } from "hono/adapter";
import booksRouter from "./books.js";
import genresRouter from "./genre.js";
import beveragesRouter from "./beverages.js";
import ordersRouter from "./orders.js";

const apiRouter = new Hono();

apiRouter.get("/", (c) => {
  return c.json({ message: "API router" });
});

apiRouter.use(
  "/*",
  // bearerAuth({
  //   verifyToken: async (token, c) => {
  //     const { API_SECRET } = env<{ API_SECRET: string }>(c);
  //     return token === API_SECRET;
  //   },
  // })
);

apiRouter.route("/students", studentsRouter);
apiRouter.route("/books", booksRouter);
apiRouter.route("/genres", genresRouter);
apiRouter.route("/beverages", beveragesRouter);
apiRouter.route("/orders", ordersRouter);


export default apiRouter;