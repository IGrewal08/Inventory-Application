import { body, validationResult } from "express-validator";
import * as db from "../db/query.js";

const validateUser = [
  body("name")
    .if((value, { req }) => req.method === 'POST')
    .isString()
    .notEmpty()
    .withMessage("Name must contain a string"),
  body("price")
    .if((value, { req }) => req.method === 'POST')
    .isNumeric()
    .notEmpty()
    .withMessage("Must contain a numeric query"),
  body("quantity")
    .if((value, { req }) => req.method === 'POST')
    .isInt()
    .notEmpty()
    .withMessage("Must contain a integer query"),
  body("description")
    .if((value, { req }) => req.method === 'POST')
    .trim()
    .isString()
    .notEmpty()
    .withMessage("Must contain a string query"),
  body("developer")
    .if((value, { req }) => req.method === 'POST')
    .isArray()
    .notEmpty()
    .withMessage("Invalid values"),
  body("genre")
    .if((value, { req }) => req.method === 'POST')
    .isArray()
    .notEmpty()
    .withMessage("Invalid values"),
];

export const getProduct = async (req, res) => {
  try {
    const productName = req.params.name;
    const product = await db.queryGetProduct(productName);
    res.render("product", {
      title: productName,
      product: product,
    });
  } catch (err) {
    console.err(err);
  }
};

export const getEditProduct = [validateUser, async (req, res) => {
  const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).render("edit", {
        title: "Edit",
        name: req.param.name,
        product: product,
        productDevelopers: productDevelopers,
        productGenres: productGenres,
        developers: developers,
        genres: genres,
        errors: errors.array(),
      });
    }
  try {
    const { name } = req.params;
    if (req.method === "GET") {
      const product = await db.queryGetProduct(name);
      const genres = await db.queryAllGenres();
      const developers = await db.queryAllDevelopers();
      const productDevelopers = product.developers.includes(",")
        ? product.developers.split(", ")
        : [product.developers];
      const productGenres = product.genres.includes(",")
        ? product.genres.split(", ")
        : [product.genres];
      res.render("edit", {
        title: "Edit",
        name: name,
        product: product,
        productDevelopers: productDevelopers,
        productGenres: productGenres,
        developers: developers,
        genres: genres,
      });
    } else if (req.method === "POST") {
      await db.queryUpdateProduct(req.file, req.body);
      res.redirect("/inventory");
    }
  } catch (err) {
    console.error(err);
  }
}];

export const deleteProduct = async (req, res) => {
  try {
    const product = req.params.name;
    await db.queryDeleteProduct(product);
    res.redirect("/inventory");
  } catch (err) {
    console.error(err);
  }
};

export const getNewProductForm = [validateUser, async (req, res) => {
  const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).render("new", {
        title: "New",
        genres: genres,
        developers: developers,
        errors: errors.array(),
      });
    }
  try {
    const genres = await db.queryAllGenres();
    const developers = await db.queryAllDevelopers();
    if (req.method === "GET") {
      res.render("new", {
        title: "New",
        genres: genres,
        developers: developers,
      });
    } else if (req.method === "POST") {
      await db.queryPostNewProduct(req.file, req.body);
      res.redirect("/inventory");
    }
  } catch (err) {
    console.error(err);
  }
}];
