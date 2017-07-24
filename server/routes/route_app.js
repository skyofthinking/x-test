let url = require('url');
let AV = require('leancloud-storage');
let initLeanCloud = require('../utils/initleancloud');
initLeanCloud();

function sendData(req, res) {
    // let query = url.parse(req.url, true).query
    // let name = query.name || ''
    // let city = query.city
    let result = {
        code: 20000,
        message: 'success',
        data: {}
    };

    let query = new AV.Query('in_user');
    query.find().then(function (results) {
        for (var i = 0; i < results.length; i++) {
            console.log(results[i].get("name"));
        }

        result.data = results;
        res.send(result);
    }, function (error) {
    });
}

exports.index = (req, res) => {
    res.render('index');
}

exports.stock_list = (req, res) => {
    sendData(req, res);
}

/*
    let InUser = AV.Object.extend('in_user');
    let inUser = new InUser();
    inUser.save({
        role: ['admin'],
        token: 'admin',
        introduction: '超级管理员',
        avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
        name: 'Super Admin'
    }).then(function (object) {
        console.log('object id = ' + object.id);
    }, function (error) {
        console.error(error);
    });

    let InStock = AV.Object.extend('in_stock');
    let inStock = new InStock();
    inStock.save({
        name: '兴业银行',
        code: '601166',
        market: "CN",
        subdivision: "SH"
    }).then(function (object) {
        console.log('object id = ' + object.id);
    }, function (error) {
        console.error(error);
    });
*/
exports.stock_insert = (req, res) => {
    var query = url.parse(req.url, true).query;
    var roles = [];

    if (query.role instanceof Array) {
        roles = query.role;
    } else {
        roles.push(query.role);
    }

    var result = {
        code: 20000,
        message: 'success',
        data: {}
    };

    var InUser = AV.Object.extend('in_user');
    var inUser = new InUser();
    inUser.save({
        role: roles,
        token: query.token,
        avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
        name: query.name || '',
        remark: query.remark || ''
    }).then(function (object) {
        console.log('object id = ' + object.id);

        res.send(result);
    }, function (error) {
        console.error(error);
    });
}

exports.stock_update = (req, res) => {
    var query = url.parse(req.url, true).query;
    var roles = [];

    if (query.role instanceof Array) {
        roles = query.role;
    } else {
        roles.push(query.role);
    }

    var result = {
        code: 20000,
        message: 'success',
        data: {}
    };

    var inUser = AV.Object.createWithoutData('in_user', query.id);
    inUser.set('role', roles);
    inUser.set('token', query.token || '');
    inUser.set('avatar', 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif');
    inUser.set('name', query.name || '');
    inUser.set('remark', query.remark || '');
    inUser.save().then(function (object) {
        console.log('object id = ' + object.id);

        res.send(result);
    }, function (error) {
        console.error(error);
    });
}

exports.stock_delete = (req, res) => {
    var query = url.parse(req.url, true).query;
    var roles = [];

    var result = {
        code: 20000,
        message: 'success',
        data: {}
    };

    var todo = AV.Object.createWithoutData('in_user', query.id);
    todo.destroy().then(function (success) {
        res.send(result);
    }, function (error) {
    });
}