/* Transfor Hexagrams data from Fieldbook*/

var bookId = '594de4c014d93d0400fdcd05';
var baseUrl = 'https://api.fieldbook.com/v1/' + bookId;
var options = {
	headers: {accept: 'application/json'},
	auth: {
		username: "key-3",
		password: "cyJz2b4vGb3EgHRf0Khq"
	}
};

router.get("/transfor_hexagrams",(req, res)=>{
	// first get arraies for line13, line25, line46, lower, and upper_trigrams
  // let resultObject={line13:{},line25:{},line46:{},upper:{},lower:{}};
	mongoDB.getAllGramsInfo((results)=>{
    var url = baseUrl + '/hexagrams';
  	axios.get(url, options).then((result)=>{
  		// console.log(result.data[0]);
  		let newHexagramArray = [];
  		result.data.map((element)=>{
				let linesIndicator=getLinesIndicator(element.img_arr);
  			newHexagramArray.push({img_arr:element.img_arr, number: element.number, chinese_name:element.chinese_name, wilhelm_huang_hintley_name:element.wilhelm_huang_hintley_name, rc_description:element.rc_description, image_text:element.image_text, question:"", upper_trigrams_id:results.upper[element.upper_id], lower_trigram_id:results.lower[element.lower_id], line_13_id:results.line13[linesIndicator[0]], line_25_id:results.line25[linesIndicator[1]], line_46_id:results.line46[linesIndicator[2]]});
  		});
  		mongoDB.insertGramsData(newHexagramArray, "hexagrams", (result)=>{
  			res.send(result);
  		});
  		// res.send(JSON.stringify(newHexagramArray));
  	}).catch((error)=>{console.log(error);});
	});

});
/* Working with method above */
getLinesIndicator=(img_arr)=>{
	// img_arr is like "7,9-6,8-6,8-6,8-7,9-6,8"
	// return an array 0 is line 1 and 3, 1 is line 2 and 5, 2 is line 4 and 6
	let lines_arr=img_arr.replace(/\d-/g,"").slice(0,11).split(",");
	return [`${lines_arr[0]},${lines_arr[2]}`,`${lines_arr[1]},${lines_arr[4]}`,`${lines_arr[3]},${lines_arr[5]}`];
};;

/* Transfor lower upper data from Fieldbook*/
router.get("/transfor_upper",(req, res)=>{
	var url = baseUrl + '/upper_trigrams';
	axios.get(url, options).then((result)=>{
		// console.log(result.data[0]);
		let newHexagramArray = [];
		result.data.map((element)=>{
			newHexagramArray.push({name:element.name, i_ching_name: element.i_ching_name, rc_trigram_code: element.rc_trigram_code, trigram_possibility:element.trigram_possibility, temporary_number: element.id, image:""});
		});
		mongoDB.insertGramsData(newHexagramArray,"upper_trigrams", (result)=>{
			res.send(result);
		});
		// res.send(JSON.stringify(newHexagramArray));
	}).catch((error)=>{console.log(error);});
});

/* Transfor lower lower data from Fieldbook*/
router.get("/transfor_lower",(req, res)=>{
	var url = baseUrl + '/lower_trigrams';
	axios.get(url, options).then((result)=>{
		// console.log(result.data[0]);
		let newHexagramArray = [];
		result.data.map((element)=>{
			newHexagramArray.push({name:element.name, i_ching_name: element.i_ching_name, rc_trigram_code: element.rc_trigram_code, rc_interpretation:element.rc_interpretation, temporary_number: element.id, image:""});
		});
		mongoDB.insertGramsData(newHexagramArray,"lower_trigrams", (result)=>{
			res.send(result);
		});
		// res.send(JSON.stringify(newHexagramArray));
	}).catch((error)=>{console.log(error);});
});

/* Transfor line 13 data from Fieldbook*/
router.get("/transfor_line13",(req, res)=>{
	var url = baseUrl + '/lines_1_3_bigrams';
	axios.get(url, options).then((result)=>{
		// console.log(result.data[0]);
		let newHexagramArray = [];
		result.data.map((element)=>{
			newHexagramArray.push({name: element.name, energy_state: element.energy_state, question: element.question, temporary_number: element.id, image: ""});
		});
		mongoDB.insertGramsData(newHexagramArray,"lines_13_bigrams", (result)=>{
			res.send(result);
		});
		// res.send(JSON.stringify(newHexagramArray));
	}).catch((error)=>{console.log(error);});
});

/* Transfor line 46 data from Fieldbook*/
router.get("/transfor_line46",(req, res)=>{
	var url = baseUrl + '/lines_4_6_bigrams';
	axios.get(url, options).then((result)=>{
		// console.log(result.data[0]);
		let newHexagramArray = [];
		result.data.map((element)=>{
			newHexagramArray.push({name: element.name, energy_state: element.energy_state, question: element.question, temporary_number: element.id, image: ""});
		});
		mongoDB.insertGramsData(newHexagramArray,"lines_46_bigrams", (result)=>{
			res.send(result);
		});
		// res.send(JSON.stringify(newHexagramArray));
	}).catch((error)=>{console.log(error);});
});

/* Transfor line 25 data from Fieldbook*/
router.get("/transfor_line25",(req, res)=>{
	var url = baseUrl + '/lines_2_5_bigrams';
	axios.get(url, options).then((result)=>{
		// console.log(result.data[0]);
		let newHexagramArray = [];
		result.data.map((element)=>{
			newHexagramArray.push({name: element.name, manifestation: element.manifestation, possibilities: element.possibilities, question: element.question, temporary_number: element.id, image: ""});
		});
		mongoDB.insertGramsData(newHexagramArray,"lines_25_bigrams", (result)=>{
			res.send(result);
		});
		// res.send(JSON.stringify(newHexagramArray));
	}).catch((error)=>{console.log(error);});
});


/******************     code in MongoDB.js  *******************/
/*Temporary transfor data from FieldBook*/

exports.insertGramsData = (dataArray, collectionName, callback)=>{
	connectToDb((db)=>{
		db.collection(collectionName).insert(dataArray);
		callback("ok");
	});
}

exports.getAllGramsInfo = (callback)=>{
	let resultObject={line13:{},line25:{},line46:{},upper:{},lower:{}};
	connectToDb((db)=>{
		db.collection(COLLECTION_LINE_13).find({},{_id:1,temporary_number:1}).toArray((err,result)=>{result.map((element)=>{resultObject.line13[element.temporary_number]=element._id});});
		db.collection(COLLECTION_LINE_25).find({},{_id:1,temporary_number:1}).toArray((err,result)=>{result.map((element)=>{resultObject.line25[element.temporary_number]=element._id});});
		db.collection(COLLECTION_LINE_46).find({},{_id:1,temporary_number:1}).toArray((err,result)=>{result.map((element)=>{resultObject.line46[element.temporary_number]=element._id});});
		db.collection(COLLECTION_UPPER).find({},{_id:1,temporary_number:1}).toArray((err,result)=>{result.map((element)=>{resultObject.upper[element.temporary_number]=element._id});});
		db.collection(COLLECTION_LOWER).find({},{_id:1,temporary_number:1}).toArray((err,result)=>{result.map((element)=>{resultObject.lower[element.temporary_number]=element._id});callback(resultObject);});
	});
}
