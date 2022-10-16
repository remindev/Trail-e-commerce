import Express from "express";

import * as auth from '../app/auth.js';

const user = Express.Router();

user.get('/', (req, res) => {

  let data = {
    appName: process.appConfig.name
  };

  res.render('home', data); 
  
});

user.post('/logout',(req,res)=>{

  req.session.destroy();

  // res.send({status:'sucess',message:'sucessfully logged out'});

});



export let RUsers = user;