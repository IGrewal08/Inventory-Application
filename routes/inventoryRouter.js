import { Router } from "express";
import * as inventoryController from "../controllers/inventoryController.js";
import * as productController from "../controllers/productController.js";

const inventoryRouter = Router();

inventoryRouter.get("/", inventoryController.getHomePage);
inventoryRouter.get("/inventory", inventoryController.getInventoryList);
inventoryRouter.get("/inventory/list", inventoryController.getInventorySearch);
inventoryRouter.get("/categories", inventoryController.getCategories);

inventoryRouter.get("/product/:name", productController.getProduct); // when you click a product card, or, once searching and clicking product card
inventoryRouter.post("/product/:name", productController.postProduct); // when you add a new product
inventoryRouter.get("/product/:name/edit", productController.getEditProduct); // get edit ejs when you press edit button
inventoryRouter.put("/product/:name", productController.putEditProduct); // when you press submit to edit product/item
inventoryRouter.delete("/product/:name", productController.deleteProduct); // when you press delete button on product page

export default inventoryRouter;

/*
    GET Home route "/"
    GET Search route "/Inventory/Search"    -> search query parameter to controller to get item with specific name
    GET Inventory route "/Inventory"        -> with query parameters function in controller uses db to get filtered data
    GET Category route "/Category"          -> routes to /Inventory with pre-written query parameter to item
    POST Edit route "/Product/:name"
*/
