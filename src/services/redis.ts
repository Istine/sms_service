import { getKey, keyExists, setKey } from "../repository/redisRepository";
import { TEXT } from "../types";

export const getRequestCount = async (from: string): Promise<number> => {
  const val = await getKey(from);
  return JSON.parse(val);
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
  value: string
): Promise<boolean> => {
  return await keyExists(key, value);
};
