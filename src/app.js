import express from "express";
import routes from "./routes";
import { errorHandler } from "./error";

export function initApp() {
  const app = express();
  app.use(express.json());
  app.use("/api", routes);
  app.use(errorHandler);

  return { app };
}
