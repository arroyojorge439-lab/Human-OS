import dotenv from "dotenv";
dotenv.config();

export const config = {
  PORT: process.env.PORT || 3000,
  GEMINI_API_KEY: process.env.GEMINI_API_KEY || process.env.API_KEY,
  NODE_ENV: process.env.NODE_ENV || "development",
};
