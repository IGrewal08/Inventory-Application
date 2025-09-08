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
      console.log('test');
      await db.queryUpdateProduct(req.body);
      res.redirect("/inventory");
    }
  } catch (err) {
    console.error(err);
  }
};

export const deleteProduct = async (req, res) => {
  const product = req.body;
  try {
    await db.queryDeleteProduct(product);
  res.status(204).send();
  res.redirect("/inventory");
  } catch (err) {
    console.error(err);
  }
};

export const getNewProductForm = async (req, res) => {
  try {
    const genres = await db.queryAllGenres();
    const developers = await db.queryAllDevelopers();
    if (req.method === 'GET') {
      res.render('new', {
        title: 'New',
        genres: genres,
        developers: developers,
      });
    } else if (req.method === 'POST') {
      console.log(req.body);
      await db.queryPostNewProduct(req.body);
      res.redirect('/inventory');
    }
  } catch (err) {
    console.error(err);
  }
};
