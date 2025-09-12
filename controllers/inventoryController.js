import { body, query, validationResult } from "express-validator";
import * as db from "../db/query.js";

const validateSearch = [
  query("search")
    .isString()
    .notEmpty()
    .withMessage("Search must contain a query"),
];

const validateCategory = [
  body("developer")
    .if(query("type").equals("developer"))
    .isString()
    .notEmpty()
    .withMessage("Must contain a string query for developer"),
  body("genre")
    .if(query("type").equals("genre"))
    .isString()
    .notEmpty()
    .withMessage("Must contain a string query for genre"),
];

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

export const getInventorySearch = [
  validateSearch,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log(errors);
      return res.status(400).render("search", {
        title: "Search",
        products: products,
        errors: errors.array(),
      });
    }
    try {
      const { search } = req.query;
      const products = await db.queryProductBySearch(search);
      res.render("search", {
        title: "Search",
        products: products,
      });
    } catch (err) {
      console.error(err);
    }
  },
];

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
  res.render("categoryForm", {
    title: "Add Category",
    type: req.params.type,
  });
};

export const postCategoriesForm = [
  validateCategory,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log(errors);
      return res.status(400).render("categoryForm", {
        title: "Add",
        type: req.params.type,
        errors: errors.array(),
      });
    }
    try {
      if (req.params.type === "genre") {
        await db.queryPostGenre(req.body.genre);
      } else if (req.params.type === "developer") {
        await db.queryPostDeveloper(req.body.developer);
      }
      res.redirect("/inventory");
    } catch (err) {
      console.error(err);
    }
  },
];
