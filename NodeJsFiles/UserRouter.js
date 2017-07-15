var express = require("express");
var mongoDB = require("./MongoDB");
var axios = require("axios"); //Using axios to fetch data from FieldBook
var md5 = require("md5"); //Using md5 library
const USERNAME = "resonancecode_webuser", PASSWORD = "cyJz2b4vGb3EgHRf0Khq"; //username and password for client
// var path = require('path');
// var jsonParser = bodyParser.json();
var router = express.Router();


var userApiPrefixUrl = "/resonancecode/api/v1/";


/***********************************************************************
************* using to solve Access-Control-Allow-Origin  **************
************ Also check the authentication  **************
***********************************************************************/
router.post("/resonancecode/api/v1/*", function(req, res, next) {
  // res.header("Access-Control-Allow-Origin", "*");
  // res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  // res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
  // res.header("Access-Control-Allow-Credentials", "true");
  // console.log(req);
  // Start to check the authentication

  if(req.body && req.body.auth && req.body.auth.un && req.body.auth.pd){
    if (req.body.auth.un==USERNAME && req.body.auth.pd==PASSWORD) next();
    else res.send("Unauthenticated call!");
  } else res.send("Unauthenticated call!");
});

router.put("/resonancecode/api/v1/*", function(req, res, next) {
  if(req.body && req.body.auth && req.body.auth.un && req.body.auth.pd){
    if (req.body.auth.un==USERNAME && req.body.auth.pd==PASSWORD) next();
    else res.send("Unauthenticated call!");
  } else res.send("Unauthenticated call!");
});

router.get("/resonancecode/api/v1/*", function(req, res, next) {
  // console.log(req);
  if((req.query.un && req.query.pd && req.query.un==USERNAME && req.query.pd==PASSWORD) ) next();
  else res.send("Unauthenticated call!");
});
router.delete("/resonancecode/api/v1/*", function(req, res, next) {
  // console.log(req.query);
  if(req.query.un && req.query.pd && req.query.un==USERNAME && req.query.pd==PASSWORD) next();
  else res.send("Unauthenticated call!");
});

// /*********  index page  ************/
// router.get("/",function(req,res){
//   res.sendFile(path.resolve(__dirname+"/dist/index.html"));
// });


/****************************  Login   ******************************************/
router.get(`${userApiPrefixUrl}login`, (req, res)=>{
  // console.log("Called Login!*********");
	mongoDB.getUser(req.query.username, md5(req.query.password), (result)=>{
    // console.log(result);
		res.send(result);
	});
	// res.send(`${req.query.username}:${req.query.password}`);
});

/**********************  Create a new reading  ****************************/
router.post(`${userApiPrefixUrl}reading`, (req,res)=>{
  mongoDB.createReading(req.body.reading, (result)=>{
    res.end();
  });
  // res.send(req.body.reading);
});

/**********************  Create a new journal  ****************************/
router.post(`${userApiPrefixUrl}journal_entries`, (req,res)=>{
  // console.log("post journal");
  mongoDB.createJournal(req.body.journal, (result)=>{
    res.send(result);
  });
  // res.send(req.body.reading);
});

/********************** Update a journal  ****************************/
router.put(`${userApiPrefixUrl}journal_entries`, (req,res)=>{
  // console.log("put journal");
  mongoDB.updateJournal(req.body.journal, (result)=>{
    res.send(result);
  });
  // res.send(req.body.reading);
});

/********************** Update a hexagram  ****************************/
router.put(`${userApiPrefixUrl}hexagram`, (req,res)=>{
  // console.log("put journal");
  mongoDB.updateHexagram(req.body.hexagram, (result)=>{
    res.send(result);
  });
  // res.send(req.body.reading);
});

/****************   Finding readings   ***********************/
router.get(`${userApiPrefixUrl}reading`, (req, res)=>{
  mongoDB.getRecentReadings(req.query.start_number, req.query.limited_number, req.query.user_id, (result)=>{
    // console.log(result);
    res.send(result);
  })
});

/*****************  Fetching hexagrams data  ***********************************/
router.get(`${userApiPrefixUrl}hexagram`, (req, res)=>{
  mongoDB.getHexagram(req.query.img_arr, (result)=>{
    // console.log(result);
    res.send(result);
  });
});

/**************  Fetching line grams data from readings  ********************/
router.get(`${userApiPrefixUrl}getLinesForHexagram`, (req, res)=>{
  let queryObject = [{line_13_id:req.query.line_13_id_1, line_25_id:req.query.line_25_id_1, line_46_id:req.query.line_46_id_1}, {line_13_id:req.query.line_13_id_2, line_25_id:req.query.line_25_id_2, line_46_id:req.query.line_46_id_2}];
  // console.log("****************",queryObject);
  mongoDB.getLinesBigrams(queryObject, (result)=>{
    // console.log(result);
    res.send(result);
  });
});

/***************  Getting journals list  *********************/
router.get(`${userApiPrefixUrl}getJournals`,(req, res)=>{
  let queryObject={readingId: req.query.readingId, userId: req.query.userId};
  mongoDB.getJournalList(queryObject, (result)=>{
    // console.log(result.journal_entries);
    res.send(result);
  });
});

/***************  Getting one journal  *********************/
router.get(`${userApiPrefixUrl}getJournal`,(req, res)=>{
  mongoDB.getJournal(req.query.journalId, (result)=>{
    // console.log(result);
    res.send(result);
  });
});

/***************  Getting hexagrams  *********************/
router.get(`${userApiPrefixUrl}getHexagrams`,(req, res)=>{
  // delete req.query.un;
  // delete req.query.pd;  // Delete un and pd properties
  mongoDB.getHexagrams(req.query, (result)=>{
    // console.log(result);
    res.send(result);
  });
});

/***************  Getting readings by hexagram's id  *********************/
router.get(`${userApiPrefixUrl}getReadingsByHexagramId`,(req, res)=>{
  mongoDB.getReadingsByHexagramId(req.query.imageArray, req.query.userId, (result)=>{
    // console.log(result);
    res.send(result);
  });
});

/***************  Getting readings by searching criterias  *********************/
router.get(`${userApiPrefixUrl}searchReadings`,(req, res)=>{
  mongoDB.getSearchReadings(req.query, (result)=>{
    // console.log(result);
    res.send(result);
  });
});


/*****************  Delete reading  ******************************/
router.delete(`${userApiPrefixUrl}deleteReading`, (req, res)=>{
  // console.log("delete",req.query.reading_id, req.query.user_id);
  mongoDB.deleteReading(req.query.reading_id, req.query.user_id, (result)=>{
    // console.log("result:",result);
    res.end();
  });
});

/*******************  Delete one journal   *************************/
router.delete(`${userApiPrefixUrl}deleteJournal`, (req, res)=>{
  mongoDB.deleteJournal(req.query.readingId, req.query.journalId, (result)=>{
    // console.log("result:",result);
    res.end();
  });
});

module.exports = router;
