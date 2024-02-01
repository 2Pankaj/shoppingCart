import Product from "../models/product.js";
import sequelize from "../util/db.js";
export function getAddProduct(req, res, next) {
  Product.findAll().then((products) => {
    res.render("admin/edit-product", {
      pageTitle: "Add Product",
      path: "/admin/add-product",
      formsCSS: true,
      productCSS: true,
      activeAddProduct: true,
      editing: false,
      isAuthenticated: req.session.isLoggedIn,
    });
  });
}

export const postAddProduct = async (req, res, next) => {
  try {
    const userId = req.session.user.id;
    const [result] = await sequelize.query(
      "insert into products(title, image, description, price, createdAt, updatedAt, userId) values (:title, :image, :des, :price, NOW(), NOW(), :userId)",
      {
        replacements: {
          title: req.body.title,
          image: req.body.image,
          des: req.body.description,
          price: req.body.price,
          userId: userId,
        },
      }
    );
    return res.redirect("/products");
  } catch (error) {
    console.log(error);
  }
};

export const getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect("/");
  }
  const prodId = req.params.productId;
  Product.findByPk(prodId)
    .then((product) => {
      res.render("admin/edit-product", {
        pageTitle: "Edit Product",
        path: "/admin/edit-product",
        editing: editMode,
        product: product,
        isAuthenticated: req.session.isLoggedIn,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

export const postEditProduct = (req, res, next) => {
  const prodId = req.body.productId;
  const updatedTitle = req.body.title;
  const updatedPrice = req.body.price;
  const updatedImageUrl = req.body.image;
  const updatedDesc = req.body.description;
  console.log("////////////////////// post edit products ", prodId);
  Product.findByPk(prodId)
    .then((product) => {
      (product.title = updatedTitle),
        (product.price = updatedPrice),
        (product.image = updatedImageUrl),
        (product.description = updatedDesc);

      // console.log("//////////////////in first then");
      return product.save();
    })
    .then((product) => {
      // console.log("/////////////in second then", product);
      res.redirect("/admin/products");
    })

    .catch((err) => {
      console.log(err);
    });
};

export const getProducts = (req, res, next) => {
  Product.findAll()
    .then((products) => {
      console.log("inside getProducts");
      console.log(JSON.stringify(products));
      res.render("admin/products", {
        prods: products,
        pageTitle: "Admin Products",
        path: "/admin/products",
        isAuthenticated: req.session.isLoggedIn,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

export const postDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  Product.destroy({
    where: {
      id: prodId,
    },
  })
    .then((result) => {
      console.log("Product Deleted");
      res.redirect("/admin/products");
    })
    .catch((err) => {
      console.log(err);
    });
};
