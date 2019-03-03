'use strict';

var MongoClient = require("mongodb").MongoClient;
const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
var url = "mongodb://localhost:27017/"
var areadb = "mongodb://localhost:27017/area"
const mongoose = require('mongoose');


const Schema = mongoose.Schema;

const userTestSchema = new Schema({
    login: String,
    password: String
});

const userTest = mongoose.model('users', userTestSchema);


var app = express()
app.use(express.static(__dirname))

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

// connect to MongoDB
url="mongodb://mongo:27017/area"
areadb="mongodb://mongo:27017/area"
mongoose.connect('mongodb://mongo:27017/area', {
  useNewUrlParser: true
})
.then (() => console.log('MongoDB connected'))
.catch((err) => {
  console.log("Failed to connect to db");
  mongoose.connect('mongodb://localhost:27017/area', {
    useNewUrlParser: true
  })
  .catch((err) => {
    console.error("ERROR: mongoDB not running\n" + err.stack)
    process.exit(1)
  })
});

// app.get('/', function (req, res) {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header("Access-Control-Allow-Headers", "X-Requested-With");
//   res.json({ a:1, b:'hello' });
// })

app.post('/register', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    console.log('username: ' + req.body.username);
    console.log('email: ' + req.body.email);
    console.log('password: ' + req.body.password);
    MongoClient.connect(areadb, function(err, db) {
	var dbo = db.db("AREA");
	var myobj = {
	    username: req.body.username,
	    email: req.body.email,
      password: req.body.password,
      password_confirm: req.body.password_confirm
	};

  dbo.collection("users").find({
    email: myobj.email
  }).toArray(function(err, result) {
    if (myobj.password != myobj.password_confirm) {
      res.json('failed_password');
      console.log('failed_password');
    }
    else if (result.length == 0) {
      dbo.collection("users").insertOne(myobj, function(err, res) {})
      res.json("success");
      console.log('success');
    } else {
      res.json('failed');
      console.log('failed');
    }
  });
});
//    res.json(req.body.id);
})

app.post('/login', function (req, res) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  console.log('email: ' + req.body.email);
  console.log('password: ' + req.body.password);
  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db("AREA");
    var myobj = {
  	    email: req.body.email,
        password: req.body.password
  	};
    dbo.collection("users").find({
      email: myobj.email
    }).toArray(function(err, result) {
      if (err) throw err;
      console.log(result);
      if (result.length != 0) {
        dbo.collection("users").find({
          email: myobj.email,
          password: myobj.password
        }).toArray(function(err, result) {
          if (err) throw err;
          console.log(result);
          if (result.length != 0) {
            res.json("success");
            console.log('success');
          }
          else {
            res.json('wrong password');
            console.log('wrong password');
          }

        })
      } else {
        res.json('email not found');
        console.log('email not found');
      }
      db.close();
    });
  });
//    res.json(req.body.id);
})

app.post('/token/spotify', function(req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    var token = req.body.access_token;
    res.json(req.body);
})

app.post('/token/deezer', function(req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    var token = req.body.access_token;
    res.json(req.body);
})

app.post('/token/insta', function(req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    var token = req.body.access_token;
    res.json(req.body);
})

app.listen(8080, function () {
  console.log('API listening on port 8080!');
})
