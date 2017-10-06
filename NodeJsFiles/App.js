const app = require("express")(),
      fs = require("fs"),
      bodyParser = require("body-parser"),
      cors = require("cors"),//using to solve Access-Control-Allow-Origin
      normalRouters = require("./routers/NormalRouters"),
      facebookAuthRouters = require("./routers/FacebookAuthRouters"),
      usernamePasswordRouters = require("./routers/UsernamePasswordRouters");
      // options = { // Config to use ssl
      //     key: fs.readFileSync('./ssl/privatekey.pem'),
      //     cert: fs.readFileSync('./ssl/server.crt'),
      // };
require('dotenv').config(); // Loading .env to process.env
// app.use("/dist", express.static(__dirname + '/dist'));
app.use(cors());
// app.use(bodyParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Use compression
// app.use(compress());

//define routers
// app.use(require("./UserRouter"));
app.use("/api/v1", normalRouters);
app.use("/api/v1/auth", facebookAuthRouters);
app.use("/api/v1/auth", usernamePasswordRouters);
/*
* This is set for AWS load balancer's healthy check.
*/
app.get("/healthcheck",function(req,res){
	res.send("ok");
});

app.listen(process.env.SERVER_PORT, _ => console.log("The service is started. port:" + process.env.SERVER_PORT));
/* Run a service without Express
var http = require('http');

http.createServer(function(req,res){
	res.writeHead(200, {'Content-Tyep':'text/plain'});
	res.end('Output result!/n');
}).listen(1337);
console.log('Server is listening 127.0.0.1:80');
*/
