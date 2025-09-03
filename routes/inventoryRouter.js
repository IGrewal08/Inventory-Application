import { Router } from "express";
import * as inventoryController from '../controllers/inventoryController.js';
import * as productController from '../controllers/productController.js';

const inventoryRouter = Router();

inventoryRouter.get("/", inventoryController.getHomePage);
inventoryRouter.get("/inventory", inventoryController.getInventoryList);
inventoryRouter.get("/inventory/search", inventoryController.getInventorySearch);
inventoryRouter.get("category", inventoryController.getCategories);
inventoryRouter.get("/product/:name", productController.getProduct);
inventoryRouter.post("/product/:name", productController.postProduct);


export default inventoryRouter;

/*
    GET Home route "/"
    GET Search route "/Inventory/Search"    -> search query parameter to controller to get item with specific name
    GET Inventory route "/Inventory"        -> with query parameters function in controller uses db to get filtered data
    GET Category route "/Category"          -> routes to /Inventory with pre-written query parameter to item
    POST Edit route "/Product/:name"
*/