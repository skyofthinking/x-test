var express = require('express');
var router = express.Router();
var url = require('url');
var AV = require('leancloud-storage');
var multiparty = require('multiparty');
var fs = require('fs');

var table_name = 'in_user';
var dest_path = 'd:/opt/dest/';

var result = {
    code: 20000,
    message: 'success',
    data: {}
};

router.use('/login', (req, res) => {
    var query = url.parse(req.url, true).query;
    var InUser = new AV.Query(table_name);
    InUser.equalTo('username', req.body.username);
    InUser.find().then(function (results) {
        result.data = results[0];
        res.send(result);
    }, function (error) {
        // 异常处理
        console.error(error);
    });
});

router.use('/logout', (req, res) => {
    res.send(result);
});

router.use('/info', (req, res) => {
    var query = url.parse(req.url, true).query;
    var InUser = new AV.Query(table_name);
    InUser.equalTo('token', query.token);
    InUser.find().then(function (results) {
        result.data = results[0];
        res.send(result);
    }, function (error) {
        // 异常处理
        console.error(error);
    });
});

router.use('/get', (req, res) => {
    var query = url.parse(req.url, true).query;

    var list = [];

    var InUser = new AV.Query(table_name);
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

    var InUser = new AV.Query(table_name);
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

router.post('/save', (req, res) => {
    var query = url.parse(req.url, true).query;
    var roles = [];

    // 生成multiparty对象，并配置上传目标路径
    var form = new multiparty.Form({ uploadDir: './public/files/' });
    // 上传完成后处理
    form.parse(req, function (err, fields, files) {
        var id = '';
        if (fields.id != null) {
            id = fields.id[0];
        }
        var inUser;
        if (id != '') {
            inUser = AV.Object.createWithoutData(table_name, id);
        } else {
            var InUser = AV.Object.extend(table_name);
            inUser = new InUser();
        }

        if (fields.role instanceof Array) {
            roles = fields.role;
        } else {
            roles.push(fields.role);
        }

        if (err) {
            console.log('parse error: ' + err);
        } else {
            console.log('parse files: ' + files);
            if (files.avatar != null && files.avatar.length > 0) {
                var avatar_obj = files.avatar[0];
                var source_path = avatar_obj.path;
                // 保存文件
                var avatar_data = fs.readFileSync(source_path);
                var avatar_file = new AV.File(avatar_obj.originalFilename, avatar_data);

                avatar_file.save().then(function (file) {
                    // 文件保存成功
                    inUser.set('role', roles);
                    inUser.set('token', fields.token[0] || '');
                    inUser.set('avatar', file.url());
                    inUser.set('name', fields.name[0] || '');
                    inUser.set('remark', fields.remark[0] || '');

                    inUser.save().then(function (object) {
                        res.send(result);
                    }, function (error) {
                        // 异常处理
                        console.error(error);
                    });

                    // Delete
                    fs.unlinkSync(source_path);
                }, function (error) {
                    // 异常处理
                    console.log(error);
                });
            } else {
                inUser.set('role', roles);
                inUser.set('token', fields.token[0] || '');
                inUser.set('name', fields.name[0] || '');
                inUser.set('remark', fields.remark[0] || '');

                inUser.save().then(function (object) {
                    res.send(result);
                }, function (error) {
                    // 异常处理
                    console.error(error);
                });
            }
        }
    });
});

router.use('/delete', (req, res) => {
    var query = url.parse(req.url, true).query;
    var roles = [];

    var inUser = AV.Object.createWithoutData(table_name, req.body.id);
    inUser.destroy().then(function (success) {
        res.send(result);
    }, function (error) {
        // 异常处理
        console.error(error);
    });
});

module.exports = router;