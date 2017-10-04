const mongodb = require('mongodb'),
			MongodbClient = mongodb.MongoClient,
			DB_URL = process.env.DB_HOST,
			COLLECTION_USER = "users",
			COLLECTION_READINGS = "readings",
			COLLECTION_HEXAGRAMS = "hexagrams",
			COLLECTION_LINE_13 = "lines_13_bigrams",
			COLLECTION_LINE_25 = "lines_25_bigrams",
			COLLECTION_LINE_46 = "lines_46_bigrams",
			COLLECTION_UPPER = "upper_trigrams",
			COLLECTION_LOWER = "lower_trigrams",
			COLLECTION_JOURNAL_ENTRIES = "journal_entries";



/* Login get user information*/
exports.getUser = (username, password, callback)=>{
	connectToDb((db)=>{
		db.collection(COLLECTION_USER).find({username:username, password:password}).toArray((err, result)=>{
			// console.log(result);
			if (err) console.log("Something goes worry: ",err);
			else callback(result);
		});
	});
}

/*  Create a new Reading  */
exports.createReading = (reading, callback)=>{
	reading.date= new Date(reading.date);
	// console.log("db:",reading);
	connectToDb((db)=>{
		// callback(reading);
		db.collection(COLLECTION_READINGS).insert(reading, (err, result)=>{
			if (err) console.log("Something goes worry: ",err);
			// callback(result.insertedId.toString());
			callback("ok");
		});

	});
}

/*  Get readings  */
exports.getRecentReadings = (startNumber, limitedNumber, userId, callback)=>{
	connectToDb((db)=>{
		db.collection(COLLECTION_READINGS).find(userId?{user_id: userId}:{}).sort({date:-1}).limit(limitedNumber*1).skip(startNumber-1).toArray((err, result)=>{
			if (err) console.log("Something goes worry: ",err);
			// console.log("db:",result);
			if(result.length!==0) findHexagramImages(result, callback);
			else callback(result);
		});
	});
}

/*  Get search readings  */
exports.getSearchReadings = (query, callback)=>{
	// if user search based on hexagrams' criterias, search hexagrams' img_arr first.
	// console.log("db query:", query);
	if(query.upperId!=="0" || query.lowerId!=="0" || query.line13Id!=="0" || query.line25Id!=="0" || query.line46Id!=="0"){
		let queryObject={};
		if(query.upperId!=="0") queryObject.upper_trigrams_id=new mongodb.ObjectId(query.upperId);
		if(query.lowerId!=="0") queryObject.lower_trigrams_id=new mongodb.ObjectId(query.lowerId);
		if(query.line13Id!=="0") queryObject.line_13_id=new mongodb.ObjectId(query.line13Id);
		if(query.line25Id!=="0") queryObject.line_25_id=new mongodb.ObjectId(query.line25Id);
		if(query.line46Id!=="0") queryObject.line_46_id=new mongodb.ObjectId(query.line46Id);
		connectToDb((db)=>{
			db.collection(COLLECTION_HEXAGRAMS).find(queryObject, {_id:0, img_arr:1}).toArray((err, results)=>{
				// console.log("db",results);
				searchForReadings(query, callback, results);
			});
		});
	}else{
		searchForReadings(query, callback);
	}
}
/*  Working with method above  */
searchForReadings = (query, callback, results)=>{
	// assemble query object for MongoDB
	let queryArray = [];
	if(query.people) queryArray.push({people: new RegExp(`.*${query.people}.*`)});
	if(query.userId) queryArray.push({user_id: query.userId});
	if(results){
		// console.log("db results:",results);
		// if no img_arr was found, it means not such combination exsite. Give a empty array and quit.
		if(results.length===0){
			callback([]);
			return;
		}
		// console.log("db return test ****************************");
		// if users used hexagrams' criterias, add img_arr for the searching criteria
		let hexagramQuery=[];
		results.map((element)=>{
			hexagramQuery.push({hexagram_arr_1: element.img_arr});
			hexagramQuery.push({hexagram_arr_2: element.img_arr});
			// queryArray.push({hexagram_arr_1: element.img_arr});
			// queryArray.push({hexagram_arr_2: element.img_arr});
		});
		queryArray.push({$or:hexagramQuery});
	}
	// Start to deal with start date and end date
	if(query.endDate) queryArray.push({$and: [{date: {$gte:new Date(query.startDate)}}, {date: {$lte:new Date(query.endDate)}} ]});
	else if(query.startDate) queryArray.push({date: query.startDate});
	if(queryArray.length===0) queryArray.push({}); // if no one searching criteria was given, give a empty array to query, which will pull out all readings.
	// console.log("db queryArray:",queryArray);

	connectToDb((db)=>{
		db.collection(COLLECTION_READINGS).find({$and:queryArray}).sort({date:-1}).toArray((err, result)=>{
			if (err) console.log("Something goes worry: ",err);
			// console.log("db:",result);
			if(result.length!==0) findHexagramImages(result, callback);
			else callback(result);
		});
	});
}

