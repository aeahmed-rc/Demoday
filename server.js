
// const express = require('express')
// const app = express()
// const bodyParser = require('body-parser')
// const MongoClient = require('mongodb').MongoClient
// var flash    = require('connect-flash');
// var db, collection;
//
// const url = 'mongodb+srv://ahmed:demoday@demodayproject-rjf56.mongodb.net/test?retryWrites=true&w=majority'
// const dbName = "demoday";
//
// app.listen(3000, () => {
//     MongoClient.connect(url, { useNewUrlParser: true }, (error, client) => {
//         if(error) {
//             throw error;
//         }
//         db = client.db(dbName);
//
//         console.log("Connected to `" + dbName + "`!");
//     });
// });
//
//
// app.set('view engine', 'ejs')
// app.use(bodyParser.urlencoded({extended: true}))
// app.use(bodyParser.json())
// app.use(express.static('public'))
//
// app.get('/', function(req, res) {
//       res.render('index.ejs');
//   });
//
//   app.get('/signup.ejs', function(req, res) {
//       res.render('signup.ejs');
//   });




var express  = require('express');
var app      = express();
var port     = process.env.PORT || 8080;
const MongoClient = require('mongodb').MongoClient
const ObjectId = require('mongodb').ObjectId
var mongoose = require('mongoose');
var passport = require('passport');
var flash    = require('connect-flash');
var http = require('http').createServer(app);
var io = require('socket.io')(http);

var morgan       = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
var session      = require('express-session');
const stringStrip= require("string-strip-html")
var configDB = require('./config/database.js');
// var apiKeys = require('./config/apikeys.js');
// const client = require('twilio')(accountSid, authToken);

var db

// configuration ===============================================================
mongoose.connect(configDB.url,  { useNewUrlParser: true }, (err, database) => {
  if (err) return console.log(err)
  db = database
  require('./app/routes.js')(app, passport, db, io, ObjectId,stringStrip);
}); // connect to our database

//app.listen(port, () => {
    // MongoClient.connect(configDB.url, { useNewUrlParser: true }, (error, client) => {
    //     if(error) {
    //         throw error;
    //     }
    //     db = client.db(configDB.dbName);
    //     console.log("Connected to `" + configDB.dbName + "`!");
    //     require('./app/routes.js')(app, passport, db);
    // });
//});

require('./config/passport')(passport); // pass passport for configuration

// set up our express application
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser.json()); // get information from html forms
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'))

app.set('view engine', 'ejs'); // set up ejs for templating

// // required for passport
app.use(session({
    secret: 'rcbootcamp2019a', // session secret
    resave: true,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session



// routes ======================================================================
//require('./app/routes.js')(app, passport, db); // load our routes and pass in our app and fully configured passport

// launch ======================================================================
app.listen(port);
console.log('The magic happens on port ' + port);








// const http = require('http');
// const fs = require('fs')
// const url = require('url');
// const querystring = require('querystring');
// const figlet = require('figlet')
//
// const server = http.createServer(function(req, res) {
//   // url.parse is a GET request
//   const page = url.parse(req.url).pathname;
//   const params = querystring.parse(url.parse(req.url).query);
//   console.log(page);
//   if (page == '/') {
//     fs.readFile('index.html', function(err, data) {
//       res.writeHead(200, {'Content-Type': 'text/html'});
//       res.write(data);
//       res.end();
//     });
//   }
//   else if (page == '/css/bootstrap.min.css') {
//     fs.readFile('css/bootstrap.min.css', function(err, data) {
//       // data is the callback the file otherpage is passed through data and a
//       res.writeHead(200, {'Content-Type': 'text/css'});
//       res.write(data);
//       res.end();
//     });
//   }
//   else if (page == '/css/owl.carousel.css') {
//     fs.readFile('css/owl.carousel.css', function(err, data) {
//       res.writeHead(200, {'Content-Type': 'text/css'});
//       res.write(data);
//       res.end();
//     });
//   }
//
//   else if(page == '/css/owl.theme.default.min.css'){
//     fs.readFile('css/owl.theme.default.min.css', function(err, data){
//       res.writeHead(200, {'Content-Type': 'text/css'});
//       res.write(data);
//       res.end();
//     })
//   }
//   else if (page == '/css/font-awesome.min.css'){
//     fs.readFile('css/font-awesome.min.css', function(err, data) {
//       res.writeHead(200, {'Content-Type': 'text/css'});
//       res.write(data);
//       res.end();
//     })
//   }
//   else if (page == '/css/tooplate-style.css'){
//     fs.readFile('css/tooplate-style.css', function(err, data) {
//       res.writeHead(200, {'Content-Type': 'text/css'});
//       res.write(data);
//       res.end();
//     })
//   }
//   else if (page == '/css?family=Open+Sans:300,300i,400'){
//     fs.readFile('css?family=Open+Sans:300,300i,400', function(err, data) {
//       res.writeHead(200, {'Content-Type': 'text/css'});
//       res.write(data);
//       res.end();
//     })
//   }
//   else if (page == '/js/jquery.js'){
//     fs.readFile('js/jquery.js', function(err, data) {
//       res.writeHead(200, {'Content-Type': 'text/javascript'});
//       res.write(data);
//       res.end();
//     })
// }
// else if (page == '/js/bootstrap.min.js'){
//   fs.readFile('js/bootstrap.min.js', function(err, data) {
//     res.writeHead(200, {'Content-Type': 'text/javascript'});
//     res.write(data);
//     res.end();
//   })
// }
// else if (page == '/js/jquery.stellar.min.js'){
//   fs.readFile('js/jquery.stellar.min.js', function(err, data) {
//     res.writeHead(200, {'Content-Type': 'text/javascript'});
//     res.write(data);
//     res.end();
//   })
// }
// else if (page == '/js/owl.carousel.min.js'){
//   fs.readFile('js/owl.carousel.min.js', function(err, data) {
//     res.writeHead(200, {'Content-Type': 'text/javascript'});
//     res.write(data);
//     res.end();
//   })
// }
// else if (page == '/js/smoothscroll.js'){
//   fs.readFile('js/smoothscroll.js', function(err, data) {
//     res.writeHead(200, {'Content-Type': 'text/javascript'});
//     res.write(data);
//     res.end();
//   })
// }
//
// else if (page == '/js/custom.js'){
//   fs.readFile('js/custom.js', function(err, data) {
//     res.writeHead(200, {'Content-Type': 'text/javascript'});
//     res.write(data);
//     res.end();
//   })
// }
//
//   else{
//     figlet('404!!', function(err, data) {
//       if (err) {
//           console.log('Something went wrong...');
//           console.dir(err);
//           return;
//       }
//       res.write(data);
//       res.end();
//     });
//   }
// });
//
// server.listen(8000);
// console.log("listening on 8000")
