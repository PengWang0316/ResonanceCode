import axios from "axios";

const bookId = '594de4c014d93d0400fdcd05';
const baseUrl = 'https://api.fieldbook.com/v1/' + bookId;
const options = {
  headers: {accept: 'application/json'},
  auth: {
    username: "key-3",
    password: "cyJz2b4vGb3EgHRf0Khq"
  }
};

function handleError(error){
  console.warn(error);
  return null;
};

function getUserInformation(result){
  // console.log("result",result);
  return result.data.length!==0?{
    username: result.data[0].name,
    userid: result.data[0].user_id,
    role: result.data[0].role
  }:null;
};

function sortReading(result){
  // if one user have too many reading records, this method could slow system down.
  // I wish the fieldbook can offer sort data feature as soon as possible.

  result.data.sort((previous, next)=>{
    // let date1=new Date(previous.date);
    // let date2=new Date(next.date);
    return Date.parse(next.date)-Date.parse(previous.date);
  });
  console.log("after:",result);
  return result;
}

function limitReading(result,startNumber){
  // let dataLength=result.data.length>5?5:result.data.length
  console.log("-----",startNumber*1+5,result.data.length);
  // let endNumber = startNumber*1+4>result.data.length-1?result.data.length:startNumber*1+4;
  let endNumber= startNumber+4;
  console.log("startNumber endNumber: ",startNumber, endNumber);
  return result.data.slice(startNumber-1,endNumber);
}

// function getFullInfo(result){
//   console.log("**************",this.startNumber);
//   let readings = limitReading(sortReading(result));
//   let axiosArray = getFindingImgsArray(readings);
//   return axios.all(axiosArray).then((result)=>{return result;});
// }

function getFindingImgsArray(readings){
  console.log("readings:",readings);
  let axiosArray=[];
  readings.map((element)=>{
    axiosArray.push(axios.all([axios.get(`${baseUrl}/hexagrams?img_arr=${element.hexagram_arr_1}`, options).then((reslut)=>{
      // add image information to reading object
      return reslut.data[0];
    }),axios.get(`${baseUrl}/hexagrams?img_arr=${element.hexagram_arr_2}`, options).then((reslut)=>{
      // add image information to reading object
      return reslut.data[0];
    })]).then((results)=>{
      element.img1Info=results[0];
      element.img2Info=results[1];
      return element;
    }));

    /* It has been moved to Util class*/
    // get the correct array for the image
    /*function getImageArray(imgString){
      let array=imgString.split(",");
      let newString="";
      let arrayLength=array.length;
      // console.log("array:",array);
      array.map((element,index)=>{
      	if(element==6 || element==8) newString+="6,8";
          else newString+="7,9";
      	if(index<arrayLength-1) newString+="-";
      });
      return newString;
    }*/

    // axiosArray.push(axios.all([axios.get(baseUrl+`/hexagrams?img_arr=7,9-7,9-7,9-7,9-7,9-7,9`, options).then((reslut)=>{
    //   // add image information to reading object
    //   element.img1Info=reslut.data[0];
    //   return element;
    // }),axios.get(baseUrl+`/hexagrams?img_arr=7,9-7,9-7,9-7,9-7,9-7,9`, options).then((reslut)=>{
    //   // add image information to reading object
    //   element.img2Info=reslut.data[0];
    //   return element;
    // })]).then((results)=>{
    //   return results;
    // }));
  });
  return axiosArray;
}

function getLines(args){
  let linesArray = [];
  args.map((element)=>{
    linesArray.push(getLine(element.id, element.line, element.img_num));
  });
  /*return [getLine(img1_line1,1),getLine(img1_line2a,2),getLine(img1_line2b,2),getLine(img1_line4,4),getLine(img2_line1,1),getLine(img2_line2a,2),getLine(img2_line2b,2),getLine(img2_line4,4)];*/
  return linesArray;
}

function getLine(img_line_id,line,img_num){
  let lineDatabase;
  switch (line){
    case 1:
      lineDatabase="lines_1_3_bigrams";
      break;
    case 2:
      lineDatabase="lines_2_5_bigrams";
      break;
    case 4:
      lineDatabase="lines_4_6_bigrams";
      break;
  }
  return axios.get(`${baseUrl}/${lineDatabase}/${img_line_id}`, options).then((result)=>{
    result.line_name=line;
    result.img_num=img_num;
    return result;
  });
}

