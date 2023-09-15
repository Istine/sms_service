import { config } from "dotenv";

config();

export const configOptions = {
  port: process.env.PORT || 4000,
  databaseUrl: process.env.DATABASE_URL,
  redisUrl: process.env.REDIS_URL,
};
