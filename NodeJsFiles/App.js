const app = require('express')();
const fs = require('fs');
const bodyParser = require('body-parser');
const cors = require('cors'); // using to solve Access-Control-Allow-Origin
const normalRouters = require('./routers/NormalRouters');
const facebookAuthRouters = require('./routers/FacebookAuthRouters');
const googleAuthRouters = require('./routers/GoogleAuthRouters');
const usernamePasswordRouters = require('./routers/UsernamePasswordRouters');
const https = require('https');

const credentials = { // Config to use ssl
  key: fs.readFileSync('/etc/letsencrypt/live/kairoscope.resonance-code.com/privkey.pem'),
  cert: fs.readFileSync('/etc/letsencrypt/live/kairoscope.resonance-code.com/fullchain.pem'),
};

require('dotenv').config(); // Loading .env to process.env
// app.use("/dist", express.static(__dirname + '/dist'));
app.use(cors());
// app.use(bodyParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Use compression
// app.use(compress());

// define routers
// app.use(require("./UserRouter"));
app.use('/api/v1', normalRouters);
app.use('/api/v1/auth', facebookAuthRouters);
app.use('/api/v1/auth', googleAuthRouters);
app.use('/api/v1/auth', usernamePasswordRouters);
/*
* This is set for AWS load balancer's healthy check.
*/
app.get('/healthcheck', (req, res) => {
  res.send('ok');
});

// Production https server.
https.createServer(credentials, app).listen(process.env.SERVER_PORT, _ => console.log(`The service is started. port:${process.env.SERVER_PORT}`));

// Using for creating a http server. Development mode.
// app.listen(process.env.SERVER_PORT, _ => console.log(`The service is started. port:${process.env.SERVER_PORT}`));


/* Run a service without Express
var http = require('http');

http.createServer(function(req,res){
  res.writeHead(200, {'Content-Tyep':'text/plain'});
  res.end('Output result!/n');
}).listen(1337);
console.log('Server is listening 127.0.0.1:80');
*/
