var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');
var bodyParser = require('body-parser');
const redis = require('redis');
const redisClient = redis.createClient({
    legacyMode: true
});

var indexRouter = require('./routes/index');
var usersRouter = require('./user/user.routes');
var authRouter = require('./auth/auth.routes');
var bannerRouter = require('./banner/banner.routes');
var productRouter = require('./product/product.routes');


var app = express();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


// (async () => {
//     await redisClient.connect();
//     console.log("Redis Client Connected");
// })()

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/auth', authRouter);
app.use('/products', productRouter);
app.use('/banners', bannerRouter);



// error handler
// app.use(function (err, req, res, next) {
//     // set locals, only providing error in development
//     res.locals.message = err.message;
//     res.locals.error = req.app.get('env') === 'development' ? err : {};

//     // render the error page
//     res.status(err.status || 500);
//     res.send('error');
// });

module.exports = app;
