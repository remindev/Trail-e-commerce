import mongoose from "mongoose"; // importing mongoose

import dotenv from 'dotenv'; // importing dot env   |
//  |  uncomment when at developement
dotenv.config(); // configuring dot env             |

var DBDelay = new Date;


// auth db | USER

const db = mongoose.createConnection(process.env.USERDB_URL); // connecting to db

db.on('error', (error) => console.log(error)); // checks for errors

db.once('open', () => logger()); // run once after the db is connected

function logger() {

    let date = new Date;

    console.log(`[-] Database connected in : ${date - DBDelay}ms`)
}

/**
 * user schema 
 */
const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    name: String,
    nameID: String,
    UID: String,
    cart: Array,
    orders: Array,
    password: {
        type: String,
        required: true
    },
    creationTime: {
        type: Date,
        default: new Date
    },
    lastLoginTime: {
        type: Date,
        default: new Date
    },
    admin: {
        isAdmin: {
            type: Boolean,
            default: false,
        },
        adminID: String,
    }
});

export let user = db.model('users', userSchema); // exports user schema | db - users


/**
 * products schema
 */
const product = new mongoose.Schema({
    title: {
        type:String,
        required:true
    },
    price: {
        type:Number,
        default:0
    },
    createdAt: {
        type:Date,
        default:new Date
    },
    lastSell:Date,
    cateagory: String,
    stock: {
        type:Number,
        default:0
    },
    offer:{
        type:Number,
        default:0
    },
    description:String,
    img:String,
    PID:String,
    IID:String,
    order:{
        type:Number,
        default:0
    }
});

export let products = db.model('products', product); // exports games schema | db - projects