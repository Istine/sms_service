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
    return exists === value;
  });
}

export const rateLimitRedis = async (
  key: string,
  limit: number,
  windowMs: number
) => {
  return performRedisOperation<number>(async (redisClient) => {
    return new Promise(async (resolve, reject) => {
      await redisClient
        .multi()
        .incr(key)
        .expire(key, windowMs / 1000)
        .exec((err: Error, replies: Array<any>) => {
          if (err) {
            console.error(err);
            reject(err);
          }
          const count = replies[0][1];
          resolve(count);
        });
    });
  });
};
