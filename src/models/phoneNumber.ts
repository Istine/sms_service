import { DataTypes, Sequelize } from "sequelize";
export class PhoneNumber {
  private sequelize!: Sequelize;

  constructor(sequelize: any) {
    this.sequelize = sequelize;
  }

  define() {
    const phoneNumber = this.sequelize.define(
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
    return phoneNumber;
  }
}
