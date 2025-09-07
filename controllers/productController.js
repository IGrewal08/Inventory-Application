import { body, validationResult } from "express-validator";
import * as db from "../db/query.js";

export const getProduct = async (req, res) => {
  const productName = req.params.name;
  try {
    const product = await db.queryGetProduct(productName);
    res.render("product", {
      title: productName,
      product: product,
    });
  } catch (err) {
    console.err(err);
  }
};

export const getEditProduct = async (req, res) => {
  const { name } = req.params;
  try {
    if (req.method === "GET") {
      const product = await db.queryGetProduct(name);
      const genres = await db.queryAllGenres();
      const developers = await db.queryAllDevelopers();

      const productDevelopers = product.developers.includes(",")
        ? product.developers.split(", ")
        : [product.developers];
      res.render("edit", {
        title: "Edit",
        name: name,
        product: product,
        productDevelopers: productDevelopers,
        productGenres: productGenres,
        developers: developers,
        genres: genres,
      });
      const productGenres = product.genres.includes(",")
        ? product.genres.split(", ")
        : [product.genres];
    } else if (req.method === "PUT") {
    }
  } catch (err) {
    console.err(err);
  }
};

export const deleteProduct = async (req, res) => {
  const product = req.body;
  await db.queryDeleteProduct(product);
  res.status(204).send();
  res.redirect("/inventory");
};

export const getNewProductForm = (req, res) => {
  const {} = req.body;
  res.redirect("/inventory");
};

export const postNewProduct = (req, res) => {};
