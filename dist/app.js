"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const DbConnection_1 = require("./DbConnection");
/*var express = require('express');*/
const http = require("http");
const bodyParser = require("body-parser");
const express = require("express");
let dbCon = new DbConnection_1.DbConnection();
let app = express();
app.server = http.createServer(app);
app.use('*', (req, res, next) => {
    console.log(req.baseUrl);
    next();
});
app.use(bodyParser.json({
    extended: true
}));
app.post('/api/login', (req, res) => {
    console.log('received login request');
    console.log(req.body);
    console.log(`username: ${req.body.username}, password: ${req.body.password}`);
    dbCon.open()
        .then(() => dbCon.LoginGetUser(req.body.username, req.body.password))
        .then(result => {
        console.log(result);
        if (result)
            res.send(result); // This should be sending the user object
        else
            res.send({ error: 'LoginFailedError' });
    })
        .catch((e) => res.send({ error: 'LoginFailedError' }))
        .finally(() => dbCon.close());
});
app.post('/api/create-user', (req, res) => {
    dbCon.open()
        .then(() => dbCon.createUser(req.body.username, req.body.password))
        .then((result) => res.send(result))
        .catch((e) => res.send('UsernameAlreadyTakenError'))
        .finally(() => dbCon.close());
});
app.listen(3000);
console.log('waiting for requests');
