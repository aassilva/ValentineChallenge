import type { Express } from "express";

// Simplified OAuth - No Manus dependencies
// This is a stub to prevent errors when the app tries to register OAuth routes
export function registerOAuthRoutes(app: Express) {
  // OAuth is disabled for Railway deployment
  // If you need authentication, implement a simple email/password system
  console.log("[OAuth] OAuth routes disabled (simplified for Railway)");
}
