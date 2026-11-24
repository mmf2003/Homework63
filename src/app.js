import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";

import rootRoutes from "./routes/rootRoutes.js";
import usersRoutes from "./routes/usersRoutes.js";
import articlesRoutes from "./routes/articlesRoutes.js";

import { requestLogger } from "./middleware/requestLogger.js";
import { sessionMiddleware } from "./middleware/sessionMiddleware.js";
import { notFoundHandler, errorHandler } from "./middleware/errorHandler.js";

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "..");

// Register both template engines.
app.set("view engine", "pug");
app.set("views", path.join(projectRoot, "views"));

app.set("views", path.join(projectRoot, "views"));

// Serve CSS and other static assets.
app.use(express.static(path.join(__dirname, "../public")));

// Global middleware.
app.use(requestLogger);
app.use(sessionMiddleware);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes.
app.use("/", rootRoutes);
app.use("/users", usersRoutes);
app.use("/articles", articlesRoutes);

// Error handling.
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
