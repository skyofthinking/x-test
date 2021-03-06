var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var fs = require('fs');

// init
var initLeanCloud = require('./utils/initleancloud');
initLeanCloud();

var stockApi = require('./routes/stock');
var userApi = require('./routes/user');
var tableApi = require('./routes/table');

var app = express();
var ejs = require('ejs');

//allow custom header and CORS
app.all('*', function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With, X-Token');
    res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
    res.header("X-Powered-By", ' 3.2.1')
    res.header("Content-Type", "application/json;charset=utf-8");
    
    if (req.method == 'OPTIONS') {
        res.send(200); // 让options请求快速返回
    }
    else {
        next();
    }
});

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.engine('.html', ejs.__express);
app.set('view engine', 'html'); // app.set('view engine', 'ejs');

app.use(favicon(path.join(__dirname, 'favicon', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// 处理webpack服务请求
app.get('/__webpack_hmr', function (req, res) {
    res.send('')
})

app.get('/', (req, res) => {
    res.redirect('app');
});

app.use('/list', (req, res) => {
    res.render('index');
});

// API路由
app.use('/stock', stockApi);
app.use('/user', userApi);
app.use('/table', tableApi);

app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;