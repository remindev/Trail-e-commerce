import Express from "express"; // importing express

import * as auth from '../app/auth.js'; // importign auth package

const app = Express.Router(); // configuring app veriabel as express router intance


const __dirname = process.cwd(); // initializing current working directory


// loign page | route
app.get("/login", auth.mustLogout, (req, res) => {
    res.render('partials/login', { layout: `auth` })
});


// signup page | route
app.get("/signup", auth.mustLogout, (req, res) => {
    res.render('partials/signup', { layout: `auth` })
});


// adminiD page | route
app.get("/admin", auth.mustLogin, (req, res) => {
    res.render('partials/admin', { layout: `auth` });
});


// login | API \ 
app.post('/login', auth.mustLogoutApi, async (req, res) => {

    try {

        let user = await auth.loginUser(req);

        let userData = {
            UID: user.UID,
            isAdmin: user.admin.isAdmin
        };

        req.session.user = userData;

        res.send({
            status: "good",
            message: "Login sucessful",
            action: "/"
        });

    } catch (error) {
        res.send({
            status: "error",
            message: error
        });
    };

});


// signup | API \
app.post('/signup', auth.mustLogoutApi, (req, res) => {

    auth.createUser(req)
        .then((user) => {

            let userData = {
                UID: user.UID,
                isAdmin: user.admin.isAdmin
            };

            req.session.user = userData;
            res.send({
                status: "good",
                message: "signup sucessful",
                action: "/"
            });
        }).catch((e) => {
            res.send({
                status: "error",
                message: e
            });
        });
});


export let RAuth = app; // exproting all route files