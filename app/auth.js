
import { Schema } from 'mongoose';

import * as DB from './schema.js';

import bCrypt from 'bcryptjs';


/**
 * Generates a random id with length control
 *
 * @param {number} length - Length of returning id
 * @returns - random ID e.g.. randomID(10) => AdF6ui-_oD
 */
export function randomId(length) {
    // this function creates a reandom id
    // controll id length by providing length to function (< length limit >);
    // if length not provided function returns id of default length of 10

    // declaring required veriables
    var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_'.split(''); // all charectes tobe included in id
    var str = ''; // output sting container

    if (!length) { // checks if any lenths are passed to function or not and runs if not

        // sets length as 10 || deafalt length
        length = 10;

    };

    for (var i = 0; i < length; i++) {
        // this loops runs according to the lenth provided
        // e.g.. function (100) runs this loop 100 times

        // adding each character to output string variable randomly
        str += chars[Math.floor(Math.random() * chars.length)];

    };

    return str;  // returns output string

};


/**
 * This is a middleware function
 * This function runs every time a new request come 
 * This funciton checks weather the request is form a loggined user or not
 * Reflects the state of user with a boolan and create LoggedIn veriable in request object and add the value
 * 
 * @param {Request} req main request object
 * @param {import('express').Response} res main response object
 * @param {import('express').NextFunction} next  next function to move to next funciton
 */
export async function initializeAuth(req, res, next) {

    // if user object is on the session obj, that means user is logged in
    if (req.session.user) {

        req.isLoggedIn = true; // user is logged in 

        let userDATA = await DB.user.findOne({ UID: req.session.user.UID }, { password: 0 });


        if (userDATA) {
            req.user = userDATA;
        } else {
            req.session.destroy();

            req.isLoggedIn = false; // user not logged in
        };

    } else {

        req.isLoggedIn = false; // user not logged in

    };

    next(); // moves to next function 

};

/*
   This function is resposible to redirect user to the login page when the user is not logged in
   If logged in this function just passes and move to next funtion
*/
export function mustLogin(req, res, next) {

    if (req.isLoggedIn == false) {

        // is there is no user is logged in, client is redirected to login page

        res.redirect('/auth/login');

    } else {

        next(); // moves on to next function 

    };

};

export function mustLoginAdmin(req, res, next) {

    if (req.isLoggedIn == false) {

        // is there is no user is logged in, client is redirected to login page

        res.redirect('/auth/login');

    } else {

        if (req.user.admin.isAdmin == true) {

            next(); // moves on to next function 

        } else {

            res.render('errMessage', { message: 'Access denied - Unauthorized aciton' });

        };

    };

};

export function mustLoginApi(req, res, next) {

    // this funciton is same as the functoin mustlogin above the difference is theat this funciton is not redirecting user to login page
    // isted this give an error message as result

    if (req.isLoggedIn == false) {

        // if the user is not logged in 

        // send error message responce to user
        res.send({ status: 'error', message: 'access denied' }).status(403);

    } else {

        next();

    };

};

/*
This function is resposible to redirect user to the home page when the user is logged in
   If not logged in, this function just passes and move to next funtion
*/
export function mustLogout(req, res, next) {

    if (req.isLoggedIn == true) {

        // user is loged in 

        // redirect user to home page
        res.redirect('/');

    } else {

        // user is not logged in 

        next(); // moves on to next function 

    };

};

export function mustLogoutApi(req, res, next) {

    // this funciton is same as the funciton above mustLogout the only difference is that insted to redirectng user to home page this send's a message to client
    if (req.isLoggedIn == true) {

        // user is logged in 

        // sends an error message to client
        res.send({ status: 'error', message: 'access denied - Already logged in' }).status(403);

    } else {

        // user is not logged in 

        next(); // moves to next function 

    };

};



