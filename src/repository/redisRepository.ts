import Redis from "ioredis";
import { configOptions } from "../config";

const redisPool = new Redis(configOptions.redisUrl as string);

async function performRedisOperation<T>(
  operation: (redisPool: any) => Promise<T>
): Promise<T> {
  try {
    const result = await operation(redisPool); // Pass the pool to the operation
    return result;
  } catch (error) {
    console.error((error as Error).message);
    throw error; // Re-throw the error to let the caller handle it
  }
}

export async function setKey(
  key: string,
  value: string,
  expiration: number = 60 * 60 * 4
): Promise<void> {
  return performRedisOperation<void>(async (redisClient) => {
    await redisClient.set(key, value, "EX", expiration);
  });
}

export async function keyExists(key: string, value: string): Promise<boolean> {
  return performRedisOperation<boolean>(async (redisClient) => {
    const exists = await redisClient.get(key);
    return JSON.parse(exists as string) === value;
  });
}

export async function getKey(key: string): Promise<any> {
  return performRedisOperation<any>(async (redisClient) => {
    const val = await redisClient.get(key);
    return val;
  });
}

export async function incrementKey(key: string): Promise<void> {
  return performRedisOperation<void>(async (redisClient) => {
    await redisClient.INCRBY(key, 1);
  });
}

export async function upsertKey(key: string, value: any): Promise<void> {
  return performRedisOperation<void>(async (redisClient) => {
    await redisClient.set(key, JSON.stringify(value), { EX: 60 * 60 * 24 });
  });
}
