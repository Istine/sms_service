import { createClient } from "redis";
import { Account } from "./models/account";
import { PhoneNumber } from "./models/phoneNumber";
import express from "express";

export interface DatabaseContext {
  connect(): void;
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

export type PhoneModel = ReturnType<typeof PhoneNumber.prototype.define>;

export type AccountModel = ReturnType<typeof Account.prototype.define>;
export type RedisType = ReturnType<typeof createClient>;

export type ExpressApp = ReturnType<typeof express>;
