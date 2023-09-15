import express, { NextFunction, Request, Response } from "express";
import { config } from "dotenv";
import routes from "./controllers/sms";
import db from "./models";

const bootStrap = () => {
  config();
  const app = express();
  const PORT = process.env.PORT || 4000;
  app.use(express.json());

  app.use(express.urlencoded({ extended: true }));

  app.use("", routes);

  app.all("*", (req: Request, res: Response) => {
    res.sendStatus(405);
  });

  app.use(
    (_error: Error, _req: Request, res: Response, _next: NextFunction) => {
      return res.status(400).json({ message: "", error: "unknown failure" });
    }
  );

  db.sequelize
    .sync()
    .then(() => {
      console.log("Synced db.");
    })
    .catch((err: Error) => {
      console.log("Failed to sync db: " + err.message);
    });

  app.listen(PORT, async () => {
    console.log(`App is Listening on localhost:${PORT}`);
  });
};

bootStrap();
