const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;
const winston = require('winston');

require('dotenv').config();
// Loading .env to process.env
const DB_URL = process.env.DB_HOST;
const COLLECTION_USER = 'users';
const COLLECTION_READINGS = 'readings';
const COLLECTION_HEXAGRAMS = 'hexagrams';
const COLLECTION_LINE_13 = 'lines_13_bigrams';
const COLLECTION_LINE_25 = 'lines_25_bigrams';
const COLLECTION_LINE_46 = 'lines_46_bigrams';
// const COLLECTION_UPPER = 'upper_trigrams'; Maybe using in the future.
// const COLLECTION_LOWER = 'lower_trigrams'; Maybe using in the future.
const COLLECTION_JOURNAL_ENTRIES = 'journal_entries';
const DB_NAME = process.env.DB_NAME;

/** Setting up the Winston logger.
  * Under the development mode log to console.
*/
const logger = new winston.Logger({
  level: process.env.LOGGING_LEVEL,
  transports: [
    new (winston.transports.Console)()
  ]
});

/** Replaces the previous transports with those in the
new configuration wholesale.
  * When under the production mode, log to a file.
*/
if (process.env.NODE_ENV === 'production')
  logger.configure({
    level: 'error',
    transports: [
      new (winston.transports.File)({ filename: 'error.log' })
    ]
  });

/*
* Use to execute the database
* Other function can call it to get the connection.
* Pass a function that contains the executed code.
*/
const connectToDb = executeFunction => {
  MongoClient.connect(DB_URL, (err, client) => {
    if (err)
      logger.error('Unable to connect to the mongoDB server. Error:', err);
    else
      // console.log("Connection of MongonDB was established.");
      // Run given mehtod
      executeFunction(client.db(DB_NAME));

    client.close();
  // console.log("db close.");
  });
};

/* Using Promise to wrap connection and toArray */
const promiseFindResult = callback => new Promise((resolve, reject) => {
  connectToDb(db => {
    callback(db).toArray((err, result) => {
      if (err) reject(err);
      else resolve(result);
    });
  });
});

const promiseNextResult = callback => new Promise((resolve, reject) => {
  connectToDb(db => {
    callback(db).next((err, result) => {
      if (err) reject(err);
      else resolve(result);
    });
  });
});

const promiseInsertResult = callback => new Promise((resolve, reject) => {
  connectToDb(db => {
    callback(db).then(result => {
      resolve();
    });
  });
});

const promiseReturnResult = callback => new Promise((resolve, reject) => {
  connectToDb(db => {
    resolve(callback(db));
  });
});


/* Start Database functions */

exports.findUserWithUsername = username =>
  promiseFindResult(db => db.collection(COLLECTION_USER)
    .find({ username }, {
      pushSubscriptions: 0, email: 0, facebookId: 0, googleId: 0
    }));

exports.registerNewUser = user => new Promise((resolve, reject) => {
  connectToDb(db => db.collection(COLLECTION_USER)
    .insertOne(user, (err, response) => resolve(response.ops[0])));
});

/*
exports.fetchOrCreateUser = user => new Promise((resolve, reject) =>
  connectToDb(db => {
    const userFilter = user.facebookId !== '' ? { facebookId: user.facebookId } : { googleId: user.googleId };
    db.collection(COLLECTION_USER).findOneAndUpdate(
      userFilter,
      { $set: user },
      { upsert: true, new: true, returnNewDocument: true },
      (err, result) => {
        if (err) reject(err);
        else resolve(result);
      }
    );
  })); */


exports.fetchOrCreateUser = user => promiseReturnResult(db => {
  const userFilter = user.facebookId !== '' ? { facebookId: user.facebookId } : { googleId: user.googleId };
  return db.collection(COLLECTION_USER).findOneAndUpdate(
    userFilter,
    { $set: user },
    { upsert: true, returnOriginal: false, projection: { _id: 1, role: 1 } }
  );
});

