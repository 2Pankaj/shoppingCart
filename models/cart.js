import sequelize from "../util/db.js";
import { Sequelize } from "sequelize";
const Cart = sequelize.define("Cart", {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
});
export default Cart;
