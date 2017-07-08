var express = require("express");
var fs = require("fs");
// var https = require("https");
var http = require("http");
var bodyParser = require("body-parser");
var cors = require("cors"); //using to solve Access-Control-Allow-Origin
// var compress = require("compression");
// var bodyParser = require('body-paser');
// var path = require('path');
var app = express();
// app.use("/dist", express.static(__dirname + '/dist'));
app.use(cors());
// app.use(bodyParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
// var port = 443;
var port=8080;
// Use compression
// app.use(compress());

// Config to use ssl
var options = {
    key: fs.readFileSync('./ssl/privatekey.pem'),
    cert: fs.readFileSync('./ssl/server.crt'),
};



//configure app
// app.set('view engine', 'ejs');
// app.set('views', path.join(__dirname, 'views'));

//use middleware
// app.use(bodyParser());
// app.use(express.static(path.join(__dirname, 'xxxxxxxx')));

//define routers
app.use(require("./UserRouter"));

// Start to listen 1337
// app.listen(80,function(){console.log("The service is started.");});


/*
* This is set for AWS load balancer's healthy check.
*/
app.get("/healthcheck",function(req,res){
	res.send("ok");
});

// Listen https request
// https.createServer(options,app).listen(port,function(){console.log("The service is started. port:"+port);});
http.createServer(app).listen(port,function(){console.log("The service is started. port:"+port);});
/* Run a service without Express
var http = require('http');

http.createServer(function(req,res){
	res.writeHead(200, {'Content-Tyep':'text/plain'});
	res.end('Output result!/n');
}).listen(1337);
console.log('Server is listening 127.0.0.1:80');
*/