/*
exports.fetchOrCreateUser = user => promiseReturnResult(db =>
  db.collection(COLLECTION_USER).findOneAndUpdate(
    { $or: [{ facebookId: user.facebookId }, { googleId: user.google }] },
    { $set: user },
    { upsert: true, returnNewDocument: true }
  ));
*/
exports.findHexagramImagesForReading = reading => new Promise((resolve, reject) => {
  const returnReading = Object.assign({}, reading);
  connectToDb(db => {
    db.collection(COLLECTION_HEXAGRAMS).find({ img_arr: reading.hexagram_arr_1 })
      .next((err1, img1Info) => {
        returnReading.img1Info = img1Info;
        connectToDb(db2 => {
          db2.collection(COLLECTION_HEXAGRAMS).find({ img_arr: reading.hexagram_arr_2 })
            .next((err2, img2Info) => {
              returnReading.img2Info = img2Info;
              resolve(returnReading);
            });
        });
      });
  });
});
/* Code below is old version */

/* Login get user information */
exports.getUser = (username, password, callback) => {
  connectToDb((db) => {
    db.collection(COLLECTION_USER).find({ username, password }).toArray((err, result) => {
      // console.log(result);
      if (err) logger.error('Something goes worry: ', err);
      else callback(result);
    });
  });
};

/*  Create a new Reading  */
exports.createReading = reading => new Promise((resolve, reject) =>
  connectToDb(db => db.collection(COLLECTION_READINGS)
    .insert(reading, (err, response) => resolve(response.ops[0]))));

/* Working with method below to execute the callback function when all hexagram are fetched. */
const checkHexagramImageReadAndCallback = (checkNumber, targetNumber, callback, result) => {
  if (checkNumber === targetNumber) callback(result);
};

/** This method is using to find hexagram information for readings
  * @param {array} readings is an array that has reading objects.
  * @param {function} callback is a function will be transfered to anther function.
  * @return {null} No return.
 */
const findHexagramImages = (readings, callback) => {
  let checkNumber = 0;
  const targetNumber = readings.length * 2;
  // Making a copy for the readings. So, the code below is safe when change reading in the forEach function.
  const copyReadings = [...readings];
  connectToDb((db) => {
    copyReadings.forEach(reading => {
      db.collection(COLLECTION_HEXAGRAMS)
        .find({ img_arr: reading.hexagram_arr_1 }).next((err, imgInfo) => {
          reading.img1Info = imgInfo;
          checkNumber += 1;
          checkHexagramImageReadAndCallback(checkNumber, targetNumber, callback, copyReadings);
        });
      db.collection(COLLECTION_HEXAGRAMS)
        .find({ img_arr: reading.hexagram_arr_2 }).next((err, imgInfo) => {
          reading.img2Info = imgInfo;
          checkNumber += 1;
          checkHexagramImageReadAndCallback(checkNumber, targetNumber, callback, copyReadings);
        });
    });
  });
};

/*  Get readings  */
exports.getRecentReadings = (pageNumber, numberPerpage, userId, callback) => {
  connectToDb(db => {
    db.collection(COLLECTION_READINGS)
      .find(userId ? { user_id: userId } : {})
      .sort({ date: -1 }).limit(numberPerpage * 1)
      .skip(pageNumber * numberPerpage)
      .toArray((err, result) => {
        if (err) logger.error('Something goes worry: ', err);
        if (result.length !== 0) findHexagramImages(result, callback);
        else callback(result);
      });
  });
};

/** Working with method below to search readings based on the hexagram.
  * @param {object} query is an object that has reading's information that a user wants to search.
  * @param {function} callback is the function that will be executed after this function's call.
  * @param {object} results is the object that comes from hexagram search.
  * @return {null} No return.
*/
function searchForReadings(query, callback, results) {
  // assemble query object for MongoDB
  const queryArray = [];
  if (query.people) queryArray.push({ people: new RegExp(`.*${query.people}.*`) });
  if (query.userId) queryArray.push({ user_id: query.userId });
  if (results) {
    // if no img_arr was found, it means not such combination exsite. Give a empty array and quit.
    if (results.length === 0) {
      callback([]);
      return;
    }
    // if users used hexagrams' criterias, add img_arr for the searching criteria
    const hexagramQuery = [];
    results.forEach(element => {
      hexagramQuery.push({ hexagram_arr_1: element.img_arr });
      hexagramQuery.push({ hexagram_arr_2: element.img_arr });
      // queryArray.push({hexagram_arr_1: element.img_arr});
      // queryArray.push({hexagram_arr_2: element.img_arr});
    });
    queryArray.push({ $or: hexagramQuery });
  }
  // Start to deal with start date and end date
  if (query.endDate) {
    const endDate = new Date(query.endDate);
    endDate.setDate(endDate.getDate() + 1);
    queryArray.push({
      $and: [{ date: { $gte: new Date(query.startDate) } }, { date: { $lt: new Date(endDate) } }]
    });
  } else if (query.startDate) {
    /* If just one date is given, set the search criteria between that day's 00:00 to next day's 00:00 */
    const endDate = new Date(query.startDate);
    endDate.setDate(endDate.getDate() + 1);
    queryArray.push({
      $and: [{ date: { $gte: new Date(query.startDate) } }, { date: { $lt: endDate } }]
    });
  }
  if (queryArray.length === 0) queryArray.push({}); // if no one searching criteria was given, give a empty array to query, which will pull out all readings.

  connectToDb(db => {
    db.collection(COLLECTION_READINGS)
      .find({ $and: queryArray }).sort({ date: -1 }).toArray((err, result) => {
        if (err) logger.error('searchForReadings: ', err);
        if (result.length !== 0) findHexagramImages(result, callback);
        else callback(result);
      });
  });
}

