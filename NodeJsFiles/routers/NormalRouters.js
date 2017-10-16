const jwt = require('jsonwebtoken');
const normalRouter = require('express').Router();
const USERNAME = 'resonancecode_webuser';
const PASSWORD = 'cyJz2b4vGb3EgHRf0Khq'; // username
const mongodb = require('../MongoDB');
// API_BASE_URL = "/"; Deprecated
// const axios = require('axios');
// const querystring = require('querystring');


/** Verify and return user object from jwt message
 * @param { object } object includes jwt message and response
 * @return { object } return the user object that was verified by jsonwebtoken
 */
const verifyJWT = ({ message, res }) => {
  try {
    res.status(200);
    return jwt.verify(message, process.env.JWT_SECERT);
  } catch (e) {
    res.status(200);
    res.json({ isAuth: false });
    return null;
  }
};

/** *********************************************************************
************* using to solve Access-Control-Allow-Origin  **************
************ Also check the authentication  **************
********************************************************************** */
normalRouter.post('/resonancecode/api/v1/*', (req, res, next) => {
  if (req.body && req.body.auth && req.body.auth.un && req.body.auth.pd) {
    if (req.body.auth.un === USERNAME &&
      req.body.auth.pd === PASSWORD) next();
    else res.send('Unauthenticated call!');
  } else res.send('Unauthenticated call!');
});

normalRouter.put('/resonancecode/api/v1/*', (req, res, next) => {
  if (req.body && req.body.auth && req.body.auth.un && req.body.auth.pd) {
    if (req.body.auth.un === USERNAME &&
      req.body.auth.pd === PASSWORD) next();
    else res.send('Unauthenticated call!');
  } else res.send('Unauthenticated call!');
});

normalRouter.get('/resonancecode/api/v1/*', (req, res, next) => {
  // console.log(req);
  if ((req.query.un && req.query.pd &&
    req.query.un === USERNAME && req.query.pd === PASSWORD)) next();
  else res.send('Unauthenticated call!');
});
normalRouter.delete('/resonancecode/api/v1/*', (req, res, next) => {
  // console.log(req.query);
  if (req.query.un && req.query.pd &&
    req.query.un === USERNAME && req.query.pd === PASSWORD) next();
  else res.send('Unauthenticated call!');
});

// /*********  index page  ************/
// normalRouter.get("/",function(req,res){
//   res.sendFile(path.resolve(__dirname+"/dist/index.html"));
// });

/* Checking jwt token */
normalRouter.get('/jwtMessageVerify', (req, res) => {
  res.json(verifyJWT({ message: req.query.jwtMessage, res }));
  /* try{
    res.status(200);
    res.json(jwt.verify(req.body.jwtMessage, process.env.JWT_SECERT));
  } catch(e){
    res.status(200);
    res.json({isAuth: false});
  } */
});

/** ********************  Create a new reading  *************************** */
normalRouter.post('/reading', (req, res) => {
  const { jwtMessage, reading } = req.body;
  const user = verifyJWT({ message: jwtMessage, res });
  if (!user._id) res.end('Invalid User.');
  reading.user_id = user._id;
  // const currentTime = new Date();
  reading.date = new Date(reading.date);
  // reading.date.setHours(currentTime.getHours());
  // reading.date.setMinutes(currentTime.getMinutes());
  // reading.date.setSeconds(currentTime.getSeconds());
  mongodb.createReading(reading).then(result => {
    mongodb.findHexagramImagesForReading(result).then(returnReading => res.json(returnReading));
  });
  // res.send(req.body.reading);
});

/** ********************  Create a new journal  *************************** */
normalRouter.post('/journal_entries', (req, res) => {
  // console.log("post journal");
  mongodb.createJournal(req.body.journal, (result) => {
    res.send(result);
  });
  // res.send(req.body.reading);
});

/** ******************** Update a journal  *************************** */
normalRouter.put('/journal_entries', (req, res) => {
  // console.log("put journal");
  mongodb.updateJournal(req.body.journal, (result) => {
    res.send(result);
  });
  // res.send(req.body.reading);
});

