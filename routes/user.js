const express = require('express');
const db = require('../db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const middleware = require("./middleware/auth");

const router = express.Router();

router.post('/register', async (req, res) => {
    try{
        if(req.body.username === null || req.body.username === '' || req.body.username === undefined){
            return res
            .status(400)
            .json({ msg: "Username required" });
        }
        if(req.body.password === null || req.body.password === '' || req.body.password === undefined){
            return res
            .status(400)
            .json({ msg: "Password required" });
        }
        if(req.body.passwordCheck !== req.body.password){
            return res
            .status(400)
            .json({ msg: "Confirm password not matched" });
        }
        let user = await db.user(req.body.username);
        if(user.length > 0){
            return res
            .status(400)
            .json({ msg: "username already exist" });
        }
        let results = await db.register(req.body);
        res.json(results);
    } catch(e){
        res.sendStatus(500);
    }
});

router.post('/login', async (req, res) => {
    try{
        if(req.body.username === null || req.body.username === '' || req.body.username === undefined){
            return res
            .status(400)
            .json({ msg: "Username required" });
        }
        if(req.body.password === null || req.body.password === '' || req.body.password === undefined){
            return res
            .status(400)
            .json({ msg: "Password required" });
        }
        let user = await db.user(req.body.username);
        if(user.length <= 0){
            return res
            .status(400)
            .json({ msg: "Wrong username or password" });
        }
        const isMatch = await bcrypt.compare(req.body.password,user[0].password);
        if (!isMatch) {
            return res
            .status(400)
            .json({ msg: "Wrong username or password" });
        }
        const token = jwt.sign({ id: user[0].ID }, process.env.JWT_SECRET);
        return(res.json({
            token,
            user: {
                id: user[0].ID,
                username: user[0].username
            }
        }));
    } catch(e){
        res.sendStatus(500);
    }
});

router.post("/tokenIsValid", async (req, res) => {
    try {
        const token = req.header("x-auth-token");
        if (!token) return res.json(false);

        const verified = jwt.verify(token, process.env.JWT_SECRET);
        if (!verified) return res.json(false);

        let user = await db.userid(verified.id);
        if(user.length <= 0){
            return res.json(false)
        }

        return res.json(true);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get("/", middleware, async (req, res) => {
    let user = await db.userid(req.user);
    res.json({
        username: user[0].username,
        id: user[0].ID,
    });
});

module.exports = router;