function getHexagramsSearchStr(hexagramsObject){
  let searchStr="?";
  if(hexagramsObject.upper!=0) searchStr+=`upper_id=${hexagramsObject.upper}&`;
  if(hexagramsObject.lower!=0) searchStr+=`lower_id=${hexagramsObject.lower}&`;
  if(hexagramsObject.line13!=0) searchStr+=`line_13_id=${hexagramsObject.line13}&`;
  if(hexagramsObject.line25!=0) searchStr+=`line_25_id=${hexagramsObject.line25}&`;
  if(hexagramsObject.line46!=0) searchStr+=`line_46_id=${hexagramsObject.line46}&`;
  // trim last ||
  return searchStr.slice(0, searchStr.length-1);
}

module.exports = {
  login:(username,password)=>{
    return axios.get(`${baseUrl}/users?name=${username}&password=${password}`,options).then(getUserInformation).catch(handleError);
  },
  getRecentReadings:(userId, startNumber)=>{
    // TODO changing it to use limit=xxx
    // Because the current version of fieldbook does not support query from a sorted view, we have to get all date and sort them manually. In the future, we may use limit=xxx to get small set of data from server.
    // this.startNumber=startNumber;
    let useridStr=userId?`?user_id=${userId}`:"";
    return axios.get(`${baseUrl}/reading${useridStr}`,options).then((result)=>{
      let readings = limitReading(sortReading(result),startNumber);
      let axiosArray = getFindingImgsArray(readings);
      return axios.all(axiosArray).then((result)=>{return result;});
    }).catch(handleError);
  },
  getLinesBigrams: (...args)=>{
    return axios.all(getLines(args)).then((result)=>{return result;});
  },
  createReading(reading){
    return axios.post(`${baseUrl}/reading`,reading,options).then((result)=>{return result;});
  },
  deleteReading(readingId){
    return axios.delete(`${baseUrl}/reading/${readingId}`,options).then((result)=>{return result;});
  },
  createJournal(journal){
    return axios.post(`${baseUrl}/journal_entries`,journal,options).then((result)=>{return result;});
  },
  updateJournal(journal,journalId){
    options.method = 'PATCH';
    options.headers["Content-Type"]= 'application/json';
    options.data =journal;
    return axios.request  (`${baseUrl}/journal_entries/${journalId}`,options).then((result)=>{return result;});
  },
  deleteJournal(journalId){
    return axios.delete(`${baseUrl}/journal_entries/${journalId}`,options).then((result)=>{return result;});
  },
  getJournalBasedOnReading(userId, readingId){
    return axios.get(`${baseUrl}/journal_entries?user_id=${userId}&reading_id=${readingId}`,options).then((result)=>{return result;});
  },
  getJournalBasedOnId(journalId){
    return axios.get(`${baseUrl}/journal_entries/${journalId}`,options).then((result)=>{return result;});
  },
  getJournalList(userId, readingId){
    return axios.get(`${baseUrl}/journal_entries?user_id=${userId}&reading_id=${readingId}`,options).then((result)=>{return result;});
  },
  getHexagrams(hexagramsObject){
    return axios.get(`${baseUrl}/hexagrams${getHexagramsSearchStr(hexagramsObject)}`, options).then((result)=>{
      return result.data;
    });
  },
  getReadingsBasedOnHexagram(img_arr, userId){
    let useridstr=userId?`&user_id=${userId}`:"";
    return axios.all([axios.get(`${baseUrl}/reading?hexagram_arr_1=${img_arr}${useridstr}`, options).then((result) => {
      return result.data;
    }), axios.get(`${baseUrl}/reading?hexagram_arr_2=${img_arr}${useridstr}`, options).then((result) => {
      return result.data;
    })]).then((result)=>{
      console.log("api:",result);
      let array=[];
      if(result[0].length>0) result[0].map((element)=>{array=array.concat(element)});
      if(result[1].length>0) result[1].map((element)=>{array=array.concat(element)});
      let axiosArray = getFindingImgsArray(array);
      return axios.all(axiosArray).then((result)=>{return result;});
      // return array;
    });
  },
  getTestContent(){
    return axios.get("https://ec2-13-59-175-157.us-east-2.compute.amazonaws.com/healthcheck").then((result)=>{return result});
  }

};
