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
      "postgres://my_user:password@db:5432/sms_db"
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
    const PhoneNumberModel = new PhoneNumber(this._sequelize).define();
    const AccountModel = new Account(this._sequelize).define();
    AccountModel.hasMany(PhoneNumberModel, {
      foreignKey: "account_id",
      onDelete: "NO ACTION",
      onUpdate: "NO ACTION",
    });
    await this._sequelize.sync({ alter: true });
    const RedisService = new Redis();
    await RedisService.connect();
    return new Sms(AccountModel, PhoneNumberModel, RedisService);
  }
}
