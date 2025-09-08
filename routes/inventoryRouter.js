import { Router } from "express";
import * as inventoryController from "../controllers/inventoryController.js";
import * as productController from "../controllers/productController.js";

const inventoryRouter = Router();

inventoryRouter.get("/", inventoryController.getHomePage);
inventoryRouter.get("/inventory", inventoryController.getInventoryList);
inventoryRouter.get("/inventory/list", inventoryController.getInventorySearch);
inventoryRouter.get("/categories", inventoryController.getCategories);
inventoryRouter.all("/categories/add/:type", inventoryController.getCategoriesForm);

inventoryRouter.all("/product/new", productController.getNewProductForm); // when you add a new product

inventoryRouter.get("/product/:name", productController.getProduct); // when you click a product card, or, once searching and clicking product card
inventoryRouter.all("/product/:name/edit", productController.getEditProduct); // get edit ejs when you press edit button
inventoryRouter.delete("/product/:name/delete", productController.deleteProduct); // when you press delete button on product page

export default inventoryRouter;
