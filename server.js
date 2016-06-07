var express         = require('express');
var app             = express();
var bodyParser      = require('body-parser');
var methodOverride  = require('method-override');
var helmet          = require('helmet');
var passport        = require('passport');
var expressSession  = require('express-session');
var dbConfig        = require('./config/db.js');
var mongoose        = require('mongoose');
var flash           = require('connect-flash');
var morgan          = require('morgan');
var cookieParser    = require('cookie-parser');
var session         = require('express-session');
var port            = process.env.PORT || 1892;

mongoose.connect(dbConfig.url);

var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));

db.once('open', function () {
  console.log('Database Connection Status: ' + mongoose.connection.readyState);
});

require('./config/passport')(passport);

app.set('view engine', 'pug');

app.use(helmet());
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride('X-HTTP-Method-Override'));
app.use(express.static(__dirname + '/views'));
app.use(session({ secret: 'dog' }));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

require('./app/routes')(app, passport);

app.listen(port);

console.log('http://localhost:' + port);

exports = module.exports = app;
