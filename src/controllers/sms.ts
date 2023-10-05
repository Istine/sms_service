import { Request, Response, NextFunction } from "express";
import { errorResponse, successResponse } from "../lib";
import { FIELDS, extendedRequestObject } from "../types";
import express from "express";
import db from "../models";
import { Auth } from "./auth";
import { findrByIdAndPhoneNumber } from "../services/smsService";
import {
  TextStopHandler,
  checkCacheStorage,
  getRequestCount,
} from "../services/redis";
import { asyncErrorWrapper } from "../middleware/error";

const PhoneNumber = db.PhoneNumber;

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
  async (req: Request, res: Response, next: NextFunction) => {
    const { from, to, text } = req.body;

    const recordExists = await checkCacheStorage(from, to);

    if (recordExists) {
      return res
        .status(401)
        .json(
          errorResponse(`sms from ${from} to ${to}  blocked by STOP request`)
        );
    }

    const currentCount = await getRequestCount(btoa(from));

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

    // if (currentCount === 0) {
    //   await upsertKey(redis, btoa(from), 1);
    // } else {
    //   await incrementKey(redis, btoa(from));
    // }

    return res.status(200).json(successResponse("outbound sms ok"));
  }
);
export default router;
