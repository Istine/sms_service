import { Request, Response, NextFunction } from "express";
import { errorResponse, successResponse } from "../lib";
import { FIELDS, TEXT } from "../types";
import { Account } from "../models/account";
import { PhoneNumber } from "../models/phoneNumber";
import { Redis } from "../services/redis";

export class Sms {
  private _phoneNumber!: ReturnType<typeof PhoneNumber.prototype.define>;
  private _account!: ReturnType<typeof Account.prototype.define>;
  private _redis!: Redis;

  constructor(
    account: ReturnType<typeof Account.prototype.define>,
    phoneNumber: ReturnType<typeof PhoneNumber.prototype.define>,
    redis: Redis
  ) {
    this._phoneNumber = phoneNumber;
    this._account = account;
    this._redis = redis;
  }

  async inboundSms(req: Request, res: Response, next: NextFunction) {
    const { from, to, text } = req.body;
    const accountExists = await this._account.findOne({
      //@ts-ignore
      where: { username: req.username, auth_id: req.password },
    });
    if (!accountExists) {
      return res.sendStatus(403);
    }

    await this.handleTextInput(text, from, to);

    const isToParamaterInDatabase = await this._phoneNumber.findOne({
      where: { number: to },
      include: [
        {
          model: this._account,
          where: {
            //@ts-ignore
            id: accountExists.id,
          },
        },
      ],
    });

    if (!isToParamaterInDatabase) {
      return res
        .status(404)
        .json(errorResponse(`${FIELDS.T0} parameter not found`));
    }

    return res.status(200).json(successResponse("inbound sms ok"));
  }

  async outboundSms(req: Request, res: Response, next: NextFunction) {
    const { from, to, text } = req.body;
    const accountExists = await this._account.findOne({
      //@ts-ignore
      where: { username: req.username, auth_id: req.password },
    });
    if (!accountExists) {
      return res.sendStatus(403);
    }

    const recordExists = await this.checkCacheStorage(from, to);

    if (recordExists) {
      return res
        .status(401)
        .json(
          errorResponse(`sms from ${from} to ${to}  blocked by STOP request`)
        );
    }

    const currentCount = await this.getRequestCount(from);

    if (currentCount >= 50) {
      return res
        .status(401)
        .json(errorResponse(`limit reached for from ${from}`));
    }

    const isFromParamaterInDatabase = await this._phoneNumber.findOne({
      where: { number: from },
      include: [
        {
          model: this._account,
          where: {
            //@ts-ignore
            id: accountExists.id,
          },
        },
      ],
    });

    if (!isFromParamaterInDatabase) {
      return res
        .status(404)
        .json(errorResponse(`${FIELDS.FROM} parameter not found`));
    }

    if (currentCount === 0) {
      this._redis.upSert(from, to);
    } else {
      this._redis.increment(from);
    }

    return res.status(200).json(successResponse("outbound sms ok"));
  }

  private async getRequestCount(from: string): Promise<number> {
    return this._redis.get(from);
  }

  private async handleTextInput(
    text: string,
    from: string,
    to: string
  ): Promise<void> {
    if (
      text === TEXT.STOP ||
      text === TEXT.STOPN ||
      text === TEXT.STOPR ||
      text === TEXT.STOPRN
    ) {
      await this._redis.set(from, to);
    }
  }

  private async checkCacheStorage(
    key: string,
    value: string
  ): Promise<boolean> {
    return await this._redis.exists(key, value);
  }
}
