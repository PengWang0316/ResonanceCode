
function getUser(doc){
  // parse and put user information from cookie
  let cookieArray=doc.cookie.split(";");
  let user={};
  cookieArray.map((element)=>{
    let tempArray=element.split("=");
    if(tempArray) user[tempArray[0].trim()]=tempArray[1];
  });
  // console.log("LoginApi getUser:",user);
  return user.username && user.userid && user.role?user:false;
}

module.exports={
  login:(doc,user)=>{
    // console.log("LoginApi login:",user);
    doc.cookie=`username=${user.username}`;
    doc.cookie=`userid=${user.userid}`;
    doc.cookie=`role=${user.role}`;
  },
  isLogin:(doc)=>{
    // let user=getUser(doc);
    // console.log("LoginApi isLogin:",user.username, user.userid, user.role);
    return getUser(doc);
  },
  logout:(doc)=>{
    doc.cookie="username=";
    doc.cookie="userid=";
    doc.cookie="role=";
  }
};
