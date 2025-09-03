import { body, validationResult } from "express-validator";

export const getHomePage = (req, res) => {
  res.render("index", {
    title: "Home",
  });
};

export const getInventoryList = (req, res) => {
  res.render("inventory", {
    title: "Inventory",
  });
};

export const getInventorySearch = (req, res) => {
    const { search } = req.params;
  res.render("search", {
    title: "Search",
  });
};

export const getCategories = (req, res) => {
  res.render("category", {
    title: "Categories",
  });
};