import { Request, Response, NextFunction } from "express";
import { validateField, errorResponse } from "../lib";
import { FIELDS, extendedRequestObject } from "../types";
import { authenticateAccount } from "../services/smsService";

export const Auth = {
  async validateCredentials(req: Request, res: Response, next: NextFunction) {
    try {
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
    } catch (error) {
      console.log(error);
      next(new Error("Problem authenticating account"));
    }
  },

  validateInput(req: Request, res: Response, next: NextFunction) {
    try {
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
    } catch (error) {
      next(error);
    }
  },
};
