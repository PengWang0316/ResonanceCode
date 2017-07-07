"use strict";
import axios from "axios";

// const bookId = '594de4c014d93d0400fdcd05';
const baseUrl = 'http://ec2-13-59-175-157.us-east-2.compute.amazonaws.com/resonancecode/api/v1/';
const GET_PARAMS={un: "resonancecode_webuser", pd: "cyJz2b4vGb3EgHRf0Khq"};
const options = {
  // headers: {accept: 'application/json'}
  auth: GET_PARAMS,
  // headers:{
  //   'Access-Control-Request-Method': 'get',
  //  'Access-Control-Request-Headers': 'X-custom-header',
  // }
};
const LIMITED_NUMBER_READING_PERPAGE = 5;


function handleError(error){
  console.warn(error);
  return null;
};

function getUserInformation(result){
  // console.log("result",result);
  return result.data.length!==0?{
    username: result.data[0].username,
    userid: result.data[0]._id,
    role: result.data[0].role
  }:null;
};

function getFindingImgsArray(readings){
  // console.log("readings:",readings);
  let axiosArray=[];
  readings.map((element)=>{
    let img1_arr=Object.assign({img_arr:element.hexagram_arr_1}, GET_PARAMS);
    let img2_arr=Object.assign({img_arr:element.hexagram_arr_2}, GET_PARAMS);
    axiosArray.push(axios.all([axios.get(`${baseUrl}hexagrams`, {params:img1_arr}).then((reslut)=>{
      // add image information to reading object
      // console.log("***************", reslut);
      return reslut.data;
    }),axios.get(`${baseUrl}hexagrams`, {params:img2_arr}).then((reslut)=>{
      // add image information to reading object
      return reslut.data;
    })]).then((results)=>{
      // console.log("results:",results);
      element.img1Info=results[0];
      element.img2Info=results[1];
      return element;
    }));
  });
  return axiosArray;
}




module.exports={

  login:(username,password)=>{
    // console.log("making a call to login");
    let params=Object.assign({username:username,password:password},GET_PARAMS)
    return axios.get(`${baseUrl}login`,{params: params}).then(getUserInformation).catch(handleError);

    // console.log(GET_PARAMS);
    // return axios.get(`${baseUrl}login`,{params: { ...GET_PARAMS, username:username, password:password}}).catch(handleError);
  },
  createReading(reading){
    // options.reading = reading;
    let body=Object.assign({},options);
    body.reading=reading;
    return axios.post(`${baseUrl}reading`,body).then((result)=>{return result;}).catch(handleError);
  },
  getRecentReadings:(userId, startNumber)=>{
    let params=userId?{user_id:userId}:{};
    params.start_number=startNumber;
    params.limited_number=LIMITED_NUMBER_READING_PERPAGE;
    params=Object.assign(params,GET_PARAMS);
    return axios.get(`${baseUrl}reading`,{params: params}).then((result)=>{
      console.log(result);
      // let readings = limitReading(sortReading(result),startNumber);
      let axiosArray = getFindingImgsArray(result.data);
      return axios.all(axiosArray).then((result)=>{return result;});
    }).catch(handleError);
  },
  getLinesBigrams: (lineIdsObject)=>{
    let params=Object.assign(lineIdsObject,GET_PARAMS);
    return axios.get(`${baseUrl}getLinesForHexagram`,{params: params}).then((result)=>{return result;});
  },
  deleteReading: (readingId, userId)=>{
    let params=Object.assign({reading_id:readingId, user_id:userId},GET_PARAMS);
    return axios.delete(`${baseUrl}deleteReading`,{params: params}).then((result)=>{
      return result;
    });
  },
  createJournal(journal){
    // console.log("post post");
    let body=Object.assign({},options);
    body.journal=journal;
    return axios.post(`${baseUrl}journal_entries`,body).then((result)=>{return result;});
  },
  getJournalList(readingId, userId){
    let params=Object.assign({readingId: readingId, userId: userId},GET_PARAMS);
    return axios.get(`${baseUrl}getJournals`,{params: params}).then((result)=>{return result;});
  },
  getJournalBasedOnId(journalId){
    let params=Object.assign({journalId: journalId}, GET_PARAMS);
    return axios.get(`${baseUrl}getJournal`,{params: params}).then((result)=>{return result;});
  },
  deleteJournal(readingId, journalId){
    let params=Object.assign({readingId: readingId, journalId: journalId}, GET_PARAMS);
    return axios.delete(`${baseUrl}deleteJournal`,{params: params}).then((result)=>{
      return result;
    });
  },
  updateJournal(journalObject, journalId){
    // console.log("put put");
    let body=Object.assign({},options);
    journalObject.journalId=journalId;
    body.journal=journalObject;
    return axios.put(`${baseUrl}journal_entries`,body).then((result)=>{return result;});
  },
  getHexagrams(queryObject){
    let params=Object.assign(queryObject, GET_PARAMS);
    return axios.get(`${baseUrl}getHexagrams`,{params: params}).then((result)=>{return result;});
  },
  getReadingsBasedOnHexagram(imageArray, userId){
    let params=Object.assign({imageArray:imageArray, userId:userId}, GET_PARAMS);
    return axios.get(`${baseUrl}getReadingsByHexagramId`,{params: params}).then((result)=>{return result;});
  }

};
