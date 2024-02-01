import sequelize from "../util/db.js";
import { Sequelize } from "sequelize";
const Order = sequelize.define("order", {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
});
export default Order;
