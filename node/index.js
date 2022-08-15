var express = require('express');//异步调用，AMD
var app = express();//express方法的调用生成一个app实例
var user = require('./routers/user');
var home = require('./routers/home');
//设置跨域访问（一般是后端处理跨域，前端可以用代理解决跨域）
app.all("*", function (req, res, next) {
    //设置允许跨域的域名，*代表允许任意域名跨域
    res.header("Access-Control-Allow-Origin", "*");
    //允许的header类型
    res.header("Access-Contro1-Allow-Headers", "content-type");
    //跨域允许的请求方式
    res.header("Access-Control-Allow-Methods", "DELETE,PUT,POST,GET,OPTIONS");
    if (req.method.toLowerCase() == 'options ')
        res.send(200);//让options尝试请求快速结束else
    next();
})


app.use('/', home);
app.use('/user', user);
app.listen(3001);//监听3001的端口


