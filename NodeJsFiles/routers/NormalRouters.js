const USERNAME = "resonancecode_webuser", PASSWORD = "cyJz2b4vGb3EgHRf0Khq"; //username

const normalRouter = require("express").Router(),
      mongodb = require("../MongoDB"),
      API_BASE_URL = "/",
      axios = require("axios"),
      querystring = require("querystring"),
      jwt = require("jsonwebtoken");


/***********************************************************************
************* using to solve Access-Control-Allow-Origin  **************
************ Also check the authentication  **************
***********************************************************************/
normalRouter.post("/resonancecode/api/v1/*", function(req, res, next) {
    if(req.body && req.body.auth && req.body.auth.un && req.body.auth.pd){
    if (req.body.auth.un==USERNAME && req.body.auth.pd==PASSWORD) next();
    else res.send("Unauthenticated call!");
  } else res.send("Unauthenticated call!");
});

normalRouter.put("/resonancecode/api/v1/*", function(req, res, next) {
  if(req.body && req.body.auth && req.body.auth.un && req.body.auth.pd){
    if (req.body.auth.un==USERNAME && req.body.auth.pd==PASSWORD) next();
    else res.send("Unauthenticated call!");
  } else res.send("Unauthenticated call!");
});

normalRouter.get("/resonancecode/api/v1/*", function(req, res, next) {
  // console.log(req);
  if((req.query.un && req.query.pd && req.query.un==USERNAME && req.query.pd==PASSWORD) ) next();
  else res.send("Unauthenticated call!");
});
normalRouter.delete("/resonancecode/api/v1/*", function(req, res, next) {
  // console.log(req.query);
  if(req.query.un && req.query.pd && req.query.un==USERNAME && req.query.pd==PASSWORD) next();
  else res.send("Unauthenticated call!");
});

// /*********  index page  ************/
// normalRouter.get("/",function(req,res){
//   res.sendFile(path.resolve(__dirname+"/dist/index.html"));
// });

/*Checking jwt token*/
normalRouter.get(API_BASE_URL + "jwtMessageVerify", (req, res) => {
  res.json(verifyJWT({message: req.query.jwtMessage, res}));
  /*try{
    res.status(200);
    res.json(jwt.verify(req.body.jwtMessage, process.env.JWT_SECERT));
  } catch(e){
    res.status(200);
    res.json({isAuth: false});
  }*/

});



/****************************  Login   ******************************************/
/*normalRouter.get(`${API_BASE_URL}login`, (req, res)=>{
  // console.log("Called Login!*********");
	mongodb.getUser(req.query.username, md5(req.query.password), (result)=>{
    // console.log(result);
		res.send(result);
	});
	// res.send(`${req.query.username}:${req.query.password}`);
});*/

/**********************  Create a new reading  ****************************/
normalRouter.post(`${API_BASE_URL}reading`, (req,res)=>{
  mongodb.createReading(req.body.reading, (result)=>{
    res.end();
  });
  // res.send(req.body.reading);
});

/**********************  Create a new journal  ****************************/
normalRouter.post(`${API_BASE_URL}journal_entries`, (req,res)=>{
  // console.log("post journal");
  mongodb.createJournal(req.body.journal, (result)=>{
    res.send(result);
  });
  // res.send(req.body.reading);
});

/********************** Update a journal  ****************************/
normalRouter.put(`${API_BASE_URL}journal_entries`, (req,res)=>{
  // console.log("put journal");
  mongodb.updateJournal(req.body.journal, (result)=>{
    res.send(result);
  });
  // res.send(req.body.reading);
});

/********************** Update a hexagram  ****************************/
normalRouter.put(`${API_BASE_URL}hexagram`, (req,res)=>{
  // console.log("put journal");
  mongodb.updateHexagram(req.body.hexagram, (result)=>{
    res.send(result);
  });
  // res.send(req.body.reading);
});

/****************   fetch readings   ***********************/
normalRouter.get(`${API_BASE_URL}fetchReadings`, (req, res)=>{
  const user = verifyJWT({message: req.query.jwt, res});
  mongodb.getRecentReadings(req.query.startNumber, req.query.limitedNumber, user.role == 1 ? null : user._id, (result)=>{
    // console.log(result);
    res.json(result);
  })
});

/*****************  Fetching hexagrams data  ***********************************/
normalRouter.get(`${API_BASE_URL}hexagram`, (req, res)=>{
  mongodb.getHexagram(req.query.img_arr, (result)=>{
    // console.log(result);
    res.send(result);
  });
});