/** Fetching all reading list
  * @param {string} userId is the user id.
  * @return {object} Return an promise with fetching result.
 */
exports.fetchAllReadingList = ({ userId, pageNumber, numberPerpage }) => promiseFindResult(db =>
  db.collection(COLLECTION_READINGS)
    .find({ user_id: userId }, { reading_name: 1, date: 1 })
    .skip(pageNumber * numberPerpage).limit(numberPerpage * 1)
    .sort({ date: -1 }));

/*  Get search readings  */
exports.getSearchReadings = (query, callback) => {
  // if user search bgetSearchReadingsased on hexagrams' criterias, search hexagrams' img_arr first.
  logger.info('getSearchReadings => query:', query);
  if (query.upperId !== 0 || query.lowerId !== 0 ||
    query.line13Id !== 0 || query.line25Id !== 0 || query.line46Id !== 0) {
    const queryObject = {};
    if (query.upperId !== 0) queryObject.upper_trigrams_id = new mongodb.ObjectId(query.upperId);
    if (query.lowerId !== 0) queryObject.lower_trigrams_id = new mongodb.ObjectId(query.lowerId);
    if (query.line13Id !== 0) queryObject.line_13_id = new mongodb.ObjectId(query.line13Id);
    if (query.line25Id !== 0) queryObject.line_25_id = new mongodb.ObjectId(query.line25Id);
    if (query.line46Id !== 0) queryObject.line_46_id = new mongodb.ObjectId(query.line46Id);
    connectToDb(db => {
      db.collection(COLLECTION_HEXAGRAMS)
        .find(queryObject, { _id: 0, img_arr: 1 }).toArray((err, results) => {
          searchForReadings(query, callback, results);
        });
    });
  } else
    searchForReadings(query, callback);
};

/*  Fetching hexagram  */
exports.fetchHexagram = imgArray => new Promise((resolve, reject) => {
  connectToDb(db => {
    db.collection(COLLECTION_HEXAGRAMS).find({ img_arr: imgArray }).next((err, result) => {
      if (err) reject(err);
      resolve(result);
    });
  });
});

/* Fetch lines bigram */
exports.fetchLine13Bigram = lineId => promiseFindResult(db =>
  db.collection(COLLECTION_LINE_13)
    .find({ _id: new mongodb.ObjectId(lineId) }));
exports.fetchLine25Bigram = lineId => promiseFindResult(db =>
  db.collection(COLLECTION_LINE_25)
    .find({ _id: new mongodb.ObjectId(lineId) }));
exports.fetchLine46Bigram = lineId => promiseFindResult(db =>
  db.collection(COLLECTION_LINE_46)
    .find({ _id: new mongodb.ObjectId(lineId) }));

