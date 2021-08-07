import express from "express";
import cors from "cors";
import routes from "./routes";
import { errorHandler } from "./error";

export function initApp() {
  const app = express();
  app.use(express.json());
  app.use(
    cors({
      origin: "http://localhost:3000",
      credentials: true,
    })
  );
  app.use("/api", routes);
  app.use(errorHandler);

  return { app };
}
