import express from 'express';

import * as DB from '../app/schema.js';

import * as auth from '../app/auth.js';

const app = express.Router();


// dashboard of admin
app.get('/', async (req, res) => {

    let page = req.query.pg;

    if (!page) {
        res.redirect('/admin?pg=users')
        return 0;
    }

    switch (page) {

        case 'users': {

            let userData = await DB.user.find({}, { password: 0 });

            let data = {
                appName: process.appConfig.name,
                users: [],
                user: req.user,
                currentPage: 'users',
                layout: 'admin'
            };

            for (let i = 0; i < userData.length; i++) {

                let dd = userData[i].creationTime.getDate();
                let mm = userData[i].creationTime.getMonth() + 1;
                let yyyy = userData[i].creationTime.getFullYear();

                let ddu = userData[i].lastLoginTime.getDate();
                let mmu = userData[i].lastLoginTime.getMonth() + 1;
                let yyyyu = userData[i].lastLoginTime.getFullYear();

                let dataOFUser = {
                    name: userData[i].name,
                    email: userData[i].email,
                    orders: userData[i].orders,
                    UID: userData[i].UID,
                    cart: userData[i].cart,
                    admin: userData[i].admin,
                    creationTime: `${dd}-${mm}-${yyyy}`,
                    lastLoginTime: `${ddu}-${mmu}-${yyyyu}`
                };

                data.users.push(dataOFUser);

            };

            res.render('admin/users', data);

            break;

        };

        case 'products': {

            let data = {
                appName: process.appConfig.name,
                users: [],
                user: req.user,
                currentPage: 'products',
                layout: 'admin'
            };

            res.render('admin/products', data);

            break;

        }

        case 'settings': {

            let data = {
                appName: process.appConfig.name,
                users: [],
                user: req.user,
                currentPage: 'settings',
                layout: 'admin'

            };

            res.render('admin/settings', data);

            break;

        }

        default: {

            res.render('errMessage', { message: 'Oops, page not avilabe ! 404' });

        }

    }



});

app.post('/updateUser', async (req, res) => {

    try {

        let user = await auth.updateUser(req);

        res.send({
            status: 'good',
            message: user
        })

    } catch (error) {

        res.send({ status: 'error', message: error });

    };


});

app.post('/addUser', async (req, res) => {

    try {

        let user = await auth.createUser(req);

        res.send({ status: "sucess", message: "User created sucessfully" });

    } catch (error) {

        res.send({ status: "error", message: error });

    };

});

app.post('/deleteUser', async (req, res) => {

    try {
      
        let data = await auth.deleteUser(req);

        res.send({status:'sucess',message:data});
        
    } catch (error) {

        res.send({status:'error',message:error});

    };

});


export var RAdmin = app;