/*  Get hexagram  */
exports.getHexagram = (img_arr,callback)=>{
	connectToDb((db)=>{
		db.collection(COLLECTION_HEXAGRAMS).find({img_arr:img_arr}).next((err, result)=>{
			if (err) console.log("Something goes worry: ",err);
			callback(result);
		});
	});
}

/* Get all line grams data */
exports.getLinesBigrams = (queryObject, callback)=>{
	let imageInformationObject={"1":[],"2":[]};
	connectToDb((db)=>{
		db.collection(COLLECTION_LINE_13).find({_id:new mongodb.ObjectId(queryObject[0].line_13_id)}).next((err,result)=>{
			result=result?result:{};//handle no match. In final version, everyone should match one.
			result.title="Lines 1-3 Bigrams";
			imageInformationObject["1"].push(result);
			checkAndCallback(imageInformationObject,callback);
		});
		db.collection(COLLECTION_LINE_13).find({_id:new mongodb.ObjectId(queryObject[1].line_13_id)}).next((err,result)=>{
			result=result?result:{};
			result.title="Lines 1-3 Bigrams";
			imageInformationObject["2"].push(result);
			checkAndCallback(imageInformationObject,callback);
		});
		db.collection(COLLECTION_LINE_25).find({_id:new mongodb.ObjectId(queryObject[0].line_25_id)}).next((err,result)=>{
			result=result?result:{};
			result.title="Lines 2-5 Bigrams";
			imageInformationObject["1"].push(result);
			checkAndCallback(imageInformationObject,callback);
		});
		db.collection(COLLECTION_LINE_25).find({_id:new mongodb.ObjectId(queryObject[1].line_25_id)}).next((err,result)=>{
			result=result?result:{};
			result.title="Lines 2-5 Bigrams";
			imageInformationObject["2"].push(result);
			checkAndCallback(imageInformationObject,callback);
		});
		db.collection(COLLECTION_LINE_46).find({_id:new mongodb.ObjectId(queryObject[0].line_46_id)}).next((err,result)=>{
			result=result?result:{};
			result.title="Lines 4-6 Bigrams";
			imageInformationObject["1"].push(result);
			checkAndCallback(imageInformationObject,callback);
		});
		db.collection(COLLECTION_LINE_46).find({_id:new mongodb.ObjectId(queryObject[1].line_46_id)}).next((err,result)=>{
			result=result?result:{};
			result.title="Lines 4-6 Bigrams";
			imageInformationObject["2"].push(result);
			checkAndCallback(imageInformationObject,callback);
		});
	});
}
/* Working with getLinesBigrams method above */
function checkAndCallback(imageInformationObject,callback){
	if(imageInformationObject["1"].length===3 && imageInformationObject["2"].length===3) callback(imageInformationObject);
}

/*  Delete reading  */
exports.deleteReading = (readingId, userId, callback)=>{
	connectToDb((db)=>{
		db.collection(COLLECTION_READINGS).deleteOne({_id: new mongodb.ObjectId(readingId), user_id: userId}).then((result)=>{
			callback(null);
		});

	});
}

/*  Create a new journal  */
exports.createJournal = (journal, callback)=>{
	journal.date=new Date(journal.date);
	journal["_id"]=new mongodb.ObjectId();

	/*If no reading has been attached, create this journal to journal_entries collectiono
		otherwise push journal to reading collections*/
	if (Object.keys(journal.readings).length===0){
		delete journal.readings;
		connectToDb(db => db.collection(COLLECTION_JOURNAL_ENTRIES).insert(journal).then(result => callback(null)));
	}else{
		let readingObjectIdArray = [];
		Object.keys(journal.readings).map((element)=>{
			readingObjectIdArray.push(new mongodb.ObjectId(element));
		});
		// let readings = Object.assign({}, journal.readings);
		journal.pingPongStates = journal.readings; // Changing the name to poingPongStates
		delete journal.readings;
		connectToDb((db)=>{

			db.collection(COLLECTION_READINGS).update({_id: {$in: readingObjectIdArray}}, {
				$push: {
					journal_entries: journal
				}
			}, {multi: true}).then((result)=>{
				callback(null);
			});
		});
	}

}

