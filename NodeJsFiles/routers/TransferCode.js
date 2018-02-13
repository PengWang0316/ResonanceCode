/* Adding two new bigrams' fields and transferring three old bigrams' fields */
/*
const getHexagramNumber = (string1, string2) => {
  if (string1 === '7,9' && string2 === '7,9') return 0;
  else if (string1 === '7,9' && string2 === '6,8') return 1;
  else if (string1 === '6,8' && string2 === '6,8') return 2;
  return 3;
};
normalRouter.get('/addAndTransferBigrams', (req, res) => {
  mongodb.getHexagrams({}).then(hexagrams => {
    hexagrams.forEach(hexagram => {
      const imgArr = hexagram.img_arr.split('-');
      mongodb.updateHexagram({
        ...hexagram,
        line_13: getHexagramNumber(imgArr[0], imgArr[2]),
        line_25: getHexagramNumber(imgArr[1], imgArr[4]),
        line_46: getHexagramNumber(imgArr[3], imgArr[5]),
        line_14: getHexagramNumber(imgArr[0], imgArr[3]),
        line_36: getHexagramNumber(imgArr[2], imgArr[5])
      });
    });
  });
  res.end();
});
*/
/* Adding associated hexagrams based on each hexagram
normalRouter.get('/addAssociatedHexagrams', (req, res) => {
  mongodb.getHexagrams({}).then(hexagrams => {
    const hexagramObject = {};
    hexagrams.forEach(hexagram => { hexagramObject[hexagram.img_arr] = hexagram; });

    hexagrams.forEach(hexagram => {
      const newHexagram = { ...hexagram };
      const imgArray = hexagram.img_arr.split('-');

      const complementaryHexagram = imgArray.map(str => {
        if (str === '6,8') return '7,9';
        return '6,8';
      }).join('-');
      newHexagram.complementary_hexagram = complementaryHexagram;
      newHexagram.complementary_hexagram_number = hexagramObject[complementaryHexagram].number;
      newHexagram.complementary_hexagram_code =
        hexagramObject[complementaryHexagram].wilhelm_huang_hintley_name;

      const hiddenInfluenceHexagram = [imgArray[1], imgArray[2], imgArray[3], imgArray[2], imgArray[3], imgArray[4]].join('-');
      newHexagram.hidden_influence_hexagram = hiddenInfluenceHexagram;
      newHexagram.hidden_influence_hexagram_number = hexagramObject[hiddenInfluenceHexagram].number;
      newHexagram.hidden_influence_hexagram_code =
        hexagramObject[hiddenInfluenceHexagram].wilhelm_huang_hintley_name;

      const reverseHexagram = [...imgArray].reverse().join('-');
      newHexagram.reverse_hexagram = reverseHexagram;
      newHexagram.reverse_hexagram_number = hexagramObject[reverseHexagram].number;
      newHexagram.reverse_hexagram_code =
        hexagramObject[reverseHexagram].wilhelm_huang_hintley_name;

      mongodb.updateHexagram(newHexagram);
    });

  });
  res.end();
});
*/

/* Changing the hexagrams' associated code from wilhelm_huang_hintley_name to resonance_code_name
normalRouter.get('/changeAssociatedHexagramsCode', (req, res) => {
  mongodb.getHexagrams({}).then(hexagrams => {
    const hexagramObject = {};
    hexagrams.forEach(hexagram => { hexagramObject[hexagram.img_arr] = hexagram; });

    hexagrams.forEach(hexagram => {
      const newHexagram = { ...hexagram };
      const imgArray = hexagram.img_arr.split('-');

      const complementaryHexagram = imgArray.map(str => {
        if (str === '6,8') return '7,9';
        return '6,8';
      }).join('-');
      // newHexagram.complementary_hexagram = complementaryHexagram;
      // newHexagram.complementary_hexagram_number = hexagramObject[complementaryHexagram].number;
      newHexagram.complementary_hexagram_code =
        hexagramObject[complementaryHexagram].resonance_code_name;

      const hiddenInfluenceHexagram = [imgArray[1], imgArray[2], imgArray[3], imgArray[2], imgArray[3], imgArray[4]].join('-');
      // newHexagram.hidden_influence_hexagram = hiddenInfluenceHexagram;
      // newHexagram.hidden_influence_hexagram_number = hexagramObject[hiddenInfluenceHexagram].number;
      newHexagram.hidden_influence_hexagram_code =
        hexagramObject[hiddenInfluenceHexagram].resonance_code_name;

      const reverseHexagram = [...imgArray].reverse().join('-');
      // newHexagram.reverse_hexagram = reverseHexagram;
      // newHexagram.reverse_hexagram_number = hexagramObject[reverseHexagram].number;
      newHexagram.reverse_hexagram_code =
        hexagramObject[reverseHexagram].resonance_code_name;

      mongodb.updateHexagram(newHexagram);
    });

  });
  res.end();
});
*/

/* Adding Quartet bigrams based on each hexagram */
normalRouter.get('/addQuartetBigrams', (req, res) => {
  mongodb.getHexagrams({}).then(hexagrams => {
    const hexagramObject = {};
    hexagrams.forEach(hexagram => { hexagramObject[hexagram.img_arr] = hexagram; });

    hexagrams.forEach(hexagram => {
      const newHexagram = { ...hexagram };
      const imgArray = hexagram.img_arr.split('-');

      const potentiationArray = hexagram.img_arr;
      potentiationArray[1] = '7,9';
      potentiationArray[4] = '7,9';
      const potentiationHexagram = potentiationArray.join('-');
      newHexagram.potentiation_hexagram = potentiationHexagram;
      newHexagram.potentiation_hexagram_number = hexagramObject[potentiationHexagram].number;
      newHexagram.potentiation_hexagram_code =
        hexagramObject[potentiationHexagram].resonance_code_name;

      const growthArray = hexagram.img_arr;
      growthArray[1] = '7,9';
      growthArray[4] = '6,8';
      const growthHexagram = growthArray.join('-');
      newHexagram.growth_hexagram = growthHexagram;
      newHexagram.growth_hexagram_number = hexagramObject[growthHexagram].number;
      newHexagram.growth_hexagram_code =
        hexagramObject[growthHexagram].resonance_code_name;

      const maturationArray = hexagram.img_arr;
      maturationArray[1] = '6,8';
      maturationArray[4] = '6,8';
      const maturationHexagram = maturationArray.join('-');
      newHexagram.maturationh_hexagram = maturationHexagram;
      newHexagram.maturation_hexagram_number = hexagramObject[maturationHexagram].number;
      newHexagram.maturation_hexagram_code =
        hexagramObject[maturationHexagram].resonance_code_name;

      const reSourcingArray = hexagram.img_arr;
      reSourcingArray[1] = '6,8';
      reSourcingArray[4] = '7,9';
      const resourcingHexagram = reSourcingArray.join('-');
      newHexagram.resourcing_hexagram = resourcingHexagram;
      newHexagram.resourcing_hexagram_number = hexagramObject[resourcingHexagram].number;
      newHexagram.resourcing_hexagram_code =
        hexagramObject[resourcingHexagram].resonance_code_name;

      mongodb.updateHexagram(newHexagram);
    });

  });
  res.end();
});
