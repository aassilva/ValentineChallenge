import "dotenv/config";
import express from "express";
import { createServer } from "http";
import path from "path";
import { fileURLToPath } from "url";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { registerOAuthRoutes } from "./oauth-simple";
import { appRouter } from "../routers";
import { createContext } from "./context";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const server = createServer(app);
  
  // Configure body parser
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));
  
  // OAuth routes (simplified/disabled)
  registerOAuthRoutes(app);
  
  // tRPC API
  app.use(
    "/api/trpc",
    createExpressMiddleware({
      router: appRouter,
      createContext,
    })
  );
  
  // Serve static files in production
  // The build process creates files in dist/public/
  // and the server bundle is in dist/index.js
  // So from dist/index.js, we need to go to dist/public/
  const publicPath = path.join(__dirname, "public");
  
  console.log(`[Static] Serving files from: ${publicPath}`);
  
  app.use(express.static(publicPath));
  
  // SPA fallback - serve index.html for all routes
  app.get("*", (_req, res) => {
    res.sendFile(path.join(publicPath, "index.html"));
  });

  const port = parseInt(process.env.PORT || "3000");

  server.listen(port, () => {
    console.log(`✓ Server running on http://localhost:${port}/`);
    console.log(`✓ Environment: ${process.env.NODE_ENV || "development"}`);
    console.log(`✓ Database: ${process.env.DATABASE_URL ? "Connected" : "Not configured"}`);
  });
}

startServer().catch((error) => {
  console.error("Failed to start server:", error);
  process.exit(1);
});