/*  Get Journal list  */
exports.getJournalList = (queryObject, callback)=>{
	let query={_id: new mongodb.ObjectId(queryObject.readingId)};
	if(queryObject.userId!="") query.user_id=queryObject.userId;
	connectToDb((db)=>{
		db.collection(COLLECTION_READINGS).find(query,{journal_entries:1}).next((err,result)=>{
			// console.log(result);
			callback(result.journal_entries.sort((previous,next)=>{return new Date(next.date).getTime()-new Date(previous.date).getTime();}));
		});
	});
}

/* Get unattached journal list */
exports.getUnattachedJournalList = (userId, callback) => {
	// console.log("db:", userId);
	connectToDb((db)=>{
		db.collection(COLLECTION_JOURNAL_ENTRIES).find({user_id: userId}).toArray((err,result)=>{
			// console.log("db:", result);
			callback(result.sort((previous,next)=>{return new Date(next.date).getTime()-new Date(previous.date).getTime();}));
		});
	});
}

/*  Get one journal  */
exports.getJournal = (journalId, callback)=>{
	// console.log("db journalId:",journalId);
	connectToDb((db)=>{
		db.collection(COLLECTION_READINGS).find({"journal_entries._id": new mongodb.ObjectId(journalId)},{_id:1, reading_name:1, user_id:1, journal_entries:1}).toArray((err, result)=>{
			// console.log("db:",result);
			// Getting all reading ids
			let readingIds = {};
			// let readingNames = [];
			result.map((reading)=>{
				readingIds[reading._id] = reading.reading_name;
			});
			// Finding the right journal and attaching the reading ids array to it.
			result[0].journal_entries.map((element)=>{
				if(element._id==journalId){
					element.user_id=result[0].user_id;
					element.readingIds = readingIds;
					// element.readingNames = readingNames;
					// putting pingPongState to readingIds object. Format is {id: pingPongState}
					// console.log("db:",element);
					callback(element);
				}
			});

		});
	});
}

/*  Get one unattached journal  */
exports.getUnattachedJournal = (journalId, callback)=>{
	connectToDb((db)=>{
		db.collection(COLLECTION_JOURNAL_ENTRIES).find({_id: new mongodb.ObjectId(journalId)}).next((err, result)=>{
			// console.log("db:", result);
			callback(result);
		});
	});
}

/*  Delete one journal  */
exports.deleteJournal = (journalId, readingIds, userId, callback)=>{
	// console.log("db readingId:",readingId);
	// let journalObjectId =  new mongodb.ObjectId(journalId);
	// readingIds = readingIds.map((id)=>new mongodb.ObjectId(id));
	connectToDb((db)=>{
		db.collection(COLLECTION_READINGS).update({_id:{$in: readingIds.map((id)=>new mongodb.ObjectId(id))}, "user_id": userId}, {
			$pull: {journal_entries: {"_id":new mongodb.ObjectId(journalId)}}
		}, {multi: true}).then((result)=>{callback(null);});

	});
}

/*  Delete one unattached journal  */
exports.deleteUnattachedJournal = (journalId, userId, callback)=>{
	// console.log("db readingId:",journalId, userId);
	// let journalObjectId =  new mongodb.ObjectId(journalId);
	// readingIds = readingIds.map((id)=>new mongodb.ObjectId(id));
	connectToDb((db)=>{
		db.collection(COLLECTION_JOURNAL_ENTRIES).deleteOne({_id: new mongodb.ObjectId(journalId), "user_id": userId}).then((result)=>{callback(null);});
	});
}

/*  Update one journal
		1. journal.deleteReadingIds has all ids have to be removed from this journal. Using pull to remoeve all of them.
		2. find all reading that this journal will attach to.
		3. comparing journal id with readings' journals. If one of journal has same id, update it. If no one has the same id add this journal as a new one.
  */
