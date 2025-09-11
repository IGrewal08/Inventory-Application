import { Router } from "express";
import * as inventoryController from "../controllers/inventoryController.js";
import * as productController from "../controllers/productController.js";
import multer from 'multer';
import path from 'node:path';
import { __dirname } from "../index.js";

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadDir = path.join(__dirname, '/public/img');
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });
const inventoryRouter = Router();

inventoryRouter.get("/", inventoryController.getHomePage);
inventoryRouter.get("/inventory", inventoryController.getInventoryList);
inventoryRouter.get("/inventory/list", inventoryController.getInventorySearch);
inventoryRouter.get("/categories", inventoryController.getCategories);
inventoryRouter.all("/categories/add/:type", inventoryController.getCategoriesForm);

inventoryRouter.get("/product/new", productController.getNewProductForm);
inventoryRouter.post("/product/new", upload.single('image'), productController.getNewProductForm);

inventoryRouter.get("/product/:name", productController.getProduct);
inventoryRouter.get("/product/:name/edit", productController.getEditProduct);
inventoryRouter.post("/product/:name/edit", upload.single('image'), productController.getEditProduct);
inventoryRouter.delete(
  "/product/:name/delete",
  productController.deleteProduct
);

export default inventoryRouter;
