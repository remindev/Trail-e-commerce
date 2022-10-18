import Express from "express";

import * as auth from '../app/auth.js';

import * as DB from '../app/schema.js';

const user = Express.Router();

user.get('/', async (req, res) => {

  try {

    let productsDB = await DB.products.find({});

    let user = {
      email: '',
    };

    let data = {
      appName: process.appConfig.name,
      user: req.user ? req.user : user,
      isLoggedIn: req.isLoggedIn,
      products: productsDB
    };

    res.render('home', data);

  } catch (error) {

    console.log(error);

  };

});

user.post('/logout', (req, res) => {

  req.session.destroy();

  res.send({ status: 'sucess', message: 'sucessfully logged out' });

});


export let RUsers = user;