/**************  Fetching line grams data from readings  ********************/
normalRouter.get(`${API_BASE_URL}getLinesForHexagram`, (req, res)=>{
  let queryObject = [{line_13_id:req.query.line_13_id_1, line_25_id:req.query.line_25_id_1, line_46_id:req.query.line_46_id_1}, {line_13_id:req.query.line_13_id_2, line_25_id:req.query.line_25_id_2, line_46_id:req.query.line_46_id_2}];
  // console.log("****************",queryObject);
  mongodb.getLinesBigrams(queryObject, (result)=>{
    // console.log(result);
    res.send(result);
  });
});

/***************  Getting journals list  *********************/
normalRouter.get(`${API_BASE_URL}getJournals`,(req, res)=>{
  let queryObject={readingId: req.query.readingId, userId: req.query.userId};
  mongodb.getJournalList(queryObject, (result)=>{
    // console.log(result.journal_entries);
    res.send(result);
  });
});

/***************  Getting unattached journals list  *********************/
normalRouter.get(`${API_BASE_URL}getUnattachedJournals`,(req, res)=>{
  // let queryObject={userId: req.query.userId};
  mongodb.getUnattachedJournalList(req.query.userId, (result)=>{
    // console.log(result.journal_entries);
    res.send(result);
  });
});

/***************  Getting one journal  *********************/
normalRouter.get(`${API_BASE_URL}getJournal`,(req, res)=>{
  mongodb.getJournal(req.query.journalId, (result)=>{
    // console.log(result);
    res.send(result);
  });
});

/***************  Getting one unattached journal from journal_entries collection  *********************/
normalRouter.get(`${API_BASE_URL}getUnattachedJournal`,(req, res)=>{
  mongodb.getUnattachedJournal(req.query.journalId, (result)=>{
    // console.log(result);
    res.send(result);
  });
});

/***************  Getting hexagrams  *********************/
normalRouter.get(`${API_BASE_URL}fetchHexagrams`,(req, res)=>{
  mongodb.getHexagrams(req.query).then(result => res.json(result));
    /*mongodb.getHexagrams(req.query, (result)=>{
    // console.log(result);
    res.send(result);
  });*/
});

/***************  Getting readings by hexagram's id  *********************/
normalRouter.get(`${API_BASE_URL}fetchReadingsBaseOnHexagram`,(req, res) => {
  const user = verifyJWT({message: req.query.jwt, res});
  mongodb.getReadingsByHexagramId(req.query.imageArray, user.role == 1 ? null : user._id, result => res.json(result));
});

/***********  Fetching readings by searching criterias *************/
normalRouter.get(`${API_BASE_URL}searchReadings`,(req, res)=>{
  const user = verifyJWT({message: req.query.jwt, res});
  const queryObject = JSON.parse(req.query.searchCriterias);
  if(user.role != 1) queryObject.user_id = user._id;
  mongodb.getSearchReadings(queryObject, result => res.json(result));
});

/******************  Getting reading by searching name   **********************/
normalRouter.get(`${API_BASE_URL}getReadingBasedOnName`,(req, res)=>{
  mongodb.getReadingsByName(req.query, (result)=>{
    // console.log(result);
    res.send(result);
  });
});

/*****************  Delete reading  ******************************/
normalRouter.delete(`${API_BASE_URL}deleteReading`, (req, res)=>{
  // console.log("delete",req.query.reading_id, req.query.user_id);
  mongodb.deleteReading(req.query.reading_id, req.query.user_id, (result)=>{
    // console.log("result:",result);
    res.end();
  });
});

/*******************  Delete one journal   *************************/
normalRouter.post(`${API_BASE_URL}deleteJournal`, (req, res)=>{
  mongodb.deleteJournal(req.body.journal.journalId, req.body.journal.readingIds, req.body.journal.userId, (result)=>{
    // console.log("result:",result);
    res.end();
  });
});

/*******************  Delete one unattached journal   *************************/
normalRouter.delete(`${API_BASE_URL}deleteUnAttachedJournal`, (req, res)=>{
  // console.log("delete");
  mongodb.deleteUnattachedJournal(req.query.journalId, req.query.userId, (result)=>{
    res.end();
  });
});

/*******************  Check whether user name is available   *************************/
normalRouter.get(`${API_BASE_URL}isUserNameAvailable`,(req, res)=>{
  mongodb.isUserNameAvailable(req.query, (result)=>{
    // console.log(result);
    res.send(result);
  });
});

/*******************  Create a new user   *************************/
/*normalRouter.post(`${API_BASE_URL}createNewUser`, (req, res)=>{
  req.body.user.password = (md5(req.body.user.password)); // encrypting password here
  mongodb.createNewUser(req.body.user, (result)=>{
    // console.log("result:",result);
    res.send(result);
  });
});*/

/*********** Verify and return user object from jwt message **************/
const verifyJWT = ({message, res}) => {
  try{
    res.status(200);
    return jwt.verify(message, process.env.JWT_SECERT);
  } catch(e){
    res.status(200);
    res.json({isAuth: false});
  }
};

module.exports = normalRouter;
