const mysql = require('mysql');
const bcrypt = require('bcryptjs');
require("dotenv").config();

const pool = mysql.createPool({
    connectionLimit: 10,
    password: process.env.DB_PASSWORD,
    user: process.env.DB_USER,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT
});

let jueeradb = [];

jueeradb.user = (username) => {
    return new Promise((resolve, reject) => {
        pool.query(`SELECT * FROM User WHERE username=?`, [
            [username]
        ], (err, results) => {
            if(err){
                return reject(err);
            }
            return resolve(results);
        });
    });
};

jueeradb.userid = (userid) => {
    return new Promise((resolve, reject) => {
        pool.query(`SELECT * FROM User WHERE ID=?`, [
            [userid]
        ], (err, results) => {
            if(err){
                return reject(err);
            }
            return resolve(results);
        });
    });
};

jueeradb.register = (body) => {
    return new Promise((resolve, reject) => {
        pool.query("INSERT INTO User (username, password) VALUES (?)", [
            [body.username, bcrypt.hashSync(body.password, 10)]
        ], (err, results) => {
            if(err){
                return reject(err);
            }
            return resolve(results);
        });
    });
};

jueeradb.newProduct = (body) => {
    return new Promise((resolve, reject) => {
        pool.query("INSERT INTO Product (InternalCode, SupplierCode, Name, Description, Image, Quantity) VALUES (?)", [
            [body.internal_code,body.supplier_code, body.product_name, body.description, body.image, body.qty || 0]
        ], (err, results) => {
            if(err){
                return reject(err);
            }
            return resolve(results);
        });
    });
};

jueeradb.product = () => {
    return new Promise((resolve, reject) => {
        pool.query(`SELECT * FROM Product`, [
        ], (err, results) => {
            if(err){
                return reject(err);
            }
            return resolve(results);
        });
    });
};

jueeradb.updateProduct = (body,code) => {
    return new Promise((resolve, reject) => {
        pool.query("UPDATE Product SET ? WHERE InternalCode = ?", [
            {
                SupplierCode: body.supplier_code,
                Name: body.product_name,
                Description: body.description
            },
            code
        ], (err, results) => {
            if(err){
                return reject(err);
            }

            return resolve(results);
        });
    });
};

jueeradb.setProductQuantity = (qty,code) => {
    return new Promise((resolve, reject) => {
        pool.query("UPDATE Product SET Quantity=? WHERE InternalCode = ?", [
            qty,
            code
        ], (err, results) => {
            if(err){
                return reject(err);
            }

            return resolve(results);
        });
    });
};

jueeradb.productOne = (code) => {
    return new Promise((resolve, reject) => {
        pool.query(`SELECT * FROM Product WHERE InternalCode=?`, [
            [code]
        ], (err, results) => {
            if(err){
                return reject(err);
            }
            return resolve(results);
        });
    });
};

jueeradb.productDelete = (code) => {
    return new Promise((resolve, reject) => {
        pool.query(`DELETE FROM Product WHERE InternalCode=?`, [
            [code]
        ], (err, results) => {
            if(err){
                return reject(err);
            }
            return resolve(results);
        });
    });
};

jueeradb.newProductImage = (internal_code, path) => {
    return new Promise((resolve, reject) => {
        pool.query("UPDATE Product SET Image = ? WHERE InternalCode = ?", [
            path, internal_code
        ], (err, results) => {
            if(err){
                return reject(err);
            }

            return resolve(results);
        });
    });
};

module.exports = jueeradb;