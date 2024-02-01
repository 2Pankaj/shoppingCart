import { Sequelize } from "sequelize";
import sequelize from "../util/db.js";

const User = sequelize.define("user", {
  id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: Sequelize.STRING,
    // allowNull: false,
  },
  address: {
    type: Sequelize.STRING,
    // allowNull: false,
  },
  phone: {
    type: Sequelize.STRING,
    // allowNull: false,
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false,
  },
});

export default User;