/* Working with getLinesBigrams method below */
const checkAndCallback = (imageInformationObject, callback) => {
  if (imageInformationObject['1'].length === 3 && imageInformationObject['2'].length === 3) callback(imageInformationObject);
};
/* Get all line grams data */
exports.getLinesBigrams = (queryObject, callback) => {
  const imageInformationObject = { 1: [], 2: [] };
  connectToDb(db => {
    db.collection(COLLECTION_LINE_13)
      .find({ _id: new mongodb.ObjectId(queryObject[0].line_13_id) })
      .next((err, result) => {
        const newResult = result || {}; // handle no match. In final version, everyone should match one.
        newResult.title = 'Lines 1-3 Bigrams';
        imageInformationObject['1'].push(newResult);
        checkAndCallback(imageInformationObject, callback);
      });
    db.collection(COLLECTION_LINE_13)
      .find({ _id: new mongodb.ObjectId(queryObject[1].line_13_id) })
      .next((err, result) => {
        const newResult = result || {}; // handle no match. In final version, everyone should match one.
        newResult.title = 'Lines 1-3 Bigrams';
        imageInformationObject['2'].push(newResult);
        checkAndCallback(imageInformationObject, callback);
      });
    db.collection(COLLECTION_LINE_25)
      .find({ _id: new mongodb.ObjectId(queryObject[0].line_25_id) }).next((err, result) => {
        const pushResult = result ? Object.assign({ title: 'Lines 2-5 Bigrams' }, result) : { title: 'Lines 2-5 Bigrams' };
        imageInformationObject['1'].push(pushResult);
        checkAndCallback(imageInformationObject, callback);
      });
    db.collection(COLLECTION_LINE_25)
      .find({ _id: new mongodb.ObjectId(queryObject[1].line_25_id) }).next((err, result) => {
        const pushResult = result ? Object.assign({ title: 'Lines 2-5 Bigrams' }, result) : { title: 'Lines 2-5 Bigrams' };
        imageInformationObject['2'].push(pushResult);
        checkAndCallback(imageInformationObject, callback);
      });
    db.collection(COLLECTION_LINE_46)
      .find({ _id: new mongodb.ObjectId(queryObject[0].line_46_id) }).next((err, result) => {
        const pushResult = result ? Object.assign({ title: 'Lines 4-6 Bigrams' }, result) : { title: 'Lines 4-6 Bigrams' };
        imageInformationObject['1'].push(pushResult);
        checkAndCallback(imageInformationObject, callback);
      });
    db.collection(COLLECTION_LINE_46)
      .find({ _id: new mongodb.ObjectId(queryObject[1].line_46_id) }).next((err, result) => {
        const pushResult = result ? Object.assign({ title: 'Lines 4-6 Bigrams' }, result) : { title: 'Lines 4-6 Bigrams' };
        imageInformationObject['2'].push(pushResult);
        checkAndCallback(imageInformationObject, callback);
      });
  });
};


/*  Delete reading  */
exports.deleteReading = ({ readingId, userId }) => promiseInsertResult(db =>
  db.collection(COLLECTION_READINGS).deleteOne({
    _id: new mongodb.ObjectId(readingId),
    user_id: userId
  }));

/* Deprecated old version
exports.deleteReading = (readingId, userId, callback) => {
  connectToDb((db) => {
    db.collection(COLLECTION_READINGS).deleteOne({ _id: new mongodb.ObjectId(readingId), user_id: userId }).then((result) => {
      callback(null);
    });
  });
}; */

/*  Create a new journal  */
exports.createJournal = (journal) => new Promise((resolve, reject) => {
  const internalJournal = Object.assign({}, journal); // Using a copy to work.
  internalJournal.date = new Date(internalJournal.date);
  internalJournal._id = new mongodb.ObjectId();

  /* If no reading has been attached, create this journal to journal_entries collection. Otherwise push journal to reading collections */
  if (Object.keys(internalJournal.readings).length === 0) {
    delete internalJournal.readings;
    connectToDb(db =>
      db.collection(COLLECTION_JOURNAL_ENTRIES)
        .insert(internalJournal).then(result => resolve()).catch(err => reject(err)));
  } else {
    const readingObjectIdArray = [];
    Object.keys(internalJournal.readings).forEach((element) => {
      readingObjectIdArray.push(new mongodb.ObjectId(element));
    });
    // let readings = Object.assign({}, journal.readings);
    internalJournal.pingPongStates = internalJournal.readings; // Changing the name to poingPongStates
    delete internalJournal.readings;
    connectToDb((db) => {
      db.collection(COLLECTION_READINGS).update({ _id: { $in: readingObjectIdArray } }, {
        $push: {
          journal_entries: internalJournal
        }
      }, { multi: true }).then((result) => resolve()).catch(err => reject(err));
    });
  }
});

/*  Get Journal list  */
exports.getJournalList = queryObject => promiseFindResult(db => {
  const query = { _id: new mongodb.ObjectId(queryObject.readingId) };
  if (queryObject.userId) query.user_id = queryObject.userId;
  return db.collection(COLLECTION_READINGS).find(query, { journal_entries: 1 });
});

