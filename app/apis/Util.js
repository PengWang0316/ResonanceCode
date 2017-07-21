function getFormatedDate(currentDate){
  let month = currentDate.getMonth()+1;
  month = month<10?`0${month}`:month;
  let date = currentDate.getDate();
  date = date<10?`0${date}`:date;
  return `${month}/${date}/${currentDate.getFullYear()}`;
}

module.exports={
  getCurrentDateString:()=>{
    /*let currentDate = new Date();
    let month = currentDate.getMonth()+1;
    month = month<10?`0${month}`:month;
    let date = currentDate.getDate();
    date = date<10?`0${date}`:date;*/
    return getFormatedDate(new Date());
  },
  getDateString:(date)=>{
    /*let tempDate=new Date(date);
    let month = tempDate.getMonth()+1;
    month = month<10?`0${month}`:month;
    let date = tempDate.getDate();
    date = date<10?`0${date}`:date;*/
    // console.log("util:", date);
    return getFormatedDate(new Date(date));
  },
  // get the correct array for the image
  getImageArray: (imgString)=>{
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
  },
  getHexagramImageClassNamesArray:(imgString,isFirstImage)=>{
    // console.log("imageNumber:",imgString);
    let classSide="img-line-side";
    let classMiddle="img-line-middle";
    let classMiddleB="img-line-middle-blank";
    let classRed="background-red";
    let classRedSide="img-line-side-red";
    let classRedMiddle="img-line-middle-red";

    let images={img1:[],img2:[]};
    imgString.split(",").map((element,lineNumber)=>{
      switch (element){
        case "6":
          images.img1[lineNumber]={side:classRedSide, middle:classMiddleB};
          images.img2[lineNumber]={side:classRedSide, middle:classRedMiddle};
          break;
        case "7":
          images.img1[lineNumber]=images.img2[lineNumber]={side:classSide, middle:classMiddle};
          break;
          case "9":
            images.img1[lineNumber]={side:classRedSide, middle:classRedMiddle};
            images.img2[lineNumber]={side:classRedSide, middle:classMiddleB};
            break;
          case "8":
            images.img1[lineNumber]=images.img2[lineNumber]={side:classSide, middle:classMiddleB};
            break;
      }
    });
    // console.log("images:",images);
    return isFirstImage?images.img1:images.img2;
  },
  getHexagramBlackImageClassNamesArray(hexagramString){
    // hexagramString is like "7,9-7,9-7,9-7,9-7,9-7,9"
    let imgString = hexagramString.replace(/\d-/g,"").slice(0,11);
    let classSide="img-line-side";
    let classMiddle="img-line-middle";
    let classMiddleB="img-line-middle-blank";
    let image=[];
    imgString.split(",").map((element,lineNumber)=>{
      switch (element){
        case "6":
          image[lineNumber]={side:classSide, middle:classMiddleB};
          break;
        case "7":
          image[lineNumber]={side:classSide, middle:classMiddle};
          break;
          case "9":
            image[lineNumber]={side:classSide, middle:classMiddle};
            break;
          case "8":
            image[lineNumber]={side:classSide, middle:classMiddleB};
            break;
      }
    });
    // console.log("images:",images);
    return image;
  },
  matchDateFormat(input){
    return input.match(/\d\d\/\d\d\/\d\d\d\d$/)?true:false;
  }

};
