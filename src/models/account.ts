import { DataTypes, Sequelize, Model } from "sequelize";

export class Account {
  private sequelize!: Sequelize;

  constructor(sequelize: any) {
    this.sequelize = sequelize;
  }

  define() {
    const Account = this.sequelize.define(
      "account",
      {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
          allowNull: false,
        },
        auth_id: {
          type: DataTypes.STRING(40),
        },
        username: {
          type: DataTypes.STRING(30),
        },
      },
      {
        tableName: "account",
        timestamps: false,
      }
    );
    return Account;
  }
}
