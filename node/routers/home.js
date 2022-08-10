var express = require('express');//引入express框架
var router = express.Router();//router是用来编写接口的

router.get('/', function (req, res) {
    res.send('hello world');
});


module.exports = router;