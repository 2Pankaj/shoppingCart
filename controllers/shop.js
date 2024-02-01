// const Product = require("../models/product");
import Product from "../models/product.js";

import Cart from "../models/cart.js";
import cartItem from "../models/cartItem.js";
import sequelize from "../util/db.js";
export const getProducts = async (req, res, next) => {
  Product.findAll().then((products) => {
    console.log("inside controller product", products);
    res.render("shop", {
      prods: products,
      pageTitle: "Shop",
      path: "/",
      hasProducts: products.length > 0,
      activeShop: true,
      productCSS: true,
      isAuthenticated: req.session.isLoggedIn,
    });
  });
};

export const getProduct = (req, res, next) => {
  console.log("///// inside getProduct");
  const prodId = req.params.productId;
  console.log("///////////////prodId ", prodId);
  Product.findByPk(prodId).then((product) => {
    console.log(product);
    res.render("shop/product-detail", {
      product: product,
      pageTitle: product.title,
      path: "/products",
      isAuthenticated: req.session.isLoggedIn,
    });
  });
};

export const getIndex = (req, res, next) => {
  // console.log("inside homepage controller");
  Product.findAll()
    .then((products) => {
      res.render("shop/index", {
        prods: products,
        pageTitle: "Shop",
        path: "/",
        isAuthenticated: req.session.isLoggedIn,
      });
    })
    .catch((err) => console.log(err));
};
// Product.belongsTo(User);
// User.hasMany(Product);
// User.hasOne(Cart);
// Cart.belongsTo(User);
// Cart.belongsToMany(Product, { through: cartItem });
// Product.belongsToMany(Cart, { through: cartItem });
export const getCart = async (req, res, next) => {
  try {
    const userId = req.session.user.id;

    const [currentUserCart, meta1] = await sequelize.query(
      "SELECT Carts.id FROM Carts WHERE Carts.userId = (:id)",
      {
        replacements: { id: userId },
      }
    );
    const [productFromUserCart, meta2] = await sequelize.query(
      "select cartItems.productId, cartItems.quantity FROM cartItems where cartItems.cartId = (:cartId)",
      {
        replacements: { cartId: currentUserCart[0].id },
      }
    );
    // console.log(
    //   "///////////////prods from current user cart ",
    //   productFromUserCart
    // );
    const Products = [];
    for (const p of productFromUserCart) {
      const [products] = await sequelize.query(
        "select * FROM products where products.id = (:prodId)",
        {
          replacements: { prodId: p.productId },
        }
      );
      products[0].quantity = p.quantity;
      Products.push(products[0]);
    }
    // console.log(
    //   "///////////////prods from current user cart ",
    //   Object(Products)
    // );
    res.render("shop/cart", {
      path: "/cart",
      pageTitle: "Your Cart",
      products: Products,
      isAuthenticated: req.session.isLoggedIn,
    });
  } catch (error) {
    console.log(error);
  }
  // req.session.user
  //   .getCart()
  //   .then((cart) => {
  //     return cart.getProducts();
  //   })
  //   .then((products) => {
  //     // console.log("////////////////from get cart ", products);
  //     res.render("shop/cart", {
  //       path: "/cart",
  //       pageTitle: "Your Cart",
  //       products: products,
  //       isAuthenticated: req.session.isLoggedIn,
  //     });
  //   })
  //   .catch((err) => console.log(err));
};

// Product.belongsTo(User);
// User.hasMany(Product);
// User.hasOne(Cart);
// Cart.belongsTo(User);
// Cart.belongsToMany(Product, { through: cartItem });
// Product.belongsToMany(Cart, { through: cartItem });
export const postCart = async (req, res, next) => {
  try {
    const prodId = req.body.productId;
    const userId = req.session.user.id;
    const [currentUserCart, meta1] = await sequelize.query(
      "SELECT Carts.id FROM Carts WHERE Carts.userId = (:id)",
      {
        replacements: { id: userId },
      }
    );
    console.log(
      "//////////////////from post cart prod id = ",
      prodId,
      currentUserCart,
      userId
    );

    const [productFromUserCart, meta2] = await sequelize.query(
      "select cartItems.productId, cartItems.quantity FROM cartItems where cartItems.cartId = (:cartId) and cartItems.productId = (:prodId) ",
      {
        replacements: { cartId: currentUserCart[0].id, prodId: prodId },
      }
    );
    if (productFromUserCart.length) {
      productFromUserCart[0].productId = Number(
        productFromUserCart[0].productId
      );
      productFromUserCart[0].quantity += 1;
      await sequelize.query(
        "UPDATE cartItems SET quantity = (:qty) where cartItems.cartId = (:cartId) and cartItems.productId = (:prodId)",
        {
          replacements: {
            qty: productFromUserCart[0].quantity,
            prodId: prodId,
            cartId: currentUserCart[0].id,
          },
        }
      );
    } else {
      productFromUserCart.push({});
      (productFromUserCart[0].productId = prodId),
        (productFromUserCart[0].quantity = 1);
      await sequelize.query(
        "INSERT INTO cartItems (quantity, cartId, productId, createdAt, updatedAt)VALUES (:qty, :cartId, :prodId, NOW(), NOW())",
        {
          replacements: {
            qty: productFromUserCart[0].quantity,
            prodId: prodId,
            cartId: currentUserCart[0].id,
          },
        }
      );
    }

    // console.log("////////////", productFromUserCart);

    console.log(productFromUserCart);
    res.redirect("/cart");
  } catch (error) {
    console.error("Error executing query:", error);
    res.status(500).send("Internal Server Error");
  }
};

