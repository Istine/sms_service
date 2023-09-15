import { Sequelize } from "sequelize";
import { configOptions } from "../config";
import Account from "./account";
import PhoneNumber from "./phoneNumber";
const sequelize = new Sequelize(configOptions.databaseUrl as string);

const db: { [key: string]: any } = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.Account = Account(sequelize);
db.PhoneNumber = PhoneNumber(sequelize);

export default db;