/** ******************** Update a hexagram  *************************** */
normalRouter.put('/hexagram', (req, res) => {
  // console.log("put journal");
  mongodb.updateHexagram(req.body.hexagram, (result) => {
    res.send(result);
  });
  // res.send(req.body.reading);
});

/** fetch readings */
normalRouter.get('/fetchReadings', (req, res) => {
  const user = verifyJWT({ message: req.query.jwt, res });
  if (!user._id || !user.role) res.end('Invalid User.');
  else
    mongodb.getRecentReadings(req.query.startNumber, req.query.limitedNumber, user.role * 1 === 1 ? null : user._id, result => {
      // console.log(result);
      res.json(result);
    });
});

/** ***************  Fetching hexagrams data  ********************************** */
normalRouter.get('/hexagram', (req, res) => {
  mongodb.getHexagram(req.query.img_arr, (result) => {
    // console.log(result);
    res.send(result);
  });
});

/** Fetching line grams data from readings */
normalRouter.get('/fetchLinesBigrams', (req, res) => {
  const imageInformationObject = { 1: [], 2: [] };
  mongodb.fetchLine13Bigram(req.query.line_13_id_1)
    .then(results13a => {
      const result13a = Object.assign({ title: 'Lines 1-3 Bigrams' }, results13a[0] || {}); // handle no match. In final version, everyone should match one.
      imageInformationObject['1'].push(result13a);
      mongodb.fetchLine13Bigram(req.query.line_13_id_2)
        .then(results13b => {
          const result13b = Object.assign({ title: 'Lines 1-3 Bigrams' }, results13b[0] || {}); // handle no match. In final version, everyone should match one.
          imageInformationObject['2'].push(result13b);
          mongodb.fetchLine25Bigram(req.query.line_25_id_1)
            .then(results25a => {
              const result25a = Object.assign({ title: 'Lines 2-5 Bigrams' }, results25a[0] || {}); // handle no match. In final version, everyone should match one.
              imageInformationObject['1'].push(result25a);
              mongodb.fetchLine25Bigram(req.query.line_25_id_2)
                .then(results25b => {
                  const result25b = Object.assign({ title: 'Lines 2-5 Bigrams' }, results25b[0] || {}); // handle no match. In final version, everyone should match one.
                  imageInformationObject['2'].push(result25b);
                  mongodb.fetchLine46Bigram(req.query.line_46_id_1)
                    .then(results46a => {
                      const result46a = Object.assign({ title: 'Lines 4-6 Bigrams' }, results46a[0] || {}); // handle no match. In final version, everyone should match one.
                      imageInformationObject['1'].push(result46a);
                      mongodb.fetchLine46Bigram(req.query.line_46_id_2)
                        .then(results46b => {
                          const result46b = Object.assign({ title: 'Lines 4-6 Bigrams' }, results46b[0] || {}); // handle no match. In final version, everyone should match one.
                          imageInformationObject['2'].push(result46b);
                          res.json(imageInformationObject);
                        });
                    });
                });
            });
        });
    });
});

normalRouter.get('/getLinesForHexagram', (req, res) => {
  const queryObject = [{
    line_13_id: req.query.line_13_id_1,
    line_25_id: req.query.line_25_id_1,
    line_46_id: req.query.line_46_id_1
  },
  {
    line_13_id: req.query.line_13_id_2,
    line_25_id: req.query.line_25_id_2,
    line_46_id: req.query.line_46_id_2
  }];
  // console.log("****************",queryObject);
  mongodb.getLinesBigrams(queryObject, (result) => {
    // console.log(result);
    res.send(result);
  });
});

/* Getting journals list */
normalRouter.get('/fetchJournals', (req, res) => {
  const user = verifyJWT({ message: req.query.jwt, res });
  const queryObject = {
    readingId: req.query.readingId,
    userId: user.role * 1 === 1 ? null : user._id
  };
  mongodb.getJournalList(queryObject).then(result => {
    res.json(result[0].journal_entries.sort((previous, next) => new Date(next.date).getTime() - new Date(previous.date).getTime()));
  }).catch(err => console.log(err));
});

