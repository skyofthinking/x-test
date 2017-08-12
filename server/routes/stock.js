var express = require('express');
var router = express.Router();
var url = require('url');
var AV = require('leancloud-storage');
var table_name = 'in_user';

var result = {
    code: 20000,
    message: 'success',
    data: {}
};

router.use('/get', (req, res) => {
    var query = url.parse(req.url, true).query;
    var list = [];

    var InEntity = new AV.Query(table_name);
    InEntity.get(query.id).then(function (user) {
        list.push(user)

        result.data = list;
        res.send(result);
    }, function (error) {
        // 异常处理
        console.error(error);
    });
});

router.use('/list', (req, res) => {
    var InEntity = new AV.Query(table_name);
    InEntity.find().then(function (results) {
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

    var InEntity = AV.Object.extend(table_name);
    var inEntity = new InEntity();
    inEntity.save({
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

    var inEntity = AV.Object.createWithoutData(table_name, query.id);
    inEntity.set('role', roles);
    inEntity.set('token', query.token || '');
    inEntity.set('avatar', 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif');
    inEntity.set('name', query.name || '');
    inEntity.set('remark', query.remark || '');
    inEntity.save().then(function (object) {
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

    var inEntity = AV.Object.createWithoutData(table_name, query.id);
    inEntity.destroy().then(function (success) {
        res.send(result);
    }, function (error) {
        // 异常处理
        console.error(error);
    });
});

module.exports = router;