/* Get unattached journal list */
exports.getUnattachedJournalList = userId => promiseFindResult(db =>
  db.collection(COLLECTION_JOURNAL_ENTRIES).find({ user_id: userId }));

/*  Get one journal  */
exports.fetchJournal = ({ journalId, userId }) => new Promise((resolve, reject) => {
  connectToDb((db) => {
    db.collection(COLLECTION_READINGS).find({ user_id: userId, 'journal_entries._id': new mongodb.ObjectId(journalId) }, {
      _id: 1, reading_name: 1, user_id: 1, journal_entries: 1
    }).toArray((err, result) => {
      // Getting all reading ids
      if (err) reject(err);
      const readingIds = {};
      // let readingNames = [];
      result.forEach((reading) => {
        readingIds[reading._id] = reading.reading_name;
      });
      // Finding the right journal and attaching the reading ids array to it.
      result[0].journal_entries.forEach(element => {
        if (element._id.toString() === journalId)
          resolve(Object.assign({ user_id: userId, readingIds }, element));
      });
    });
  });
});

/** Fetch a journal based on both journal and reading's id
  * @param {object} the param object contains journal's id, reading's id, and user's id.
  * @return {Promise} Return a promise to the caller.
*/
exports.fetchJournalBasedOnReadingJournal = ({ journalId, readingId, userId }) =>
  new Promise((resolve, reject) =>
    connectToDb(db => {
      db.collection(COLLECTION_READINGS)
        .findOne({ _id: new mongodb.ObjectId(readingId), user_id: userId }, { journal_entries: 1 })
        .then((result, err) => {
          if (err) reject(err);
          else result.journal_entries.forEach(journal => {
            if (journal._id.toString() === journalId) resolve(journal);
          });
        });
    }));

/*  Get one unattached journal  */
exports.fetchUnattachedJournal = ({ journalId, userId }) =>
  promiseNextResult(db => db.collection(COLLECTION_JOURNAL_ENTRIES)
    .find({ _id: new mongodb.ObjectId(journalId), user_id: userId }));

/*  new Promise((resolve, reject) =>
  connectToDb(db => {
    db.collection(COLLECTION_JOURNAL_ENTRIES)
      .find({ _id: new mongodb.ObjectId(journalId), user_id: userId })
      .next((err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
  })); */

/*  Delete one journal  */
exports.deleteJournal = ({ journalId, readingIds, userId }) =>
  promiseInsertResult(db => db.collection(COLLECTION_READINGS)
    .update(
      { _id: { $in: readingIds.map((id) => new mongodb.ObjectId(id)) }, user_id: userId },
      { $pull: { journal_entries: { _id: new mongodb.ObjectId(journalId) } } },
      { multi: true }
    ));

/*  Delete one unattached journal  */
exports.deleteUnattachedJournal = ({ journalId, userId }) =>
  promiseInsertResult(db =>
    db.collection(COLLECTION_JOURNAL_ENTRIES)
      .deleteOne({ _id: new mongodb.ObjectId(journalId), user_id: userId }));

/** Working with below method to update journal in readings.
 * @param {object} journal is an object that has journal's information.
 * @return {null} No return.
 */
function updateJournalInReadings(journal) {
  // The second step is to update journal to reading documents
  const internalJournal = Object.assign({}, journal);
  const readingIds = Object.keys(internalJournal.readings);
  internalJournal.pingPongStates = internalJournal.readings; // Changing the name to poingPongStates
  delete internalJournal.readings;
  // delete journal.readingIds;
  delete internalJournal.deleteReadingIds;
  delete internalJournal.isUnattachedJournal;
  internalJournal.date = new Date(internalJournal.date);
  internalJournal._id = new mongodb.ObjectId(internalJournal._id);
  connectToDb((db) => {
    db.collection(COLLECTION_READINGS)
      .find({ _id: { $in: readingIds.map((readingId) => new mongodb.ObjectId(readingId)) } })
      .forEach((reading) => {
        const internalReading = Object.assign({}, reading); // Working on a copy.
        let isUpdated = false;
        if (!internalReading.journal_entries) internalReading.journal_entries = [];
        internalReading.journal_entries = internalReading.journal_entries.map((journalEntry) => {
          // Find the right journal and update the whole reading
          if (journalEntry._id.toString() === internalJournal._id.toString()) {
            isUpdated = true;
            // Copy shared list for the new journal.
            // Using a copy of internalJounal to prevent other readings has the same shareList.
            return Object.assign({}, internalJournal, { shareList: journalEntry.shareList });
          }
          return journalEntry;
        });
        // if isUpdated is still false, it means the reading do not have this journal before. we have to add it as a new one.
        if (!isUpdated) internalReading.journal_entries.push(internalJournal);
        connectToDb(secondDb => secondDb.collection(COLLECTION_READINGS).save(internalReading));
      });
  });
}

