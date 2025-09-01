import { Router } from "express";
import inventoryController from './controllers/inventoryController';
import productController from './controller/productController';

const inventoryRouter = Router();

inventoryRouter.get('/', inventoryController);
inventoryRouter.get('/Inventory', inventoryController);
inventoryRouter.get('/Inventory/Search', inventoryController);
inventoryRouter.get('Category', inventoryController);
inventoryRouter.get('/Product/:name', productController);
inventoryRouter.post('/Product/:name', productController);


export default inventoryRouter;

/*
    GET Home route "/"
    GET Search route "/Inventory/Search"    -> search query parameter to controller to get item with specific name
    GET Inventory route "/Inventory"        -> with query parameters function in controller uses db to get filtered data
    GET Category route "/Category"          -> routes to /Inventory with pre-written query parameter to item
    POST Edit route "/Product/:name"
*/