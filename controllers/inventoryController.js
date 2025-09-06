import { body, validationResult } from "express-validator";
import {
  queryAllInventory,
  queryInventoryByFilter,
  queryProductBySearch,
  queryAllGenres,
} from "../db/query.js";

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
      products = await queryInventoryByFilter(req.query);
    } else {
      products = await queryAllInventory();
    }
    const genres = await queryAllGenres();
    res.render("inventory", {
      title: "Inventory",
      products: products,
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
    const products = await queryProductBySearch(search);
    res.render("search", {
      title: "Search",
      products: products,
    });
  } catch (err) {
    console.error(err);
  }
};

export const getCategories = async (req, res) => {
  const genres = await queryAllGenres();
  res.render("category", {
    title: "Categories",
    genres: genres,
  });
};
