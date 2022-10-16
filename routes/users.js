import Express from "express";

import * as auth from '../app/auth.js';

const user = Express.Router();

user.get('/', (req, res) => {

  let user = {
    email:'',
  }

  let data = {
    appName: process.appConfig.name,
    user:req.user?req.user:user,
    isLoggedIn:req.isLoggedIn
  };

  res.render('home', data); 
  
});

user.post('/logout',(req,res)=>{

  req.session.destroy();

  res.send({status:'sucess',message:'sucessfully logged out'});

});



export let RUsers = user;