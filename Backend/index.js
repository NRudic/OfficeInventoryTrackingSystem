
'use strict';
const express = require('express');
const config = require('./config');
const cors = require('cors');
const app = express();
//const session = require('express-session');
const rootRouter = require('./routes');

app.use(cors());
app.use(express.json());

const morgan = require('morgan'); // FOR CONSOLE LOGGING HTTP REQUESTS
app.use(morgan('dev'));
/*
app.use(session({
    cookie: {
        secure: true,
        maxAge: 60000
    },
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}));
*/

app.use('/api', rootRouter);





app.use((req, res, next) => {
    const error = new Error('Not found');
    error.status = 404;
    next(error);
})
app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    })
})

app.listen(process.env.PORT, function () {
    console.log(`Server is running on port ${process.env.PORT}`);
});