/** Working with below method to update an unattached journal.
 * @param {object} journal is an object that has journal's information.
 * @return {null} No return.
 */
function updateUnattachedJournal(journal) {
  const internalJournal = Object.assign({}, journal); // Working on a copy.
  delete internalJournal.readings;
  // delete internalJournal.readingIds;
  delete internalJournal.deleteReadingIds;
  delete internalJournal.isUnattachedJournal;
  internalJournal.date = new Date(internalJournal.date);
  internalJournal._id = new mongodb.ObjectId(internalJournal._id);
  connectToDb(db => {
    db.collection(COLLECTION_JOURNAL_ENTRIES).save(internalJournal);
  });
}

/*  Update one journal
 *  1. journal.deleteReadingIds has all ids have to be removed from this journal. Using pull to remoeve all of them.
 *  2. find all reading that this journal will attach to.
 *  3. comparing journal id with readings' journals. If one of journal has same id, update it. If no one has the same id add this journal as a new one.
  */
exports.updateJournal = (journal, callback) => new Promise((resolve, reject) => {
  if (journal.isUnattachedJournal && Object.keys(journal.readings).length === 0)
    // if the journal is a unattached journal and this time still does not have any reading
    // update journal content in journal_entries collection
    updateUnattachedJournal(journal);
  else if (journal.isUnattachedJournal && Object.keys(journal.readings).length !== 0)
    // if the journal is a unattached journal and this time has readings
    // delete journal in journal_entries collection and push journal in readings
    connectToDb(db => {
      db.collection(COLLECTION_JOURNAL_ENTRIES)
        .deleteOne({ _id: new mongodb.ObjectId(journal._id) });
      updateJournalInReadings(journal);
    });
  else
    // if the journal is not a unattached journal, pull out journal from delete readings and update content
    // if no reading is attached, create journal in journal_entries collection
    // Firstly, remove journal from non attached readings
    connectToDb((db) => {
      db.collection(COLLECTION_READINGS).update(
        {
          _id: {
            $in: journal.deleteReadingIds.map(readingId =>
              new mongodb.ObjectId(readingId))
          }
        },
        { $pull: { journal_entries: { _id: new mongodb.ObjectId(journal._id) } } },
        { multi: true }
      ).then(() => {
        if (Object.keys(journal.readings).length !== 0) updateJournalInReadings(journal);
        else updateUnattachedJournal(journal);
      });
    });
  resolve();
});

/** working with method below in order to transfer the query object to the correct format.
  * @param {object} query is an object that contains the filter information for the Hexagram.
  * @returns {object} Return the query object that can be used in the database.
*/
function getHexagramsQueryObject(query) {
  const queryObject = {};
  if (query.upperId && query.upperId !== '0') queryObject.upper_trigrams_id = new mongodb.ObjectId(query.upperId);
  if (query.lowerId && query.lowerId !== '0') queryObject.lower_trigrams_id = new mongodb.ObjectId(query.lowerId);
  if (query.line13Id && query.line13Id !== '0') queryObject.line_13_id = new mongodb.ObjectId(query.line13Id);
  if (query.line25Id && query.line25Id !== '0') queryObject.line_25_id = new mongodb.ObjectId(query.line25Id);
  if (query.line46Id && query.line46Id !== '0') queryObject.line_46_id = new mongodb.ObjectId(query.line46Id);
  return queryObject;
}

/*  Get hexagrams  */
exports.getHexagrams = query =>
  promiseFindResult(db => db.collection(COLLECTION_HEXAGRAMS).find(getHexagramsQueryObject(query)));

