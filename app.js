const express = require('express');
const exphbs = require('express-handlebars');
const methodOverride = require('method-override');
const flash = require('connect-flash');
const session = require('express-session');
const path = require('path');
const mongoose = require('mongoose');
const passport = require('passport'); 
const bodyParser = require('body-parser');

const app = express();

//load routes
const ideas = require('./routes/ideas');
const users = require('./routes/users');

//db config
const db = require('./config/database');

//Map global promise - get rid of warning
mongoose.Promise = global.Promise;

//connection to database
mongoose.connect(db.mongoURI, {})
    .then(() => console.log('MongoDB is connected..'))
    .catch(err => console.log(err));

 
// handleBars middle ware
app.engine('handlebars', exphbs({
    defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

//middle ware for body-parser
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({
    extended: false
}));
// parse application/json
app.use(bodyParser.json());

//static folder
app.use(express.static(path.join(__dirname, 'public')));

//middleware for method-override
app.use(methodOverride('_method'));

//middleware for session
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));

//middle ware for passport
app.use(passport.initialize());
app.use(passport.session());

  //middleware for flash
app.use(flash());

// Global variable
app.use(function(req, res, next){
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.user = req.user || null;
    next();
});   

// routes Index
app.get('/', (req, res) => {
    res.render('index', {
        title: "Welcome"
    });
});

// abouts routes
app.get('/about', (req, res) => {
    res.render('about');
});

//use route
app.use('/ideas', ideas);
app.use('/users', users);

//passport config
require('./config/passport')(passport);

var port = process.env.PORT || 8080;
app.listen(port, () => {
    console.log(`Server is running at ${port}`);
});