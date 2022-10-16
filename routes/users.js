import Express from "express";

import * as auth from '../app/auth.js';

const user = Express.Router();

user.get('/', auth.mustLogin, (req, res) => {

  let data = {
    appName: process.appConfig.name
  };

  res.render('home', data); // TODO: check this need to add logout button for users
  
});



export let RUsers = user;