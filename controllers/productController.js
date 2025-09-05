import { body, validationResult } from "express-validator";
import { queryUpdateProduct, queryDeleteProduct } from "../db/query.js";

export const getProduct = (req, res) => {
  const productName = req.param;
  res.render("product", {
    title: productName,
  });
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