exports.updateJournal = (journal, callback)=>{
	// console.log("db:", journal);
	if(journal.isUnattachedJournal && Object.keys(journal.readings).length===0){
		// if the journal is a unattached journal and this time still does not have any reading
		// update journal content in journal_entries collection
		updateUnattachedJournal(journal);
	}else if(journal.isUnattachedJournal && Object.keys(journal.readings).length!==0){
		// if the journal is a unattached journal and this time has readings
		// delete journal in journal_entries collection and push journal in readings
		connectToDb(db => {
			db.collection(COLLECTION_JOURNAL_ENTRIES).deleteOne({_id: new mongodb.ObjectId(journal._id)});
			updateJournalInReadings(journal);
		});
	}else{
		// if the journal is not a unattached journal, pull out journal from delete readings and update content
		// if no reading is attached, create journal in journal_entries collection
		// Firstly, remove journal from non attached readings
		connectToDb((db)=>{
			db.collection(COLLECTION_READINGS).update({_id: {$in: journal.deleteReadingIds.map((readingId)=>new mongodb.ObjectId(readingId))}}, {$pull: {journal_entries: {"_id": new mongodb.ObjectId(journal._id)}}},
	  {multi: true}).then(()=>{
			if(Object.keys(journal.readings).length!==0) updateJournalInReadings(journal);
				else updateUnattachedJournal(journal);
			});
		});
	}
	callback(null);


}
/* Working with above method*/
updateJournalInReadings = (journal)=>{
	// The second step is to update journal to reading documents
		let readingIds = Object.keys(journal.readings);
		journal.pingPongStates = journal.readings; // Changing the name to poingPongStates
		delete journal.readings;
		// delete journal.readingIds;
		delete journal.deleteReadingIds;
		delete journal.isUnattachedJournal;
		journal.date = new Date(journal.date);
		journal._id = new mongodb.ObjectId(journal._id);
		connectToDb((db)=>{
				db.collection(COLLECTION_READINGS).find({_id: {$in: readingIds.map((readingId)=>new mongodb.ObjectId(readingId))}}).forEach((reading)=>{
					let isUpdated = false;
					if(!reading.journal_entries) reading.journal_entries = [];
					reading.journal_entries = reading.journal_entries.map((journal_entry)=>{
						// console.log("db journalId:",journal._id);
						// Find the right journal and update the whole reading
						if(journal_entry._id.toString() == journal._id){
							isUpdated = true;
							return journal;
						} else return journal_entry;
					});
					// if isUpdated is still false, it means the reading do not have this journal before. we have to add it as a new one.
					if(!isUpdated) reading.journal_entries.push(journal);
					connectToDb((db)=>{db.collection(COLLECTION_READINGS).save(reading);});
				});
		});
}
/* Working with above method */
updateUnattachedJournal = (journal) => {
	delete journal.readings;
	// delete journal.readingIds;
	delete journal.deleteReadingIds;
	delete journal.isUnattachedJournal;
	journal.date = new Date(journal.date);
	journal._id = new mongodb.ObjectId(journal._id);
	connectToDb(db => {
		db.collection(COLLECTION_JOURNAL_ENTRIES).save(journal);
	});
}

/*  Get hexagrams  */
exports.getHexagrams = (query, callback)=>{
	connectToDb((db)=>{
		db.collection(COLLECTION_HEXAGRAMS).find(getHexagramsQueryObject(query)).toArray((err, result)=>{callback(result)});
	});
}
/*   working with method above    */
getHexagramsQueryObject = (query)=>{
	// console.log("db query:",query);
	let queryObject={};
	if(query.upperId && query.upperId!=0) queryObject.upper_trigrams_id = new mongodb.ObjectId(query.upperId);
  if(query.lowerId && query.lowerId!=0) queryObject.lower_trigram_id = new mongodb.ObjectId(query.lowerId);
  if(query.line13Id && query.line13Id!=0) queryObject.line_13_id = new mongodb.ObjectId(query.line13Id);
  if(query.line25Id && query.line25Id!=0) queryObject.line_25_id = new mongodb.ObjectId(query.line25Id);
  if(query.line46Id && query.line46Id!=0) queryObject.line_46_id = new mongodb.ObjectId(query.line46Id);
	// console.log("db:",queryObject);
	return queryObject;
}

/*  Get readings by Hexagram's id  */
exports.getReadingsByHexagramId = (imageArray, userId, callback)=>{
	let queryObject={$or: [{hexagram_arr_1: imageArray},{hexagram_arr_2: imageArray}]};
	if(userId) queryObject.user_id=userId;
	connectToDb((db)=>{
		db.collection(COLLECTION_READINGS).find(queryObject).toArray((err, result)=>{
			// console.log("db err:",err);
			// console.log("db:",result);
			if(result.length!==0) findHexagramImages(result, callback);
			else callback(result);
		});
	});
}

