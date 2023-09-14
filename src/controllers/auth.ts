import { Request, Response, NextFunction } from "express";
import { validateField, errorResponse } from "../lib";
import { FIELDS } from "../types";

export class Auth {
  static validateCredentials(req: Request, res: Response, next: NextFunction) {
    try {
      const header = req.headers.authorization?.split(" ")[1];
      if (!header) {
        return res.sendStatus(403);
      }
      const decoded = atob(header as string);
      const [username, password] = decoded.split(":");
      //@ts-ignore
      req.username = username;
      //@ts-ignore
      req.password = password;
      next();
    } catch (error) {
      next(new Error("Problem authenticating account"));
    }
  }

  static validateInput(req: Request, res: Response, next: NextFunction) {
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
  }
}
