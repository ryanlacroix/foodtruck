"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
let crypto = require('crypto');
class DbConnection {
    constructor(url = 'mongodb://localhost:27017', dbName = 'foodtruck') {
        this.url = url;
        this.dbName = dbName;
        this.db = null;
        // Call this before any db calls
        this.open = () => {
            this.client = new MongoClient(this.url);
            return new Promise((resolve, reject) => {
                this.client.connect((err) => {
                    this.db = this.client.db(this.dbName);
                    resolve();
                });
            });
        };
        this.close = () => {
            this.client.close();
        };
        this.createUser = (username, password) => {
            return new Promise((resolve, reject) => {
                const collection = this.db.collection('users');
                // Ensure that there is no existing user with the same username
                collection.findOne({ username: username }, (err, doc) => {
                    if (doc) {
                        console.log('findOne(username:username) results:');
                        console.log(doc);
                        reject(new Error('Username already taken!'));
                        return;
                    }
                    let newUser = new User(username).setPassword(password);
                    collection.insertOne(newUser.toMongo(), (err, response) => {
                        assert.equal(err, null);
                        console.log('added user:');
                        console.log(newUser);
                        resolve(newUser);
                    });
                });
            });
        };
        this.showAll = () => {
            return new Promise((resolve, reject) => {
                const collection = this.db.collection('users');
                collection.find({}).toArray(function (err, docs) {
                    console.log("Found the following records");
                    console.log(docs);
                    resolve(docs);
                });
            });
        };
        this.LoginGetUser = (username, password) => {
            // If the password is correct, send the user object. Otherwise, null
            return new Promise((resolve, reject) => {
                const collection = this.db.collection('users');
                collection.findOne({ username: username }, (err, user) => {
                    if (err)
                        return reject(err);
                    if (!user)
                        return reject(new Error('User doesn\'t exist'));
                    console.log(user);
                    let attemptedPass = crypto.createHash('md5')
                        .update(password + user.salt).digest('hex');
                    this.client.close();
                    resolve(attemptedPass === user.md5 ? user : null);
                    //resolve(attemptedPass === user.md5);
                });
            });
        };
    }
}
exports.DbConnection = DbConnection;
/* Class Definitions */
class User {
    constructor(username) {
        this.username = username;
        this.recipesLiked = [];
        this.recipesDisliked = [];
        this.recipesQueued = [];
        this.setPassword = (pass) => {
            this.md5 = crypto.createHash('md5').update(pass + this.salt)
                .digest('hex');
            return this;
        };
        this.toMongo = () => {
            console.log(JSON.stringify(this));
            // Strip functions
            return JSON.parse(JSON.stringify(this));
        };
        this.salt = crypto.randomBytes(Math.ceil(10 / 2))
            .toString('hex').slice(0, 10);
    }
}
