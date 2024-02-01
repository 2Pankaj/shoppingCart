import sequelize from "../util/db.js";
import bcrypt from "bcryptjs";
// import { client } from "../util/mailTrap.js";

import { MailtrapClient } from "mailtrap";

const TOKEN = "baf8b361ef7cad62f9ad88a35051559d";

const client = new MailtrapClient({ token: TOKEN });
import { validationResult } from "express-validator";

export const getLogin = (req, res, next) => {
  res.render("auth/login", {
    path: "/login",
    pageTitle: "Login",
    isAuthenticated: req.session.isLoggedIn,
  });
};
export const postLogin = async (req, res, next) => {
  try {
    const [existingUser] = await sequelize.query(
      "SELECT * FROM users where users.email = (:email)",
      {
        replacements: { email: req.body.email },
      }
    );
    if (!existingUser.length) {
      return res.redirect("/login");
    }
    const isValidPassword = await bcrypt.compare(
      req.body.password,
      existingUser[0].password
    );
    if (!isValidPassword) {
      return res.redirect("/login");
    }
    req.session.isLoggedIn = true;
    // req.user = {
    //   id: existingUser[0].id,
    //   email: existingUser[0].email,
    //   isLoggedIn: req.session.isLoggedIn,
    // };
    // req.user = existingUser[0];
    req.session.user = existingUser[0];
    // req.user.id = existingUser[0].id;
    // console.log("//////////////from post login ", req.user);
    return res.redirect("/");
  } catch (error) {
    console.log(error);
  }
};
export const postLogout = (req, res, next) => {
  req.session.destroy((err) => {
    console.log(err);
    res.redirect("/");
  });
};

export const getSignup = (req, res, next) => {
  res.render("auth/signup", {
    path: "/signup",
    pageTitle: "Signup",
    isAuthenticated: false,
  });
};

export const postSignup = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (errors.array().length) {
      console.log("///////////// errors : ", errors.array());
      return res.status(400);
    }
    if (!req.body.email || !req.body.password) {
      return res.send({
        messsage: "Provide all the fields",
      });
    }
    const [existingUser] = await sequelize.query(
      "SELECT * FROM users where users.email = (:email)",
      {
        replacements: { email: req.body.email },
      }
    );
    if (existingUser.length) {
      return res.redirect("/login");
    }
    const hashedPassword = await bcrypt.hash(req.body.password, 12);
    const [result] = await sequelize.query(
      "INSERT INTO users(email, password, createdAt, updatedAt) values(:email, :password, NOW(), NOW()) ",
      {
        replacements: { email: req.body.email, password: hashedPassword },
      }
    );
    console.log("//////////from post signup ", result);
    await sequelize.query(
      "INSERT INTO Carts(createdAt, updatedAt, userId) values(NOW(), NOW(), :userId) ",
      {
        replacements: { userId: result },
      }
    );
    res.redirect("/login");
    await client.send({
      from: { name: "Mailtrap Test", email: "ajayolyan@gmail.com" },
      to: [{ email: req.body.email }],
      subject: "Hello from Mailtrap!",
      text: "Signup successfuly",
    });
  } catch (error) {
    console.log(error);
  }
};

export const getReset = (req, res, next) => {
  res.render("auth/reset", {
    path: "/reset",
    pageTitle: "Reset Password",
    isAuthenticated: req.user.isLoggedIn,
    // errorMessage: message,
  });
};
