var express = require('express');
var app = express();
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var session = require('express-session');

var uri = 'mongodb://localhost:27017/PHUCMINH';
mongoose.connect(uri, {
	useNewUrlParser: true,
	useUnifiedTopology: true
	
})

.catch(err => console.log(err));

var indexRouter = require('./routes/index');
var authRouter = require('./routes/auth');
var chudeRouter = require('./routes/chude');
var taikhoanRouter = require('./routes/taikhoan');
var baivietRouter = require('./routes/baiviet');

app.set('views', './views');
app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(session({
	name: 'iNews',						// Tên session
	secret: 'Black cat eat black mouse',// Khóa bảo vệ
	resave: true,
	saveUninitialized: true,
	cookie: {
		maxAge: 30 * 86400000			// 30 * (24 * 60 * 60 * 1000) - Hết hạn sau 30 ngày
	}
}));
app.use(function(req, res, next){
	res.locals.session = req.session;
	res.locals.errorMsg = '';
	res.locals.successMsg = '';
	
	var error = req.session.error;
	var success = req.session.success;
	delete req.session.error;
	delete req.session.success;
	
	if (error) res.locals.errorMsg = error;
	if (success) res.locals.successMsg = success;
	
	next();
});

app.use('/', indexRouter);
app.use('/', authRouter);
app.use('/chude', chudeRouter);
app.use('/taikhoan', taikhoanRouter);
app.use('/baiviet', baivietRouter);

app.listen(3000, () => {
	console.log('Server is running at http://127.0.0.1:3000');
});