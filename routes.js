var express = require('express');
var app = express();
var path = require('path');

app.get('/', function(req, res){
  console.log('request');
  console.log(req);
  console.log('result');
  console.log(res);
  res.sendFile(path.join(__dirname + '/index.html'));
});

var adminRouter = express.Router();

adminRouter.use(function(req, res, next){
  console.log(req.method, req.url);
  next();
});

adminRouter.get('/', function(req, res) {
  res.send('I am the dashboard');
});

adminRouter.get('/users', function(req, res) {
  res.send('I show all the users');
});

adminRouter.get('/posts', function(req, res){
  res.send('I show all the posts!');
});

adminRouter.param('name', function(req, res, next, name){
  console.log('validating ' + name);
  next();
});

adminRouter.get('/users/:name', function(req, res){
  //res.send(req.params);
  res.send('hello ' + req.params.name + '!');
});

app.use('/admin', adminRouter);

app.route('/login')
  .get(function(req, res){
    res.send('this is the login form');
  })
  .post(function(req, res){
    res.send('processing login form');
  });

app.listen(1337);

console.log('http://localhost:1337');