export const postCartDeleteProduct = async (req, res, next) => {
  try {
    const prodId = req.body.productId;
    const userId = req.session.user.id;
    const [currentUserCart] = await sequelize.query(
      "select Carts.id from Carts where Carts.userId = (:id)",
      {
        replacements: { id: userId },
      }
    );
    await sequelize.query(
      "DELETE FROM cartItems WHERE cartItems.cartId = :cartId AND cartItems.productId = :prodId",
      {
        replacements: { cartId: currentUserCart[0].id, prodId: prodId },
      }
    );
    res.redirect("/cart");
  } catch (err) {
    console.log(err);
  }

  // Product.findById(prodId, (product) => {
  //   Cart.deleteProduct(prodId, product.price);
  //   res.redirect("/cart");
  // });
};

export const cartCheckOut = async (req, res, next) => {
  try {
    const userId = req.session.user.id;
    const [currentUserCart] = await sequelize.query(
      "select Carts.id from Carts where Carts.userId = (:id)",
      {
        replacements: { id: userId },
      }
    );
    const [currentUserCartProducts] = await sequelize.query(
      "select cartItems.productId , cartItems.quantity from cartItems where cartItems.cartId = :id",
      {
        replacements: { id: currentUserCart[0].id },
      }
    );
    const [orderId, meta] = await sequelize.query(
      "INSERT INTO orders(createdAt,updatedAt, userId) values (NOW(), NOW(), :id) ",
      {
        replacements: { id: userId },
      }
    );
    currentUserCartProducts.map(async (product) => {
      try {
        console.log("/////////////////// form map ", product);
        await sequelize.query(
          "INSERT INTO orderItems(quantity,createdAt,updatedAt,productId, orderId) values (:qty,NOW(), NOW(), :prodId, :orderId) ",
          {
            replacements: {
              qty: product.quantity,
              prodId: product.productId,
              orderId: orderId,
            },
          }
        );
        await sequelize.query(
          "DELETE FROM cartItems where cartItems.productId = :prodId and cartItems.cartId = :cartId",
          {
            replacements: {
              prodId: product.productId,
              cartId: currentUserCart[0].id,
            },
          }
        );
      } catch (err) {
        console.log(err);
      }
    });
    // res.render("orders", {
    //   orders: [
    //     { id: 1, products: [{ title: "abc", orderItem: { quantity: 1 } }] },
    //   ],
    // });

    res.redirect("/orders");
    // console.log("//////From cart checkOut ", currentUserCartProducts);
  } catch (error) {
    console.log(error);
  }
};

export const getOrders = async (req, res, next) => {
  const [finalTable] = await sequelize.query(
    "select orders.id, (orderItems.quantity), orderItems.productId, products.title from orders inner join orderItems on orderItems.orderId = orders.id inner join products on orderItems.productId = products.id where orders.userId = :userId order by orders.id",
    {
      replacements: { userId: req.session.user.id },
    }
  );
  // console.log("///////////// final table", finalTable);
  let orders = [];
  for (let i = 0; i < finalTable.length; i++) {
    const row = finalTable[i];
    let obj = {
      orderId: row.id,
      products: [],
    };
    let flag = 0;
    while (i < finalTable.length && finalTable[i].id == obj.orderId) {
      obj.products = [...obj.products, finalTable[i]];
      flag = 1;
      i++;
    }
    i -= flag;
    orders.push(obj);
  }

  // console.log("/////// final orders array ", orders);
  res.render("shop/orders", {
    orders: orders,
    path: "/orders",
    pageTitle: "Your Orders",
    isAuthenticated: req.session.isLoggedIn,
  });
};

export const getCheckout = (req, res, next) => {
  res.render("shop/checkout", {
    path: "/checkout",
    pageTitle: "Checkout",
    isAuthenticated: req.session.isLoggedIn,
  });
};
