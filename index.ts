import express from "express";
const app = express();

var env = require('dotenv').config();
var ejs = require('ejs');
var path = require('path');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);

mongoose.connect('mongodb+srv://Student:Student@cluster0.am7fvcj.mongodb.net/LoginSystem?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}, (err: any) => {
  if (!err) {
    console.log('MongoDB Connection Succeeded.');
  } else {
    console.log('Error in DB connection : ' + err);
  }
});

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
});

app.use(session({
  secret: 'work hard',
  resave: true,
  saveUninitialized: false,
  store: new MongoStore({
    mongooseConnection: db
  })
}));

app.set('views', path.join(__dirname, 'views'));
app.set("port", 3000);
app.set("view engine", "ejs");

app.use(express.static('public'))
app.use(express.json());
app.use(express.urlencoded({ extended: false }))


var index = require('./routes/index');
app.use('/', index);

app.use(function (req: any, res: any, next: any) {
    var err : any = new Error('File Not Found');
    err.status  = 404;
    next(err);
  });
  
  app.use(function (err : any, req : any, res : any, next : any) {
    res.status(err.status || 500);
    res.send(err.message);
  });


app.listen(app.get("port"), () => {
    console.log(`Web application started at http://localhost:${app.get("port")}`)
})