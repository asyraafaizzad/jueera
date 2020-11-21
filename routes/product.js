const express = require('express');
const db = require('../db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const middleware = require("./middleware/auth");

const router = express.Router();

router.post('/', middleware, async (req, res) => {
    try{
        if(req.body.internal_code === null || req.body.internal_code === '' || req.body.internal_code === undefined){
            return res
            .status(400)
            .json({ msg: "Seller code required" });
        }
        let product = await db.productOne(req.body.internal_code);
        if(product.length > 0){
            return res
            .status(400)
            .json({ msg: "Product already exist" });
        }
        let results = await db.newProduct(req.body);
        res.json(results);
    } catch(e){
        res.sendStatus(500);
    }
});

router.get('/', middleware, async (req, res) => {
    try{
        let products = await db.product();
        res.json(products);
    } catch(e){
        res.sendStatus(500);
    }
});

router.get('/:code', middleware, async (req, res) => {
    try{
        let product = await db.productOne(req.params.code);
        res.json(product);
    } catch(e){
        res.sendStatus(500);
    }
});

router.put('/:code', middleware, async (req, res) => {
    try{
        let product = await db.updateProduct(req.body,req.params.code);
        res.json(product);
    } catch(e){
        res.sendStatus(500);
    }
});

router.put('/addstock/:code', middleware, async (req, res) => {
    try{
        let productqty = await db.productOne(req.params.code);
        if(productqty.length <= 0){
            return res
            .status(400)
            .json({ msg: "Product not exist" });
        }
        let newQty = parseInt(productqty[0].Quantity) + parseInt(req.body.qty);
        let product = await db.setProductQuantity(newQty,req.params.code);
        res.json(product);
    } catch(e){
        res.sendStatus(500);
    }
});

router.put('/minusstock/:code', middleware, async (req, res) => {
    try{
        let productqty = await db.productOne(req.params.code);
        if(productqty.length <= 0){
            return res
            .status(400)
            .json({ msg: "Product not exist" });
        }
        let newQty = parseInt(productqty[0].Quantity) - parseInt(req.body.qty);
        if(newQty < 0){
            newQty = 0;
        }
        let product = await db.setProductQuantity(newQty,req.params.code);
        res.json(product);
    } catch(e){
        res.sendStatus(500);
    }
});

router.put('/resetstock/:code', middleware, async (req, res) => {
    try{
        let productqty = await db.productOne(req.params.code);
        if(productqty.length <= 0){
            return res
            .status(400)
            .json({ msg: "Product not exist" });
        }
        let newQty = parseInt(req.body.qty);
        if(newQty < 0){
            newQty = 0;
        }
        let product = await db.setProductQuantity(newQty,req.params.code);
        res.json(product);
    } catch(e){
        res.sendStatus(500);
    }
});

router.delete('/:code', middleware, async (req, res) => {
    try{
        let product = await db.productDelete(req.params.code);
        res.json(product);
    } catch(e){
        res.sendStatus(500);
    }
});

router.post('/fileupload', middleware, async (req, res) => {
    try{
        if(req.files !== null){
            const file = req.files.file;
            const filenameArr = file.name.split(".");
            const ext = filenameArr[filenameArr.length-1];

            const filepath = `/uploads/${req.body.internal_code}.${ext}`;

            file.mv(__dirname + `/../client/public/uploads/${req.body.internal_code}.${ext}`, err=> {
                if(err) {
                    console.error(err);
                    return res.status(500).send(err);
                }
            });
            let productImage = await db.newProductImage(req.body.internal_code, filepath);
            res.json(productImage);
        }
        else{
            res.json({msg: 'Empty file'});
        }
    } catch(e){
        res.sendStatus(500);
    }
});

module.exports = router;