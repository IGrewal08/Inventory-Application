import { body, validationResult } from "express-validator";
import * as db from "../db/query.js";

export const getHomePage = (req, res) => {
  res.render("index", {
    title: "Home",
  });
};

export const getInventoryList = async (req, res) => {
  const sorts = [
    { value: undefined, message: "Relevance" },
    { value: "name_ASC", message: "Name A-Z" },
    { value: "name_DESC", message: "Name Z-A" },
    { value: "price_DESC", message: "Price $$$-$" },
    { value: "price_ASC", message: "Price $-$$$" },
  ];

  try {
    let products;
    if (req.query.genre != undefined || req.query.sort != undefined) {
      products = await db.queryInventoryByFilter(req.query);
    } else {
      products = await db.queryAllInventory();
    }
    const developers = await db.queryAllDevelopers();
    const genres = await db.queryAllGenres();
    res.render("inventory", {
      title: "Inventory",
      products: products,
      developers: developers,
      genres: genres,
      sorts: sorts,
      queries: req.query,
    });
  } catch (err) {
    console.error(err);
  }
};

export const getInventorySearch = async (req, res) => {
  const { search } = req.query;
  try {
    const products = await db.queryProductBySearch(search);
    res.render("search", {
      title: "Search",
      products: products,
    });
  } catch (err) {
    console.error(err);
  }
};

export const getCategories = async (req, res) => {
  try {
    const genres = await db.queryAllGenres();
    const developers = await db.queryAllDevelopers();
    res.render("category", {
      title: "Categories",
      genres: genres,
      developers: developers,
    });
  } catch (err) {
    console.error(err);
  }
};

export const getCategoriesForm = async (req, res) => {
  if (req.method === "GET") {
    res.render("categoryForm", {
      title: "Add Category",
      type: req.params.type,
    });
  } else if (req.method === "POST") {
    try {
      if (req.params.type === 'genre') {
        await db.queryPostGenre(req.body.genre);
      } else if (req.params.type === 'developer') {
        await db.queryPostDeveloper(req.body.developer);
      }
      res.redirect("/inventory");
    } catch (err) {
      console.error(err);
    }
  }
};