/*  Get readings by Hexagram's id  */
exports.getReadingsByHexagramId = (imageArray, userId, callback) => {
  const queryObject = { $or: [{ hexagram_arr_1: imageArray }, { hexagram_arr_2: imageArray }] };
  if (userId) queryObject.user_id = userId;
  connectToDb((db) => {
    db.collection(COLLECTION_READINGS).find(queryObject).toArray((err, result) => {
      if (result.length !== 0) findHexagramImages(result, callback);
      else callback(result);
    });
  });
};

/* Update a hexagram */
exports.updateHexagram = hexagram => promiseInsertResult(db => {
  const newHexagram = Object.assign({}, hexagram);
  delete newHexagram._id;
  return db.collection(COLLECTION_HEXAGRAMS)
    .update({ _id: new mongodb.ObjectId(hexagram._id) }, { $set: newHexagram });
});

/* Getting readings by searching name */
exports.fetchReadingsBaseOnName = ({ user_id, keyWord }) =>
  promiseFindResult(db =>
    db.collection(COLLECTION_READINGS).find({ user_id, reading_name: new RegExp(`.*${keyWord}.*`, 'i') }, { _id: 1, reading_name: 1 }).sort({ date: -1 }).limit(10));

/* checking whether user name is still available */
exports.isUserNameAvailable = (query, callback) => {
  connectToDb((db) => {
    db.collection(COLLECTION_USER).find({ username: query.userName }).next((err, result) => {
      callback(!result);
    });
  });
};

/* create and return a new user */
/* result format is like { result: { ok: 1, n: 1 },
  ops:
   [ { username: 'newuser',
       password: '1234',
       _id: 5973a501704d2930eca0306f } ],
  insertedCount: 1,
  insertedIds: [ 5973a501704d2930eca0306f ] }
*/
exports.createNewUser = (user, callback) => {
  const insertUser = Object.assign({ role: 3 }, user); // set user a Emerald role
  connectToDb((db) => {
    db.collection(COLLECTION_USER)
      .insert(insertUser, (err, result) => { callback(result.ops[0]); });
  });
};

/** Update a user's information.
  * @param {string} userId is the id of a user.
  * @param {object} user is the object that contains the new information of the use.
  * @param {object} removeFields is an object that contains the fields will be removed from the database.
  * @returns {Promise} Return a promise object with new user information.
*/
exports.updateUser = (userId, user, removeFields) => promiseReturnResult(db =>
  db.collection(COLLECTION_USER)
    .findOneAndUpdate(
      { _id: new mongodb.ObjectId(userId) },
      removeFields ? { $set: user, $unset: removeFields } : { $set: user },
      { returnOriginal: false, projection: { pushSubscription: 0 } }
    ));

/** Remove a user group from user's database.
  * @param {object} param contains user's id and the name of group will be deleted.
  * @return {promise} Return a promise with new user data.
*/
exports.deleteUserGroup = ({ userId, groupName }) => promiseReturnResult(db =>
  db.collection(COLLECTION_USER)
    .findOneAndUpdate({ _id: new mongodb.ObjectId(userId) }, { $unset: { [`settings.userGroups.${groupName}`]: '' } }, { returnOriginal: false, projection: { pushSubscription: 0 } }));

/** Getting the amount number of reading a user has.
  * @param {string} userId is the user's id.
  * @return {promise} Returning a promise object with the amount number of this user's reading.
*/
exports.fetchReadingsAmount = userId => promiseReturnResult(db =>
  db.collection(COLLECTION_READINGS).count({ user_id: userId }));

/** Getting the amount number of all user.
  * @return {promise} Returning a promise object with the amount number of this user's reading.
*/
exports.fetchUsersAmount = () => promiseReturnResult(db =>
  db.collection(COLLECTION_USER).count({}));

/** Fetching all user's name as a list.
  * @param {object} An object that contains pageNumber as current page the user wants to get and numberPerpage as how many users' name the user wants to see in a same page.
  * @return {promise} Returning a promise with user objects that have displayName, photo, and _id field.
*/
exports.fetchAllUserList = ({ pageNumber, numberPerpage }) => promiseFindResult(db =>
  db.collection(COLLECTION_USER).find({}, {
    displayName: 1, photo: 1, role: 1, 'settings.customName': 1
  }).skip(pageNumber * numberPerpage).limit(numberPerpage * 1));

