import sequelize from "../util/db.js";
import { Sequelize } from "sequelize";
const cartItem = sequelize.define("cartItem", {
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
export default cartItem;
