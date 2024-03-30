var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
const http = require('http');
var logger = require('morgan');
require('dotenv').config();
const SocketIo = require('socket.io')
const cors = require('cors');

// const server = http.createServer(app);


// const io =SocketIo(server,{
//   cors:{
//     origin:"http://localhost:3000",
//     methods:["GET","POST"],

//   },
// });

// io.on('connection', (socket) => {
//   console.log("A user connected ");

//   socket.on("disconnect", ()=>{
//     console.log("User disconnected");
// });

// socket.on("chat message",(msg)=>{
//   console.log("message"+msg);
//   io.emit("chat message ",msg); 
//   });
// });

const MongodbUrl = process.env.MONGODBURL

var adminRouter = require('./routes/admin');
var usersRouter = require('./routes/users');
var workspaceRouter  =require('./routes/workspace');
var chatRouter = require('./routes/ChatRoute');
var messageRouter = require('./routes/MessageRouter');
 
var app = express();



const corsOptions = {
  origin: 'http://localhost:3000',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  optionsSuccessStatus: 204,
  allowedHeaders: 'Content-Type,Authorization',
};

app.use(cors(corsOptions));

var mongoose = require('mongoose');
const { Socket } = require('dgram');
mongoose.connect(MongodbUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', adminRouter);
app.use('/', usersRouter);
app.use('/',workspaceRouter);
app.use('/',chatRouter);
app.use('/',messageRouter);



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
