var mongodb = require('mongodb');

var MongodbClient = mongodb.MongoClient;

const dbUrl = "mongodb://resonancecode_webuser:resonancecode_webuserpwd@ec2-13-59-175-157.us-east-2.compute.amazonaws.com:27017/resonancecode";
const COLLECTION_USER = "users";
const COLLECTION_READINGS = "readings";
const COLLECTION_HEXAGRAMS = "hexagrams";
const COLLECTION_LINE_13 = "lines_13_bigrams";
const COLLECTION_LINE_25 = "lines_25_bigrams";
const COLLECTION_LINE_46 = "lines_46_bigrams";
const COLLECTION_UPPER = "upper_trigrams";
const COLLECTION_LOWER = "lower_trigrams";



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
		console.log("db results:",results);
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
	console.log("db queryArray:",queryArray);

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
	let readingId=journal.reading_id;
	delete journal.reading_id;
	journal.date=new Date(journal.date);
	journal["_id"]=new mongodb.ObjectId();
	connectToDb((db)=>{

		db.collection(COLLECTION_READINGS).update({_id: new mongodb.ObjectId(readingId)}, {
			$push: {
				journal_entries: journal
			}
		}).then((result)=>{
			callback(null);
		});
	});
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

/*  Get one journal  */
exports.getJournal = (journalId, callback)=>{
	// console.log("db journalId:",journalId);
	connectToDb((db)=>{
		db.collection(COLLECTION_READINGS).find({"journal_entries._id": new mongodb.ObjectId(journalId)},{user_id:1, journal_entries:1}).next((err, result)=>{
			// console.log("db:",result);
			result.journal_entries.map((element)=>{
				if(element._id==journalId){
					element.user_id=result.user_id;
					callback(element);
				}
			});

		});
	});
}

/*  Delete one journal  */
exports.deleteJournal = (readingId, journalId, callback)=>{
	// console.log("db readingId:",readingId);
	// let journalObjectId =  new mongodb.ObjectId(journalId);
	connectToDb((db)=>{
		db.collection(COLLECTION_READINGS).update({"_id":new mongodb.ObjectId(readingId)}, {
			$pull: {journal_entries: {"_id":new mongodb.ObjectId(journalId)}}
		}).then((result)=>{callback(null);});

	});
}

/*  Update one journal  */
exports.updateJournal = (journal, callback)=>{
	// let readingId=journal.reading_id;
	// delete journal.reading_id;
	// journal["_id"]=new mongodb.ObjectId();
	console.log("db:", journal);
	connectToDb((db)=>{
		db.collection(COLLECTION_READINGS).update({_id: new mongodb.ObjectId(journal.reading_id), "journal_entries._id":new mongodb.ObjectId(journal.journalId)}, {$set: {"journal_entries.$.overview":journal.overview, "journal_entries.$.date":new Date(journal.date), "journal_entries.$.internal_environment":journal.internal_environment, "journal_entries.$.relational_environment":journal.relational_environment, "journal_entries.$.physical_environment":journal.physical_environment, "journal_entries.$.creative_vector":journal.creative_vector, "journal_entries.$.synchronicities":journal.synchronicities, "journal_entries.$.dreams":journal.dreams, "journal_entries.$.ping_pong_state":journal.ping_pong_state}}).then((result)=>{callback(null);});
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
	let queryObject={};
	if(query.upperId!=0) queryObject.upper_trigrams_id = new mongodb.ObjectId(query.upperId);
  if(query.lowerId!=0) queryObject.lower_trigrams_id = new mongodb.ObjectId(query.lowerId);
  if(query.line13Id!=0) queryObject.line_13_id = new mongodb.ObjectId(query.line13Id);
  if(query.line25Id!=0) queryObject.line_25_id = new mongodb.ObjectId(query.line25Id);
  if(query.line46Id!=0) queryObject.line_46_id = new mongodb.ObjectId(query.line46Id);
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
	MongodbClient. connect(dbUrl,function(err,db){
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