/**
 * @param {Object} data
 * @param {String} data.email
 * @param {String} data.password
 * @param {String} data.role
 * @param {String} data.UID
 * @param {String} data.name
 * @param {Object} requiredIn
 * @param {string} requiredIn.emailRequired
 * @param {string} requiredIn.passwordRequired
 * @param {string} requiredIn.roleRequired
 * @param {string} requiredIn.UIDRequired
 * @param {string} requiredIn.nameRequired
 * @param {string} typeOfValidation
 */
export function validatior(data, requiredIn, typeOfValidation) {

    let email = data.email ? data.email.toLocaleLowerCase() : [];

    let password = data.password ? data.password : [];

    let role = data.role ? data.role : [];

    let UID = data.UID ? data.UID : [];

    let name = data.name ? data.name : [];


    let required = requiredIn ? requiredIn : {};

    let emailRequired = required.emailRequired ? true : false;

    let passwordRequired = required.passwordRequired ? true : false;

    let roleRequired = required.roleRequired ? true : false;

    let UIDRequired = required.UIDRequired ? true : false;

    let nameRequired = required.nameRequired ? true : false;

    let output = {
        name: null,
        email: null,
        password: null,
        UID: null,
        role: null
    };

    return new Promise(async (resolve, reject) => {

        if (emailRequired || email.length >= 5) {

            if (email.length == 0) {

                reject("Email field cannot be empty");

                return 0;

            } else {

                if (email.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)) {

                    if (typeOfValidation == 'signup' || typeOfValidation == 'updateUser') {

                        try {

                            let emailIn = await DB.user.find({ email: email });

                            if (emailIn.length > 0) {

                                reject('Email aready exists');

                                return 0;

                            };

                        } catch (error) {
                            console.error(error)
                        };

                    };

                    if (typeOfValidation == 'login') {

                        try {

                            let emailIn = await DB.user.find({ email: email });

                            if (emailIn.length == 0) {

                                reject('Account not exists');

                                return 0;

                            };

                        } catch (error) {
                            console.error(error)
                        };

                    };

                    output.email = email;

                } else {

                    reject("Enter a valid email");

                    return 0;

                };

            };

        };

        if (passwordRequired || password.length >= 6) {

            if (password.length == 0) {

                reject("password field cannot be empty");

                return 0;

            } else {

                // good password

                if (typeOfValidation == 'login') {

                    try {

                        let passwordHashFromDb = await DB.user.findOne({ email: email }, { password: 1, _id: 0 });

                        try {

                            let matched = await bCrypt.compare(password, passwordHashFromDb.password);

                            output.password = matched;

                        } catch (error) {

                            console.log(error);

                        };

                    } catch (error) {

                        console.error(error);

                    };

                } else {

                    let passwordHash = await bCrypt.hash(password, 10);

                    output.password = passwordHash;

                };

            };

        };

        if (UIDRequired || UID.length > 0 || typeOfValidation == 'signup') {


            if (typeOfValidation == 'signup') {

                let uid = '';

                do {

                    uid = randomId(25);

                } while (await DB.user.find({ UID: uid }).length > 0);

                output.UID = uid;

            } else {


                if (UID.length == 0) {

                    reject("UID required");

                    return 0;

                } else {

                    if (UID.length == 25) {

                        // good UID

                        let UIDFromDB = await DB.user.find({ UID: UID });

                        if (UIDFromDB.length > 0) {

                            // good UID

                        } else {

                            reject("UID is not valid");

                            return 0;

                        };

                        output.UID = UID;

                    };

                };

            };

        };

        if (nameRequired || name.length > 0) {

            if (name.length == 0) {

                reject("Name is required");

                return 0;

            } else {

                output.name = name;

            };


        };

        if (roleRequired || role.length > 0) {

            if (role.length == 0) {

                reject("Role required");

                return 0;

            } else {

                if (role == 'A' || role == 'U') {

                    // good role

                    output.role = role;

                } else {

                    reject("Invalid role");

                    return 0;

                };

            };

        };

        resolve(output);

    });

};

/**
 * 
 * @param {Request} request 
 * @returns promise contains user data
 */
