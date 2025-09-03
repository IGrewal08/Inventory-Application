import { body, validationResult } from "express-validator";

export const getProduct = (req, res) => {
    const productName = req.param;
    res.render("product", {
        title: productName,
    });
};

export const postProduct = (req, res) => {
    const {} = req.body;
    res.redirect('/inventory');
}

/*
    feat:
        /edit to edit a product
        /delete to delete a product
*/