import express, { json } from 'express';

import * as DB from '../app/schema.js';

import * as auth from '../app/auth.js';

import * as products from '../app/products.js';

const app = express.Router();

const __dirname = process.cwd(); // initializing current working directory


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

            let productDB_DATA = await DB.products.find({});

            let data = {
                appName: process.appConfig.name,
                users: [],
                user: req.user,
                currentPage: 'products',
                products: [],
                layout: 'admin'
            };

            for (let i = 0; i < productDB_DATA.length; i++) {

                let dd = productDB_DATA[i].createdAt.getDate();
                let mm = productDB_DATA[i].createdAt.getMonth() + 1;
                let yyyy = productDB_DATA[i].createdAt.getFullYear();

                let ddu, mmu, yyyyu;

                if (productDB_DATA[i].lastSell) {

                    ddu = productDB_DATA[i].lastSell.getDate();
                    mmu = productDB_DATA[i].lastSell.getMonth() + 1;
                    yyyyu = productDB_DATA[i].lastSell.getFullYear();

                } else {

                    ddu = ' - ';
                    mmu = ' - ';
                    yyyyu = ' - ';

                };

                let dataOFProducts = {
                    title: productDB_DATA[i].title,
                    IID: productDB_DATA[i].IID,
                    order: productDB_DATA[i].order,
                    PID: productDB_DATA[i].PID,
                    description: productDB_DATA[i].description,
                    stock: productDB_DATA[i].stock,
                    price: productDB_DATA[i].price,
                    createdAt: `${dd}/${mm}/${yyyy}`,
                    lastSell: `${ddu}/${mmu}/${yyyyu}`,
                    category:productDB_DATA[i].category
                };

                data.products.push(dataOFProducts);

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

        case 'addProducts': {

            let userData = await DB.user.find({}, { password: 0 });

            let data = {
                appName: process.appConfig.name,
                users: [],
                user: req.user,
                currentPage: 'Edit products',
                layout: 'adminpro'
            };

            res.render('admin/addProducts', data);

            break;

        };

        case 'updateProducts': {

            let PID_URL = req.query.pid;

            try {

                let productData = await DB.products.find({PID:PID_URL});

                if(productData.length == 0){

                    res.render("errMessage",{message:'Product not found ! '});

                } else {
                    
                    let data = {
                        appName: process.appConfig.name,
                        users: [],
                        user: req.user,
                        currentPage: 'Edit products',
                        layout: 'adminpro',
                        product:productData[0],
                        PID:PID_URL
                    };
    
                    res.render('admin/updateProducts', data);

                };


            } catch (error) {
                console.error(error);
            };

            break;

        };

        default: {

            res.render('errMessage', { message: 'Oops, page not avilabe ! 404' });

        };

    }



});

app.put('/updateUser', async (req, res) => {

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

app.delete('/deleteUser', async (req, res) => {

    try {

        let data = await auth.deleteUser(req);

        res.send({ status: 'sucess', message: data });

    } catch (error) {

        res.send({ status: 'error', message: error });

    };

});

app.post('/addproducts', async (req, res) => {

    try {

        let resp = await products.createProduct(req);

        res.send({ status: "good", message: resp });

    } catch (error) {

        console.log(error);

        res.send({ status: "error", message: error });

    };

});


app.put('/updateproducts', async (req, res) => {

    try {

        let resp = await products.updateProducts(req);


        res.send({ status: "good", message: resp });

    } catch (error) {

        console.log(error);

        res.send({ status: "error", message: error });

    };

});

app.delete('/deleteProduct',async (req,res)=>{

    try {

        let data = await products.deleteProduct(req);

        res.send({status:'sucess',message:data});
        
    } catch (error) {
        res.send({status:"error", message:error});
    };

});


export var RAdmin = app;