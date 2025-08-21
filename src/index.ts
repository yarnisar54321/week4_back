import { Hono } from "hono";
import { cors } from "hono/cors";
import apiRouter from "./api/api.js";

const app = new Hono();

app.get('/', (c) => {
  return c.json({ message: 
    "Welcome to the API" 
    + " - Use /api to access the API endpoints"
    + " - Use /api/students to access student data"
    + " - Use /api/books to access book data"
    + " - Use /api/genres to access genre data"
    + " - Use /api/beverages to access beverage data"
    + " - Use /api/orders to access order data"
  });
})

app.use(
  "/*",
  cors({
    origin: "https://iot-week02-frontend.vercel.app",
    allowMethods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  })
);

app.route("/api", apiRouter);

export const config = {
  runtime: "edge",
};

// export default handle(app.fetch);
export default app.fetch;

// serve(
//   {
//     fetch: app.fetch,
//     port: 3000,
//   },
//   (info) => {
//     console.log(`Server is running on http://localhost:${info.port}`);
//   }
// );