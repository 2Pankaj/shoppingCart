import express from "express";
import urlencoded from "body-parser";
import { get404 } from "./controllers/error.js";
import { fileURLToPath } from "url";
import { join, dirname } from "path";
import sequelize from "./util/db.js";
import Product from "./models/product.js";
import User from "./models/user.js";
import adminRoutes from "./routes/admin.js";
import shopRoutes from "./routes/shop.js";
import authRoutes from "./routes/auth.js";
import Cart from "./models/cart.js";
import cartItem from "./models/cartItem.js";
import orderItem from "./models/orderItem.js";
import Order from "./models/order.js";
import session from "express-session";
import MySQLStore from "express-mysql-session";

const app = express();
let store = MySQLStore(session);
store = new store({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "1234",
  database: "mydb",
});
app.use(
  session({
    secret: "session secrete",
    resave: false,
    saveUninitialized: true,
    store: store,
  })
);
const fileUrl = fileURLToPath(import.meta.url);
const __dirname = dirname(fileUrl);

app.set("view engine", "ejs");
app.set("views", "views");

app.use(express.urlencoded({ extended: false }));

// Set up the static file serving middleware correctly
app.use(express.static(join(__dirname, "public")));

// app.use((req, res, next) => {
//   const user = User.findByPk(1)
//     .then((user) => {
//       req.user = user;
//       next();
//     })
//     .catch((err) => console.log(err));
// });

Product.belongsTo(User);
User.hasMany(Product);
User.hasOne(Cart);
Cart.belongsTo(User);
Cart.belongsToMany(Product, { through: cartItem });
Product.belongsToMany(Cart, { through: cartItem });
Product.belongsToMany(Order, { through: orderItem });
Order.hasMany(Product);
User.hasMany(Order);
Order.belongsTo(User);

app.use("/admin", adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);
app.use(get404);

sequelize
  .sync()
  // .sync({ force: true })
  .then((result) => {
    app.listen(3000, () => {
      console.log("server started at 3000");
    });
  })
  .catch((err) => {
    console.log(err);
  });
