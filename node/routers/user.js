var express = require('express');//引入express框架
var pg = require('pg');
var router = express.Router();//router是用来编写接口的
var pgConfig = "postgres://postgres:0608222@localhost:5432/webgis";


router.get('/get', function (req, res) {
    var client = new pg.Client(pgConfig);
    client.connect(function (isErr) {
        if (isErr) {
            console.log('connect error' + isErr.message);
            client.end();
            return;
        }
        const sql = {
            text: "SELECT * FROM public.user where name = $1",
            values: ['admin']
        }
        client.query(sql, function (isErr, rst) {
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
        })
    })
});

router.post('/insert', function (req, res) {
    res.send('user insert');
});

module.exports = router;