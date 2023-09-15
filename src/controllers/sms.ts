import { Request, Response, NextFunction } from "express";
import { errorResponse, successResponse } from "../lib";
import { FIELDS, TEXT } from "../types";
import express from "express";
import db from "../models";
import {
  createRedisClient,
  getKey,
  incrementKey,
  keyExists,
  setKey,
  upsertKey,
} from "../services/redis";
import { configOptions } from "../config";
import { Auth } from "./auth";

const Account = db.Account;
const PhoneNumber = db.PhoneNumber;

const router = express.Router();

const redis = createRedisClient(configOptions.redisUrl);

router.post(
  "/inbound/sms",
  Auth.validateCredentials,
  Auth.validateInput,
  async (req: Request, res: Response, next: NextFunction) => {
    const { from, to, text } = req.body;

    const accountExists = await Account.findOne({
      //@ts-ignore
      where: { username: req.username, auth_id: req.password },
    });

    if (!accountExists) {
      return res.sendStatus(403);
    }

    await handleTextInput(text, from, to);

    const isToParamaterInDatabase = await PhoneNumber.findOne({
      //@ts-ignore
      where: { number: to, account_id: accountExists.id },
    });

    if (!isToParamaterInDatabase) {
      return res
        .status(404)
        .json(errorResponse(`${FIELDS.T0} parameter not found`));
    }

    return res.status(200).json(successResponse("inbound sms ok"));
  }
);

router.post(
  "/outbound/sms",
  Auth.validateCredentials,
  Auth.validateInput,
  async (req: Request, res: Response, next: NextFunction) => {
    const { from, to, text } = req.body;
    const accountExists = await Account.findOne({
      //@ts-ignore
      where: { username: req.username, auth_id: req.password },
    });
    if (!accountExists) {
      return res.sendStatus(403);
    }

    const recordExists = await checkCacheStorage(from, to);

    if (recordExists) {
      return res
        .status(401)
        .json(
          errorResponse(`sms from ${from} to ${to}  blocked by STOP request`)
        );
    }

    const currentCount = await getRequestCount(from);

    if (currentCount >= 50) {
      return res
        .status(401)
        .json(errorResponse(`limit reached for from ${from}`));
    }

    const isFromParamaterInDatabase = await PhoneNumber.findOne({
      //@ts-ignore
      where: { number: from, account_id: accountExists.id },
    });

    if (!isFromParamaterInDatabase) {
      return res
        .status(404)
        .json(errorResponse(`${FIELDS.FROM} parameter not found`));
    }

    if (currentCount === 0) {
      await upsertKey(redis, from, 1);
    } else {
      await incrementKey(redis, from);
    }

    return res.status(200).json(successResponse("outbound sms ok"));
  }
);

const getRequestCount = async (from: string): Promise<number> => {
  return await getKey(redis, from);
};

const handleTextInput = async (
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
    await setKey(redis, from, to);
  }
};

const checkCacheStorage = async (
  key: string,
  value: string
): Promise<boolean> => {
  return await keyExists(redis, key, value);
};

export default router;
