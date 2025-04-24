if(process.env.NODE_ENV != 'production'){
    require('dotenv').config();
}
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const ejs = require('ejs-mate');
const methodOverride = require('method-override');
const listingsRouter = require('./routers/listings');
const reviewsRouter = require('./routers/review');
const userRouter = require('./routers/user');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user'); 
const wrapasync = require('./wrapasync');
const MongoStore = require('connect-mongo');
const localStrategy = require('passport-local').Strategy;


//Database Connection
// async function main(){
//     await mongoose.connect('mongodb://127.0.0.1:27017/wanderland');
// }
async function main(){
    await mongoose.connect(process.env.ATLAS_URL);
}
main()
.catch(err => console.log(err))

//Express application setup
const app = express();

//Middleware
app.engine('ejs', ejs);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.set(express.static(path.join(__dirname, 'public')));


const store = MongoStore.create({
    mongoUrl: process.env.ATLAS_URL,
    crypto: {
        secret: 'squirrel'
      },
      touchAfter: 24 * 60 * 60, // 1 day
})

store.on('error', function(e){
    console.log('Session store error', e);
})

app.use(session({
    store,
    secret: 'thisshouldbeasecret',
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7, // 1 week
        maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
        secure: process.env.NODE_ENV === 'production'
    }
}));



app.use(cookieParser());
app.use(flash());
app.use(passport.initialize()); 
app.use(passport.session()); 
passport.serializeUser(User.serializeUser()); 
passport.deserializeUser(User.deserializeUser()); 
passport.use(new localStrategy(User.authenticate())); 

app.use(async (req, res, next) => {
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    res.locals.user =  await req.user;
    next();
});

const PORT = 8080;

app.get('/', (req, res) => {
    res.send('Helloworld');
});

//Listing Router
app.use('/listings', listingsRouter);

//Review Router
app.use('/listings/:id/reviews', reviewsRouter);

//User router
app.use('/', userRouter);

app.use((err, req, res, next) => {
    res.render('error', { error: err });
});

app.listen(PORT, () => {
    console.log('Server started');
});