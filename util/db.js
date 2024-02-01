import { Sequelize } from "sequelize";
const sequelize = new Sequelize("mydb", "root", "1234", {
  dialect: "mysql",
  host: "localhost",
});

export default sequelize;
