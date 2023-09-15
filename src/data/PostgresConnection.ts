import { Sequelize } from "sequelize";
import { DatabaseContext } from "../types";
import { Account } from "../models/account";
import { PhoneNumber } from "../models/phoneNumber";
import { Sms } from "../controllers/sms";
import { Redis } from "../services/redis";

export class PostgresConnection implements DatabaseContext {
  private _sequelize: Sequelize;

  constructor() {
    this._sequelize = new Sequelize(
      "postgres://postgres:postgres@db:5432/sms_db"
    );
  }

  async connect() {
    try {
      await this._sequelize.authenticate();
      console.log("connected to db");
    } catch (error) {
      console.log(error as Error);
    }
  }

  async initializeServices(): Promise<any> {
    //defininf database models
    const PhoneNumberModel = new PhoneNumber(this._sequelize).define();
    const AccountModel = new Account(this._sequelize).define();

    //creating associations
    AccountModel.hasMany(PhoneNumberModel, {
      foreignKey: "account_id",
      onDelete: "NO ACTION",
      onUpdate: "NO ACTION",
    });

    //updating db schema if necessary
    await this._sequelize.sync({ alter: true });

    const RedisService = new Redis();

    //connecting to redis
    await RedisService.connect();

    //instance of Sms class with dependencies injected
    return new Sms(AccountModel, PhoneNumberModel, RedisService);
  }
}
