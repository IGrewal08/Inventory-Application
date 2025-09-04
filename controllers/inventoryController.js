import { body, validationResult } from "express-validator";
import query from "../db/query";

export const getHomePage = (req, res) => {
  res.render("index", {
    title: "Home",
  });
};

export const getInventoryList = async (req, res) => {
  const inventoryList = await query.getAllInventory();
  res.render("inventory", {
    title: "Inventory",
    products: inventoryList,
  });
};

export const getInventorySearch = async (req, res) => {
  const { search } = req.params;
  const searchList = await query.getInventorySearch(search);
  res.render("search", {
    title: "Search",
    products: searchList,
  });
};

export const getCategories = (req, res) => {
  res.render("category", {
    title: "Categories",
  });
};
