import { RATE_LIMIT, RATE_LIMIT_WINDOW_MS } from "../lib";
import {
  keyExists,
  rateLimitRedis,
  setKey,
} from "../repository/redisRepository";
import { TEXT } from "../types";

export const rateLimit = async (
  redisConfig: { ip: string },
  from: string
): Promise<number> => {
  try {
    const ipAddress = redisConfig.ip; // Use the IP address of the requester as a unique identifier
    const key = `rateLimit:${ipAddress}:${from}`;
    const val = await rateLimitRedis(key, RATE_LIMIT, RATE_LIMIT_WINDOW_MS);
    return val;
  } catch (error) {
    throw error;
  }
};

export const TextStopHandler = async (
  text: string,
  from: string,
  to: string
): Promise<void> => {
  if (
    text === TEXT.STOP ||
    text === TEXT.STOPN ||
    text === TEXT.STOPR ||
    text === TEXT.STOPRN
  ) {
    try {
      await setKey(from, to);
    } catch (error) {
      //add logger here
      console.log(error);
      throw error;
    }
  }
};

export const checkCacheStorage = async (
  key: string,
  value: string,
  text: string
): Promise<boolean> => {
  if (
    text === TEXT.STOP ||
    text === TEXT.STOPN ||
    text === TEXT.STOPR ||
    text === TEXT.STOPRN
  ) {
    return await keyExists(key, value);
  }

  return false;
};
