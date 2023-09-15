import { DataTypes, Model, Optional, Sequelize } from "sequelize";

const Account = (sequelize: Sequelize) => {
  const AccountModel = sequelize.define(
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

  return AccountModel;
};

export default Account;
