import { createClient } from "redis";
import { RedisType } from "../types";

export function createRedisClient(options?: any): RedisType {
  return createClient(options);
}

export async function connectToRedis(redisClient: RedisType): Promise<void> {
  return new Promise((resolve, reject) => {
    redisClient.on("error", (error) => {
      reject(new Error(`Redis Error: ${error}`));
    });

    redisClient.on("connect", () => {
      console.log("Redis has connected");
      resolve();
    });
  });
}

export async function setKey(
  redisClient: RedisType,
  key: string,
  value: any
): Promise<void> {
  return new Promise((resolve, reject) => {
    redisClient.set(key, JSON.stringify(value), { EX: 60 * 60 * 4 });
    resolve();
  });
}

export async function keyExists(
  redisClient: RedisType,
  key: string,
  value: string
): Promise<boolean> {
  return new Promise(async (resolve, reject) => {
    const exists = await redisClient.get(key);
    resolve(exists === value);
  });
}

export async function getKey(
  redisClient: RedisType,
  key: string
): Promise<any> {
  return new Promise((resolve, reject) => {
    resolve(redisClient.get(key));
  });
}

export async function incrementKey(
  redisClient: RedisType,
  key: string
): Promise<void> {
  return new Promise((resolve, reject) => {
    redisClient.INCRBY(key, 1);
    resolve();
  });
}

export async function upsertKey(
  redisClient: RedisType,
  key: string,
  value: any
): Promise<void> {
  return new Promise((resolve, reject) => {
    redisClient.set(key, JSON.stringify(value), { EX: 60 * 60 * 24 });
    resolve();
  });
}
