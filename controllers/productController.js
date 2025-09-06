import { body, validationResult } from "express-validator";
import { queryUpdateProduct, queryDeleteProduct, queryGetProduct } from "../db/query.js";

export const getProduct = async (req, res) => {
  const productName = req.params.name;
  try {
    const product = await queryGetProduct(productName);
    console.log(product);
    res.render("product", {
      title: productName,
      product: product[0],
    });
  } catch (err) {
    console.err(err);
  }
};

export const postProduct = (req, res) => {
  const {} = req.body;
  res.redirect("/inventory");
};

export const getEditProduct = (req, res) => {
  res.render("edit", {
    title: "Edit",
  });
};

export const putEditProduct = (req, res) => {};

export const deleteProduct = async (req, res) => {
  const product = req.body;
  await queryDeleteProduct(product);
  res.status(204).send();
  res.redirect("/inventory");
};

/*
    feat:
        /edit to edit a product
        /delete to delete a product
*/
