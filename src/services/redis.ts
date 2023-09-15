import { createClient } from "redis";
import { RedisType } from "../types";

export function createRedisClient(options?: any): RedisType {
  return createClient(options);
}

export async function connectToRedis(redisClient: RedisType): Promise<void> {
  return new Promise(async (resolve, reject) => {
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
  return new Promise(async (resolve, reject) => {
    await redisClient.connect();
    redisClient.set(key, JSON.stringify(value), { EX: 60 * 60 * 4 });
    await redisClient.disconnect();
    resolve();
  });
}

export async function keyExists(
  redisClient: RedisType,
  key: string,
  value: string
): Promise<boolean> {
  return new Promise(async (resolve, reject) => {
    await redisClient.connect();
    const exists = await redisClient.get(key);
    await redisClient.disconnect();
    resolve(JSON.parse(exists as string) === value);
  });
}

export async function getKey(
  redisClient: RedisType,
  key: string
): Promise<any> {
  return new Promise(async (resolve, reject) => {
    await redisClient.connect();
    const val = await redisClient.get(key);
    await redisClient.disconnect();
    resolve(val);
  });
}

export async function incrementKey(
  redisClient: RedisType,
  key: string
): Promise<void> {
  return new Promise(async (resolve, reject) => {
    await redisClient.connect();
    await redisClient.INCRBY(key, 1);
    await redisClient.disconnect();
    resolve();
  });
}

export async function upsertKey(
  redisClient: RedisType,
  key: string,
  value: any
): Promise<void> {
  return new Promise(async (resolve, reject) => {
    await redisClient.connect();
    await redisClient.set(key, JSON.stringify(value), { EX: 60 * 60 * 24 });
    await redisClient.disconnect();
    resolve();
  });
}
