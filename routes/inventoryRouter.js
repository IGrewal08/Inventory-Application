import { Router } from "express";
import * as inventoryController from "../controllers/inventoryController.js";
import * as productController from "../controllers/productController.js";

const inventoryRouter = Router();

inventoryRouter.get("/", inventoryController.getHomePage);
inventoryRouter.get("/inventory", inventoryController.getInventoryList);
inventoryRouter.get("/inventory/list", inventoryController.getInventorySearch);
inventoryRouter.get("/categories", inventoryController.getCategories);
inventoryRouter.all("/categories/add/:type", inventoryController.getCategoriesForm);

inventoryRouter.all("/product/new", productController.getNewProductForm);

inventoryRouter.get("/product/:name", productController.getProduct);
inventoryRouter.all("/product/:name/edit", productController.getEditProduct);
inventoryRouter.delete(
  "/product/:name/delete",
  productController.deleteProduct
);

export default inventoryRouter;
