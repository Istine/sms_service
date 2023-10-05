import { Request, Response, NextFunction } from "express";
import { RATE_LIMIT, errorResponse, successResponse } from "../lib";
import { FIELDS, extendedRequestObject } from "../types";
import express from "express";
import db from "../models";
import { Auth } from "../middleware/auth";
import { findrByIdAndPhoneNumber } from "../services/smsService";
import {
  TextStopHandler,
  checkCacheStorage,
  rateLimit,
} from "../services/redis";
import { asyncErrorWrapper } from "../middleware/error";

const router = express.Router();

router.post(
  "/inbound/sms",
  Auth.validateCredentials,
  Auth.validateInput,
  asyncErrorWrapper(async (req: Request, res: Response, next: NextFunction) => {
    const { from, to, text } = req.body;

    const isToParamaterInDatabase = await findrByIdAndPhoneNumber(
      (req as extendedRequestObject).account_id,
      to
    );

    if (!isToParamaterInDatabase) {
      return res
        .status(404)
        .json(errorResponse(`${FIELDS.T0} parameter not found`));
    }

    await TextStopHandler(text, from, to);

    return res.status(200).json(successResponse("inbound sms ok"));
  })
);

router.post(
  "/outbound/sms",
  Auth.validateCredentials,
  Auth.validateInput,
  asyncErrorWrapper(async (req: Request, res: Response, next: NextFunction) => {
    const { from, to, text } = req.body;

    const isFromParamaterInDatabase = await findrByIdAndPhoneNumber(
      (req as extendedRequestObject).account_id,
      from
    );

    if (!isFromParamaterInDatabase) {
      return res
        .status(404)
        .json(errorResponse(`${FIELDS.FROM} parameter not found`));
    }

    const recordExistsInCache = await checkCacheStorage(from, to, text);

    if (recordExistsInCache) {
      return res
        .status(401)
        .json(
          errorResponse(`sms from ${from} to ${to}  blocked by STOP request`)
        );
    }

    const currentCount = await rateLimit({ ip: req.ip }, from);

    if (currentCount > RATE_LIMIT) {
      return res
        .status(401)
        .json(errorResponse(`limit reached for from ${from}`));
    }

    return res.status(200).json(successResponse("outbound sms ok"));
  })
);
export default router;
