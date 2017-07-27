var express = require('express');
var router = express.Router();
var url = require('url');
var AV = require('leancloud-storage');

router.use('/login', (req, res) => {
    var query = url.parse(req.url, true).query;

    var result = {
        code: 20000,
        message: 'success',
        data: {}
    };

    var InUser = new AV.Query('in_user');
    InUser.equalTo('name', query.name);
    InUser.find().then(function (results) {
        result.data = results;
        res.send(result);
    }, function (error) {
    });
});

router.use('/get', (req, res) => {
    var query = url.parse(req.url, true).query;

    var result = {
        code: 20000,
        message: 'success',
        data: {}
    };

    var list = [];

    var InUser = new AV.Query('in_user');
    InUser.get(query.id).then(function (user) {
        list.push(user)

        result.data = list;
        res.send(result);
    }, function (error) {
        // 异常处理
        console.error(error);
    });
});

router.use('/list', (req, res) => {
    let result = {
        code: 20000,
        message: 'success',
        data: {}
    };

    var InUser = new AV.Query('in_user');
    InUser.find().then(function (results) {
        for (var i = 0; i < results.length; i++) {
            console.log(results[i].get("name"));
        }

        result.data = results;
        res.send(result);
    }, function (error) {
        // 异常处理
        console.error(error);
    });
});

router.use('/insert', (req, res) => {
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
        // 异常处理
        console.error(error);
    });
});

router.use('/update', (req, res) => {
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
        // 异常处理
        console.error(error);
    });
});

router.use('/delete', (req, res) => {
    var query = url.parse(req.url, true).query;
    var roles = [];

    var result = {
        code: 20000,
        message: 'success',
        data: {}
    };

    var inUser = AV.Object.createWithoutData('in_user', query.id);
    inUser.destroy().then(function (success) {
        res.send(result);
    }, function (error) {
        // 异常处理
        console.error(error);        
    });
});

module.exports = router;