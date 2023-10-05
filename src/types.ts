import { Request } from "express";
import { createClient } from "redis";

export interface DatabaseContext {
  connect(): void;
}

export interface extendedRequestObject extends Request {
  account_id: number;
}

export enum FIELDS {
  FROM = "from",
  T0 = "to",
  TEXT = "text",
}

export enum TEXT {
  STOP = "STOP",
  STOPN = "STOP\n",
  STOPR = "STOP\r",
  STOPRN = "STOP\r\n",
}
export type RedisType = ReturnType<typeof createClient>;