/** Updating the shareList for a reading's journal.
  * @param {object} An object that contains readingId, journalId, shareList, and userId information.
  * @return {null} No return.
*/
exports.updateJournalShareList = ({
  readingId, journalId, shareList, userId
}) =>
  connectToDb(db => {
    db.collection(COLLECTION_READINGS)
      .findOne({ _id: new mongodb.ObjectId(readingId), user_id: userId }).then(result => {
        /** Finding the correct journal and update it. */
        const reading = Object.assign({}, result);
        reading.journal_entries = reading.journal_entries.map(journal => {
          if (journal._id.toString() === journalId)
            return Object.assign({}, journal, { shareList });
          return journal;
        });
        /** Saving the reading with new journal's shareList back. */
        connectToDb(newDb => newDb.collection(COLLECTION_READINGS).save(reading));
      });
  });

/** Fetching all reading that have been shared with a user.
  * @param {string} userId is the id of the user who is shared with.
  * @return {promise} Returning a promise with readings.
*/
exports.fetchSharedReadings = ({ userId, pageNumber, numberPerpage }) =>
  new Promise((resolve, reject) => {
    connectToDb(db => {
      db.collection(COLLECTION_READINGS).find({
        journal_entries: {
          $elemMatch: {
            shareList: {
              $elemMatch: { id: userId }
            }
          }
        }
      }).sort({ 'journal_entries.shareList.sharedDate': -1 }).skip(numberPerpage * pageNumber)
        .limit(numberPerpage * 1)
        .toArray((err, result) => {
          if (err) reject();
          if (result.length !== 0) findHexagramImages(result, newReadings => resolve(newReadings));
          else resolve(result);
        });
    });
  });

/** Fetching the total amount number of shared readings for a user.
  * @param {string} userId is a string of a user's id.
  * @return {promise} Returning a promise with the shared reading's amount number.
*/
exports.fetchSharedReadingsAmount = userId => promiseReturnResult(db =>
  db.collection(COLLECTION_READINGS).count({
    journal_entries: {
      $elemMatch: {
        shareList: {
          $elemMatch: { id: userId }
        }
      }
    }
  }));

/** Fetching all readings' journalEntry for a user.
  * @param {string} userId is the id of user.
  * @return {promise} Returning a promise with all journalEntry it found.
*/
exports.fetctAllReadingWithJournalEntry = userId => promiseFindResult(db =>
  db.collection(COLLECTION_READINGS).find({ user_id: userId, 'journal_entries._id': { $exists: true } }, { journal_entries: 1 }));

/** Fetching user's PushSubscriptions
  * @param {array} userIds is an array that contains users' ids.
  * @return {promise} Return a promise with users' information (just pushSubscription include).
*/
exports.fetchUsersPushSubscriptions = userIds => promiseFindResult(db => {
  const userIdsObject = userIds.map(id => new mongodb.ObjectId(id));
  return db.collection(COLLECTION_USER).find({ _id: { $in: userIdsObject }, 'settings.isPushNotification': true }, { _id: 0, pushSubscriptions: 1 });
});

exports.fetchReadingBasedOnId = ({ readingId, userId }) => new Promise((resolve, reject) =>
  connectToDb(db => db.collection(COLLECTION_READINGS)
    .findOne({
      _id: new mongodb.ObjectId(readingId), user_id: userId
    }, { journal_entries: 1 }).then(result => resolve(result))));

exports.fetchOneUser = userId => new Promise((reslove, reject) =>
  connectToDb(db => db.collection(COLLECTION_USER)
    .findOne({ _id: new mongodb.ObjectId(userId) }, {
      pushSubscriptions: 0, facebookId: 0, googleId: 0, email: 0
    }).then((result, err) => {
      if (err) reject(err);
      reslove(result);
    })));

//
// exports.fetchReadingBasedOnId = ({ readingId, userId }) => promiseReturnResult(db => {
//   db.collection(COLLECTION_READINGS)
//     .findOne({
//       _id: new mongodb.ObjectId(readingId), user_id: userId
//     }, { journal_entries: 1 }).then(result => {
//       console.log("r: ", result);
//       return result;
//
//     });
// });


/** Saving the user's push subscription information to the database.
  * @param {object} object that contains user's id and user's push subscription information.
  * @return {promise} return a promis with updated user object.
*/
// exports.savePushSubscription = ({ userId, updatedUser }) => promiseReturnResult(db =>
//   db.collection(COLLECTION_USER).findOneAndUpdate({ _id: new mongodb.ObjectId(userId) }, { $set:  }, { projection: { pushSubscription: -1 }, returnOriginal: false }));
