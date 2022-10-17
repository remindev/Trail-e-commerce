import Express from 'express'; // importing express form library

import ExpressLayouts from 'express-ejs-layouts'; // importing ejs layout library

import session from 'express-session'; // sessons importing

import ConnectMongoDBSession from 'connect-mongodb-session'; // sesson and storage

import events from 'events'; // importing events

import { log } from 'util'; // importing util folder 

import dotenv from 'dotenv'; //  importing dot env ]

import fileUpload from 'express-fileupload';


dotenv.config(); // initializing dotenv



import * as auth from './app/auth.js';

import { RAdmin } from "./routes/admin.js";

import { RUsers } from './routes/users.js';

import { RAuth } from './routes/auth.js';



const app = Express();

const __dirname = process.cwd(); // initializing current working directory

const appConfig = {
    name: "Odio",
    port: process.env.PORT | 8080
};

process.appConfig = appConfig;

const mongoDbSesson = new ConnectMongoDBSession(session);

app.set("view engine", "ejs");

app.use(session({
    saveUninitialized: false,
    secret: process.env.SECRET_KEY,
    resave:false,
    store:new mongoDbSesson({
        uri:process.env.USERDB_URL,
        collection:"session"
    }),
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 10 // 10 days
    }
}));

app.use(fileUpload());

app.use(Express.json()); // to get data from req body

app.use(ExpressLayouts); // using ejs layouit as middleware

app.use(Express.static(`${__dirname}/public`)); // serving static files

app.use(auth.initializeAuth);


// app.use((req,res,next)=>{console.log(req.isLoggedIn? `> ${req.user.email}`: "> User is not logged in "); next()});


app.use(function (req, res, next) {

    // this is an important middleware in which we declare cache and max age property to the response hedder
    // use case of this for example is to avoid showing login page on click of back butten even after you are logged in 
    // controling the catch and max age is always a good approch
    // 

    res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
    next();
    
});


app.use('/auth', RAuth);

app.use('/admin', auth.mustLoginAdmin ,RAdmin); // all request to the admin route will be avilabel on admin.js in routers folder

app.use('/', RUsers); // all request to the users route will be avilable on user.js in routes folder



// 404 error page | runs if above router function is not called or return nothing as response
app.use((req, res) => {

    /* Dont write request or endpoint code below this 404 because the routs below wont able to get the request.
    because the response is already set above. no matter what you write below.
    It won't effect code unless you code is not a routing code like app.get(), app.post()... */

    res.status(404); // setting staus code for not found || 404;
    res.render("errMessage",{message:"Oops, Thats an error ! 404"}); // rendering the error page 

});


app.listen(appConfig.port, () => console.log(`[-] server is started at port ${appConfig.port}`)); // starting to listen on spcified port | starting server