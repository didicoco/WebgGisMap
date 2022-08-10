var express = require('express');//异步调用，AMD
var app = express();//express方法的调用生成一个app实例
var user = require('./routers/user');
var home = require('./routers/home');

app.use('/', home);
app.use('/user', user);

app.listen(3001);//监听3001的端口