/** Transforing the Date object to a mm/dd/yyyy format.
  * @param {object} currentDate is a Date object.
  * @return {string} Return a mm/dd/yyyy format date string.
*/
function getFormatedDate(currentDate) {
  let month = currentDate.getMonth() + 1;
  month = month < 10 ? `0${month}` : month;
  let date = currentDate.getDate();
  date = date < 10 ? `0${date}` : date;
  return `${month}/${date}/${currentDate.getFullYear()}`;
}

module.exports = {
  getCurrentDateString: () =>
    /* let currentDate = new Date();
    let month = currentDate.getMonth()+1;
    month = month<10?`0${month}`:month;
    let date = currentDate.getDate();
    date = date<10?`0${date}`:date; */
    getFormatedDate(new Date()),

  getDateString: (date) =>
    /* let tempDate=new Date(date);
    let month = tempDate.getMonth()+1;
    month = month<10?`0${month}`:month;
    let date = tempDate.getDate();
    date = date<10?`0${date}`:date; */
    // console.log("util:", date);
    getFormatedDate(new Date(date)),

  // get the correct array for the image
  getImageArray: imgString => {
    const array = imgString.split(',');
    let newString = '';
    const arrayLength = array.length;
    // console.log("array:",array);
    array.forEach((element, index) => {
      if (element * 1 === 6 || element * 1 === 8) newString += '6,8';
      else newString += '7,9';
      if (index < arrayLength - 1) newString += '-';
    });
    return newString;
  },
  getHexagramImageClassNamesArray: (imgString, isFirstImage) => {
    // console.log("imageNumber:",imgString);
    const classSide = 'img-line-side';
    const classMiddle = 'img-line-middle';
    const classMiddleB = 'img-line-middle-blank';
    // const classRed = 'background-red';
    const classRedSide = 'img-line-side-red';
    const classRedMiddle = 'img-line-middle-red';

    const images = { img1: [], img2: [] };
    imgString.split(',').forEach((element, lineNumber) => {
      switch (element) {
        case '6':
          images.img1[lineNumber] = { side: classRedSide, middle: classMiddleB };
          images.img2[lineNumber] = { side: classRedSide, middle: classRedMiddle };
          break;
        case '7':
          images.img1[lineNumber] = { side: classSide, middle: classMiddle };
          images.img2[lineNumber] = images.img1[lineNumber];
          break;
        case '9':
          images.img1[lineNumber] = { side: classRedSide, middle: classRedMiddle };
          images.img2[lineNumber] = { side: classRedSide, middle: classMiddleB };
          break;
        case '8':
          images.img1[lineNumber] = { side: classSide, middle: classMiddleB };
          images.img2[lineNumber] = images.img1[lineNumber];
          break;
        default:
          throw new Error('Wrong imgString');
      }
    });
    // console.log("images:",images);
    return isFirstImage ? images.img1 : images.img2;
  },
  getHexagramBlackImageClassNamesArray(hexagramString, isFirstImage) {
    // hexagramString is like "7,9-7,9-7,9-7,9-7,9-7,9"
    const imgString = hexagramString.replace(/\d-/g, '').slice(0, 11);
    const classSide = 'img-line-side';
    const classMiddle = 'img-line-middle';
    const classMiddleB = 'img-line-middle-blank';
    const images = { img1: [], img2: [] };
    imgString.split(',').forEach((element, lineNumber) => {
      switch (element) {
        case '6':
          images.img1[lineNumber] = { side: classSide, middle: classMiddleB };
          images.img2[lineNumber] = { side: classSide, middle: classMiddle };
          break;
        case '7':
          images.img1[lineNumber] = { side: classSide, middle: classMiddle };
          images.img2[lineNumber] = images.img1[lineNumber];
          break;
        case '9':
          images.img1[lineNumber] = { side: classSide, middle: classMiddle };
          images.img2[lineNumber] = { side: classSide, middle: classMiddleB };
          break;
        case '8':
          images.img1[lineNumber] = { side: classSide, middle: classMiddleB };
          images.img2[lineNumber] = images.img1[lineNumber];
          break;
        default:
          throw new Error('Wrong hexagramString');
      }
    });
    // console.log("images:",images);
    return isFirstImage ? images.img1 : images.img2;
  },
  matchDateFormat(input) {
    return !!input.match(/\d\d\/\d\d\/\d\d\d\d$/);
  }

};
