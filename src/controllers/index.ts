import express, { NextFunction, Request, Response } from "express";
import { PostgresConnection } from "../data/PostgresConnection";
import { Sms } from "./sms";
import { Auth } from "./auth";
import { ExpressApp } from "../types";

export class App {
  static async run(connection: PostgresConnection) {
    const app = express();
    await App.setup(app, connection);
    return app;
  }

  private static async setup(
    app: ExpressApp,
    pgConnection: PostgresConnection
  ) {
    const PORT = process.env.PORT || 4000;
    app.use(express.json());

    const SMS_CONTROLLERS: Sms = await pgConnection.initializeServices();

    app.post(
      "/inbound/sms",
      Auth.validateCredentials,
      Auth.validateInput,
      SMS_CONTROLLERS.inboundSms
    );

    app.post(
      "/outbound/sms",
      Auth.validateCredentials,
      Auth.validateInput,
      SMS_CONTROLLERS.outboundSms
    );

    app.all("*", (req: Request, res: Response) => {
      res.sendStatus(405);
    });

    app.use(
      (_error: Error, _req: Request, res: Response, _next: NextFunction) => {
        return res.status(400).json({ message: "", error: "unknown failure" });
      }
    );

    app.listen(PORT, async () => {
      await pgConnection.connect();
      console.log(`App is Listening on localhost:${PORT}`);
    });
  }
}
