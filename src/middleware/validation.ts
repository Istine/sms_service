import { Request, Response, NextFunction } from "express";
import { validateField, errorResponse } from "../lib";
import { FIELDS, extendedRequestObject } from "../types";
import { asyncErrorWrapper } from "./error";
import { authenticateAccount } from "../services/smsService";

const validateInput = asyncErrorWrapper(
  (req: Request, res: Response, next: NextFunction) => {
    const { from = "", to = "", text = "" } = req.body;
    const fromFieldOrError = validateField(from, FIELDS.FROM);
    if (fromFieldOrError)
      return res.status(403).json(errorResponse(fromFieldOrError));
    const toFieldOrError = validateField(to, FIELDS.T0);
    if (toFieldOrError)
      return res.status(403).json(errorResponse(toFieldOrError));
    const textFieldOrError = validateField(text, FIELDS.TEXT);
    if (textFieldOrError)
      return res.status(403).json(errorResponse(textFieldOrError));

    return next();
  }
);

export const validateCredentials = asyncErrorWrapper(
  async (req: Request, res: Response, next: NextFunction) => {
    const header = req.headers.authorization?.split(" ")[1];
    if (!header) {
      return res.sendStatus(403);
    }
    const decoded = atob(header as string);
    const [username, password] = decoded.split(":");

    const accountExists: { id: number } = await authenticateAccount({
      username,
      password,
    });

    if (!accountExists) {
      return res.sendStatus(403);
    }

    (req as extendedRequestObject).account_id = accountExists.id;
    next();
  }
);

export default validateInput;
