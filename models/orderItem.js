import sequelize from "../util/db.js";
import { Sequelize } from "sequelize";
const orderItem = sequelize.define("orderItem", {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  quantity: {
    type: Sequelize.INTEGER,
    defaultValue: 0,
  },
});
export default orderItem;
