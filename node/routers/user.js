var express = require('express');//引入express框架
var pg = require('pg');
var router = express.Router();//router是用来编写接口的
var pgConfig = "postgres://postgres:0608222@localhost:5432/webgis";//连接pg数据库


//获取用户信息
router.get('/get', function (req, res) {
    var name = req.query.name;
    var client = new pg.Client(pgConfig);
    client.connect(function (isErr) {
        if (isErr) {
            console.log('connect error' + isErr.message);
            client.end();
            return;
        }
        client.query('SELECT * FROM public.user where name =$1', [name], function (isErr, rst) {
            if (isErr) {
                console.log('query error:' + isErr.message);
                res.send({
                    status: 'fail',
                    msg: 'query error'
                });
            } else {
                console.log('query success,data is:' + rst);
                console.log(JSON.parse(JSON.stringify(rst)));
                res.send({
                    status: 'success',
                    data: rst.rows
                });
            }
            client.end();
        });
    });
});

//用户注册接口
router.post('/insert', function (req, res) {
    var client = new pg.Client(pgConfig);
    client.connect(function (isErr) {
        if (isErr) {
            console.log('connect error' + isErr.message);
            client.end();
            return;
        }
        client.query('INSERT INTO public."user" (name, password, phone, email) VALUES ($1, $2, $3, $4)', ['xie', '123456', '17625922185', '398514470@qq.com'], function (isErr, rst) {
            if (isErr) {
                console.log('insert error:' + isErr.message);
                res.send({
                    status: 'fail',
                    msg: 'insert error'
                });
            } else {
                console.log('insert success,data is:' + rst);
                console.log(JSON.parse(JSON.stringify(rst)));
                res.send({
                    status: 'success',
                    data: []
                });
            }
            client.end();
        });
    });
});

module.exports = router;