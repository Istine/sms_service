import { DataTypes, Sequelize } from "sequelize";

const PhoneNumber = (sequelize: Sequelize) => {
  const PhoneModel = sequelize.define(
    "phone_number",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      number: {
        type: DataTypes.STRING(40),
      },
      account_id: {
        type: DataTypes.INTEGER,
      },
    },
    {
      tableName: "phone_number",
      timestamps: false,
    }
  );

  return PhoneModel;
};

export default PhoneNumber;
