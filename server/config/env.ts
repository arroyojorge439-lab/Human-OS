import dotenv from "dotenv";
dotenv.config();

export const config = {
  PORT: process.env.PORT || 3000,
  GEMINI_API_KEY: process.env.GEMINI_API_KEY || process.env.API_KEY,
  STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
  APP_URL: process.env.APP_URL || "http://localhost:3000",
  NODE_ENV: process.env.NODE_ENV || "development",
};
