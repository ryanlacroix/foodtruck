import { callbackify } from "util";
import { resolveSoa } from "dns";

const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
let crypto = require('crypto');

export class DbConnection {
    private client;
    private db = null;
    constructor(private url: string = 'mongodb://localhost:27017',
        private dbName: string = 'foodtruck') {
    }

    // Call this before any db calls
    public open = (): Promise<any> => {
        this.client = new MongoClient(this.url);
        return new Promise((resolve, reject) => {
            this.client.connect((err) => {
                this.db = this.client.db(this.dbName);
                resolve();
            });
        });
    }
    public close = () => {
        this.client.close();
    }

    public createUser = (username: string, password: string): Promise<any> => {
        return new Promise((resolve, reject) => {
            const collection = this.db.collection('users');
            // Ensure that there is no existing user with the same username
            collection.findOne({ username: username }, (err, doc) => {
                if (doc) {
                    console.log('findOne(username:username) results:')
                    console.log(doc)
                    reject(new Error('Username already taken!'));
                    return;
                }

                let newUser: User = new User(username).setPassword(password);
                collection.insertOne(newUser.toMongo(), (err, response) => {
                    assert.equal(err, null);
                    console.log('added user:');
                    console.log(newUser);
                    resolve(newUser);
                });
            });
        });
    }

    public showAll = (): Promise<any> => {
        return new Promise((resolve, reject) => {
            const collection = this.db.collection('users');
            collection.find({}).toArray(function (err, docs) {
                console.log("Found the following records");
                console.log(docs)
                resolve(docs);
            });
        });
    }

    public LoginGetUser = (username: string, password: string): Promise<any> => {
        // If the password is correct, send the user object. Otherwise, null
        return new Promise((resolve, reject) => {
            const collection = this.db.collection('users');
            collection.findOne({ username: username }, (err, user) => {
                if (err) return reject(err);
                if (!user) return reject(new Error('User doesn\'t exist'));
                console.log(user)
                let attemptedPass: string = crypto.createHash('md5')
                    .update(password + user.salt).digest('hex');
                this.client.close();
                resolve(attemptedPass === user.md5? user : null);
                //resolve(attemptedPass === user.md5);
            });
        });
    }
}

/* Class Definitions */

class User {
    public salt: string;
    public md5: string;
    public recipesLiked: number[] = [];
    public recipesDisliked: number[] = [];
    public recipesQueued: number[] = [];
    constructor(public username: string) {
        this.salt = crypto.randomBytes(Math.ceil(10 / 2))
            .toString('hex').slice(0, 10);
    }
    public setPassword = (pass: string): User => {
        this.md5 = crypto.createHash('md5').update(pass + this.salt)
            .digest('hex');
        return this;
    }
    public toMongo = () => {
        console.log(JSON.stringify(this));
        // Strip functions
        return JSON.parse(JSON.stringify(this));
    }
}