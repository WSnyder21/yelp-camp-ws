const express = require('express');
const app = express();
const morgan = require('morgan');

const AppError = require('./AppError');

app.use(morgan('tiny'));

const verifyPassword = ((req, res, next) => {
    const { password } = req.query;
    if (password === 'somePW') {
        next();
    }
    // res.status(401)
    // throw new Error('Password Required!')
    // res.send('ACCESS DENIED! MISSING OR INCORRECT PASSWORD!')
    throw new AppError('AppError Error!', 400);
})

app.get('/', (req, res) => {
    res.send('HOME PAGE!')
})
app.get('/dogs', (req, res) => {
    res.send('WOOF WOOF')
})

app.get('/secret', verifyPassword, (req, res) => {
    res.send('MY SECRET IS I dont like Harry Potter!');
})

app.get('/admin', (req, res) => {
    throw new AppError('You are not an Admin!', 403)
})

app.use((req, res) => {
    res.status(404).send('NOT FOUND!')
})

app.use((err, req, res, next) => {
    const { status = 500, message = 'Something Went Wrong' } = err;
    res.status(status).send(message)
})

app.listen(3000, () => {
    console.log('Running on PORT 3000')
})