/****************	**************************************************************************
************* This method is using to find hexagram information for readings **************
*******************************************************************************************/
findHexagramImages = (readings, callback)=>{
	let checkNumber=0;
	let targetNumber=readings.length*2;
	// console.log("db:",result);
	connectToDb((db)=>{
		readings.map((reading)=>{
			// console.log("db:",reading.hexagram_arr_1);
			db.collection(COLLECTION_HEXAGRAMS).find({img_arr:reading.hexagram_arr_1}).next((err,imgInfo)=>{
				// console.log("err",err);
				reading.img1Info=imgInfo;
				checkNumber+=1;
				checkHexagramImageReadAndCallback(checkNumber, targetNumber, callback, readings);
			});
			db.collection(COLLECTION_HEXAGRAMS).find({img_arr:reading.hexagram_arr_2}).next((err,imgInfo)=>{
				reading.img2Info=imgInfo;
				checkNumber+=1;
				checkHexagramImageReadAndCallback(checkNumber, targetNumber, callback, readings);
			});
		});
	});

}
/*  working with method above  */
checkHexagramImageReadAndCallback = (checkNumber, targetNumber, callback, result)=>{
	if(checkNumber===targetNumber) callback(result);
}


/* Update a hexagram */
exports.updateHexagram = (hexagram, callback)=>{
	// console.log("db:", hexagram);
	let id = hexagram._id;
	delete hexagram._id;
	connectToDb((db)=>{
		db.collection(COLLECTION_HEXAGRAMS).update({_id: new mongodb.ObjectId(id)}, {$set: hexagram}).then((result)=>{callback(null)});
	});
}

/* Getting readings by searching name */
exports.getReadingsByName = (query, callback)=>{
	// console.log("db:", query);
	connectToDb((db)=>{
		db.collection(COLLECTION_READINGS).find({user_id: query.user_id, reading_name: new RegExp(`.*${query.name}.*`,"i")}, {_id: 1, reading_name: 1}).sort({date:-1}).limit(10).toArray((err, result)=>{callback(result)});
	});
}


/* checking whether user name is still available */
exports.isUserNameAvailable = (query, callback)=>{
	// console.log("db:", query);
	connectToDb((db)=>{
		db.collection(COLLECTION_USER).find({username: query.userName}).next((err, result)=>{
			callback(result ? false : true);
		});
	});
}

/* create and return a new user */
/* result format is like { result: { ok: 1, n: 1 },
  ops:
   [ { username: 'newuser',
       password: '1234',
       _id: 5973a501704d2930eca0306f } ],
  insertedCount: 1,
  insertedIds: [ 5973a501704d2930eca0306f ] }
*/
exports.createNewUser = (user, callback)=>{
	// console.log("db:", query);
	user.role=3; // set user a Emerald role
	connectToDb((db)=>{
		db.collection(COLLECTION_USER).insert(user, (err, result)=>{callback(result.ops[0])});
	});
}


/*
* The function that is used to get user id based on its Facebook id.
*/
/*exports.getUserIdFromFacebookOrGoogleId = function (facebookId, googleId, callback){
	// facebookId and googleId may be undefined
	if (facebookId == undefined) facebookId = "";
	if (googleId == undefined) googleId = "";
	connectToDb(function(db){
		var collection = db.collection("users");
		collection.find({"$or":[{"facebookId":facebookId}, {"googleId":googleId}]}).toArray(function(err,result){
			if (err) console.log("Something goes worry");
			else if (result!=null) callback(result[0]!=undefined ? result[0]._id.toString() : "");
		});
	});
}*/

 /*
* The function that is used to insert a new user to database and get id back.
*/
/*exports.insertUser = function (name, facebookId, googleId, email, callback){
	connectToDb(function(db){
		console.log(">>>>>>>>>> MongonDB.insertUser <<<<<<<<<<");
		console.log("name: "+name);
		console.log("facebookId: "+facebookId);
		console.log("googleId: "+googleId);
		console.log("email: "+email);
		var collection = db.collection("users");
		collection.insertOne({name:name, facebookId:facebookId, googleId:googleId, email:email},function(err,result){
			console.log("The results id: "+ result.insertedId.toString());
			callback(result.insertedId.toString());
		});

		console.log(">>>>>>>>>>>> Finished insert <<<<<<<<<<<<<");


	});
}*/

/*
* Use to execute the database
* Other function can call it to get the connection.
* Pass a function that contains the executed code.
*/
function connectToDb(executeFunction){
	MongodbClient.connect(DB_URL, function(err,db){
	if (err){
		console.log("Unable to connect to the mongoDB server. Error:", err);
	}else{
		// console.log("Connection of MongonDB was established.");
		// Run given mehtod
		executeFunction(db);
}
db.close();
});
}
