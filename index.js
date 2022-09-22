var express = require('express');
var bodyParser = require('body-parser');
var mysql = require('mysql');
var config = require('./config');
var session = require('express-session');
var nodemailer = require('nodemailer');
var cors = require('cors');
const { Pool, Client } = require('pg')

//=========== API modules ===================
var auth = require('./api/auth');

//=========== Create server ===================
var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
//app.use(cors());
var corsOptions = {
	"methods": "GET, POST, PUT, PATCH, DELETE, OPTIONS",
	"preflightContinue": false,
	credentials: true,
	origin: function (origin, callback){
		console.log("Origin is: " + origin);
		if (origin == "http://localhost:3000") return callback(null, true);
		if (true) {
			return callback(null, true);
		}
		else{
			return callback(null, false);
		}
	},
	"optionsSuccessStatus": 204 // some legacy browsers (IE11, various SmartTVs) choke on 204
}
app.options('*', cors(corsOptions));
//app.use(cors(corsOptions));

app.use(function(req, res, next) {

	// Website you wish to allow to connect
	// //have you check oringin in header
	console.log(req.headers.origin);
	res.setHeader('Access-Control-Allow-Origin', "http://localhost:3000");
	console.log(req.headers.origin);
	//res.setHeader('Access-Control-Allow-Origin', req.headers.origin);

	// Request methods you wish to allow
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');

	// Request headers you wish to allow
	res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization');

	// Set to true if you need the website to include cookies in the requests sent
	// to the API (e.g. in case you use sessions)
	res.setHeader('Access-Control-Allow-Credentials', true);

	// Pass to next layer of middleware
	next();
});

app.use(function (req, res, next) {
	try {
		/*option request handle */
		if (req.method === 'OPTIONS') {
			// //   console.log('!OPTIONS');
			var headers = {};
			// // IE8 does not allow domains to be specif	ied, just the *
			let origin = req.headers.origin;
			headers["Access-Control-Allow-Origin"] = 'http://localhost:3000';
			headers["Access-Control-Allow-Methods"] = 'GET, POST, PUT, PATCH, DELETE, OPTIONS';
			headers["Access-Control-Allow-Credentials"] = true;
			headers["Access-Control-Max-Age"] = "86400"; // 24 hours
			headers["Access-Control-Allow-Headers"] = "origin, X-Requested-With, Content-Type, Accept";
			// headers["Access-Control-Allow-Headers"] = "X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept";
			res.writeHead(200, headers);
			return res.end();
		}
		else { next();}
	}
	catch(ex){
		console.log(ex);
	}
});
// initialize express-session to allow us track the logged-in user across sessions.
// app.use(session({
// 	key: 'user_id',
// 	secret: config.session_encryption,
// 	resave: false,
// 	saveUninitialized: true,
// 	cookie: {
// 		maxAge: config.session_expiration
// 	}
// }))

// This middleware will check if user's cookie is still saved in browser and user is not set, then automatically log the user out.
// This usually happens when you stop your express server after login, your cookie still remains saved in the browser.
// var checkAuth = function(req, res, next) {
// 	if (!req.session.user_id) {
// 		res.send("Please Login");
// 	} else {
// 		next();
// 	}
// }

//=========== Mysql connect ===================

const client = new Client({
	user: config.db_user,
	host: config.db_host,
	database: config.db_name,
	password: config.db_password,
	port: config.db_port,
})
client.connect()

client.query('SELECT NOW()', (err, res) => {
	if (err) {
		console.error('pg Connection Error: ' + err.message);
		process.exit();
	}
	console.log("pg server connected ....");
})

//========= Import api module ==================
auth(app, client);


app.listen(config.port, "0.0.0.0", function () {
	console.log('Server is running on port =' + config.port);
});
