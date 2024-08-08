var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require('cors');
const port = process.env.PORT || 5000; //process.env.PORT 나중에
const bodyParser = require('body-parser');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var reportRouter = require('./routes/reportAPI');
const Map = require('./routes/MapRouter');
const MyPage =require('./routes/MyPageRouter');
const Maria = require('./db/connect/Maria');

//ORM Model영역의 sequelize 속성(DB연결객체)을 참조합니다.  
var sequelize = require('./models/index.js').sequelize;


var app = express();

// view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'ejs');

//mysql과 자동연결처리 및 모델기반 물리 테이블 생성처리제공
sequelize.sync(); 

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cors());

Maria.connect(); //db 연결

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/report', reportRouter);
app.use('/main', Map);
app.use('/mypage', MyPage);


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