export function createUser(request) {

    let email = request.body.email.trim();
    let password = request.body.password.trim();
    let name = request.body.name.trim();
    let role = request.body.role ? request.body.role.trim() : null;

    return new Promise(async (resolve, reject) => {


        try {

            let output = await validatior(
                {
                    name: name,
                    email: email,
                    password: password,
                    role: role
                },
                {
                    emailRequired: 1,
                    passwordRequired: 1,
                    nameRequired: 1
                },
                'signup'
            );

            let userData = await DB.user({
                email: output.email,
                password: output.password,
                name: output.name,
                UID: output.UID,
                'admin.isAdmin': output.role == 'A' ? true : false
            });

            userData.save();

            resolve(userData);

            return 0;


        } catch (error) {

            reject(error);

            return 0;

        };

    });

};

/**
 * 
 * @param {Request} request 
 * @returns promise with user data
 */
export async function loginUser(request) {

    let email = request.body.email.trim();

    let password = request.body.password.trim();

    return new Promise(async (resolve, reject) => {


        try {


            let output = await validatior(
                {
                    email: email,
                    password: password
                },
                {
                    emailRequired: 1,
                    passwordRequired: 1
                },
                'login'
            );

            if (output.password) {

                try {

                    let updateTime = await DB.user.updateOne({ email: output.email }, { $set: { lastLoginTime: new Date } });

                    let userAccount = await DB.user.find({ email: output.email }, { password: 0 })

                    resolve(userAccount[0]);

                    return 0;

                } catch (error) {

                    console.error(error);

                };

            } else {

                reject("Incorrect password");

                return 0;

            };


        } catch (error) {

            reject(error);

            return 0;

        };

    });

};

/**
 * 
 * @param {Request} request 
 * @returns promise with user data
 */
export async function updateUser(request) {

    let email = request.body.email != null ? request.body.email.trim() : '';

    let name = request.body.name != null ? request.body.name.trim() : '';

    let role = request.body.role != null ? request.body.role.trim() : '';

    let password = request.body.password != null ? request.body.password.trim() : '';

    let UID = request.body.UID != null ? request.body.UID.trim() : '';

    return new Promise(async (resolve, reject) => {

        try {

            let output = await validatior(
                {
                    email: email,
                    name: name,
                    role: role,
                    password: password,
                    UID: UID
                },
                {
                    UIDRequired: 1,
                },
                'updateUser'
            );

            try {

                if (output.email != null) {

                    let updating = await DB.user.updateOne({ UID: output.UID }, { $set: { email: output.email } });

                };

                if (output.name != null) {

                    let updating = await DB.user.updateOne({ UID: output.UID }, { $set: { name: output.name } });

                };

                if (UID != request.session.user.UID && output.role != null) {

                    let role = output.role == 'A' ? true : false;

                    let updating = await DB.user.updateOne({ UID: output.UID }, { $set: { 'admin.isAdmin': role } });

                } else if (output.role != null) {
                    reject("You cannot change your own role");
                };

                if (output.password != null) {

                    let updating = await DB.user.updateOne({ UID: output.UID }, { $set: { password: output.password } });

                };

                resolve("User data updated sucessfull");


            } catch (error) {
                console.error(error);
            };

        } catch (error) {
            reject(error);
        };

    });

};


/**
 * 
 * @param {Request} request 
 * @returns promise with user data
 */
export async function deleteUser(request) {

    let UID = request.body.UID;

    return new Promise( async (resolve, reject) => {


        try {

            let output = await validatior(
                {
                    UID: UID
                },
                {
                    UIDRequired: 1
                },
                'deleteUser'
            );

            if (output.UID != null) {

                if (request.session.user.UID == output.UID) {

                    reject('You cannot delete your own account');
                    

                } else {

                    let deleted = await DB.user.deleteOne({UID:output.UID});

                    resolve('User sucessfully deleted');

                };

            } else {

                reject('Invalid user ID');

            };

        } catch (error) {
            console.error(error);
        };


    });

};