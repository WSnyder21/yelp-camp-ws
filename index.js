if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const session = require('express-session');
const flash = require('connect-flash');
const ExpressError = require('./utils/ExpressError');
const methodOverride = require('method-override');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user')
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');

const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/yelp-camp'

const userRoutes = require('./routes/users')
const campgroundRoutes = require('./routes/campground')
const reviewRoutes = require('./routes/reviews')

const MongoStore = require('connect-mongo');

// mongoose.connect('mongodb://localhost:27017/yelp-camp', {
//     useNewUrlParser: true,
//     useCreateIndex: true,
//     useUnifiedTopology: true
// });

main().catch(err => console.log(err));
async function main() {
    await mongoose.connect(dbUrl
    );
    console.log('CONNECTED!');
}

const app = express();

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

const secret = process.env.SECRET || 'thisshouldbeabettersecret';

const store = new MongoStore({
    mongoUrl: dbUrl,
    touchafter: 24 * 3600,
    crypto: {
        secret
    }
});

store.on('error', function (e) {
    console.log('Session Store Error!', e)
});

const sessionConfig = {
    store,
    secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        // secure: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7,
    }
}

app.use(mongoSanitize());
// app.use(helmet({
//     contentSecurityPolicy: false
// }));
app.use(
    helmet.permittedCrossDomainPolicies({
        permittedPolicies: "none"
    })
);

app.use(session(sessionConfig));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// app.get('/fakeUser', async (req, res) => {
//     const user = new User({ email: 'colttt@gmail.com', username: 'colttt' });
//     const newUser = await User.register(user, 'chicken');
//     res.send(newUser);
// })

app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

app.use('/', userRoutes);
app.use('/campgrounds', campgroundRoutes);
app.use('/campgrounds/:id/reviews', reviewRoutes);

app.get('/', (req, res) => {
    res.render('home')
})

app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found!', 404))
})
// app.use((err, req, res, next) => {
//     if (err.name === 'CastError') err = handleCastError(err)
//     next(err);
// })
app.use((err, req, res, next) => {
    const { statusCode = 500, message = 'Unexpected Error!' } = err;
    if (!err.message) err.message = 'Error!'
    res.status(statusCode).render('error', { err })
})

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Serving on PORT ${port}!`)
})