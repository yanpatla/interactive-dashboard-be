import express from "express";
import { onRequest } from "firebase-functions/v2/https";

import { errorMiddleware } from "./presentation/http/middlewares/error.middleware";
import { TrafficStatsRoutes } from "./presentation/http/routes/trafficstats.routes";
import { AuthRoutes } from "./presentation/http/routes/auth.routes";
import { env } from "./config";

const app = express();
app.use(express.json());
app.use("/auth", AuthRoutes.routes);
app.use("/traffic-stats", TrafficStatsRoutes.routes);

 
app.use(errorMiddleware);

export const api = onRequest(
  {
    cors: env.allowedOrigins,  
  },
  app,
);