/* Deprecated old version
normalRouter.get("/getJournals",(req, res)=>{
  let queryObject={readingId: req.query.readingId, userId: req.query.userId};
  mongodb.getJournalList(queryObject, (result)=>{
    // console.log(result.journal_entries);
    res.send(result);
  });
});
*/

/** Getting unattached journals list */
normalRouter.get('/fetchUnattachedJournals', (req, res) => {
  const user = verifyJWT({ message: req.query.jwt, res });
  mongodb.getUnattachedJournalList(user._id).then(result => {
    res.json(result.sort((previous, next) => new Date(next.date).getTime() - new Date(previous.date).getTime()));
    // res.json(result);
  });
});

/* Deprecated old version
normalRouter.get("/getUnattachedJournals",(req, res)=>{
  // let queryObject={userId: req.query.userId};
  mongodb.getUnattachedJournalList(req.query.userId, (result)=>{
    // console.log(result.journal_entries);
    res.send(result);
  });
}); */

/** *************  Getting one journal  ******************** */
normalRouter.get('/getJournal', (req, res) => {
  mongodb.getJournal(req.query.journalId, (result) => {
    // console.log(result);
    res.send(result);
  });
});

/** *************  Getting one unattached journal from journal_entries collection  ******************** */
normalRouter.get('/getUnattachedJournal', (req, res) => {
  mongodb.getUnattachedJournal(req.query.journalId, (result) => {
    // console.log(result);
    res.send(result);
  });
});

/** *************  Getting hexagrams  ******************** */
normalRouter.get('/fetchHexagrams', (req, res) => {
  mongodb.getHexagrams(req.query).then(result => res.json(result));
  /* mongodb.getHexagrams(req.query, (result)=>{
    // console.log(result);
    res.send(result);
  }); */
});

/** *************  Getting readings by hexagram's id  ******************** */
normalRouter.get('/fetchReadingsBaseOnHexagram', (req, res) => {
  const user = verifyJWT({ message: req.query.jwt, res });
  mongodb.getReadingsByHexagramId(req.query.imageArray, user.role * 1 === 1 ? null : user._id, result => res.json(result));
});

/** *********  Fetching readings by searching criterias ************ */
normalRouter.get('/searchReadings', (req, res) => {
  const user = verifyJWT({ message: req.query.jwt, res });
  const queryObject = JSON.parse(req.query.searchCriterias);
  // console.log(user);
  if (user.role * 1 !== 1) queryObject.userId = user._id;
  mongodb.getSearchReadings(queryObject, result => res.json(result));
});

/** ****************  Getting reading by searching name   ********************* */
normalRouter.get('/getReadingBasedOnName', (req, res) => {
  mongodb.getReadingsByName(req.query, (result) => {
    // console.log(result);
    res.send(result);
  });
});

/** ***************  Delete reading  ***************************** */
normalRouter.delete('/deleteReading', (req, res) => {
  const user = verifyJWT({ message: req.query.jwtMessage, res });
  mongodb.deleteReading({ readingId: req.query.readingId, userId: user._id }).then(_ => res.end());
});

/** *****************  Delete one journal   ************************ */
normalRouter.post('/deleteJournal', (req, res) => {
  mongodb.deleteJournal(req.body.journal.journalId, req.body.journal.readingIds, req.body.journal.userId, (result) => {
    // console.log("result:",result);
    res.end();
  });
});

/** Delete one unattached journal */
normalRouter.delete('/deleteUnAttachedJournal', (req, res) => {
  // console.log("delete");
  mongodb.deleteUnattachedJournal(req.query.journalId, req.query.userId, (result) => {
    res.end();
  });
});

/** Check whether user name is available */
normalRouter.get('/isUserNameAvailable', (req, res) => {
  mongodb.isUserNameAvailable(req.query, result => {
    // console.log(result);
    res.send(result);
  });
});


module.exports = normalRouter;
