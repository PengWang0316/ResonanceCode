import React from 'react';
import PropTypes from 'prop-types';

import HexagramImage from './HexagramImage';
import styles from '../styles/ChangingLines.module.css';
import growthImage from '../imgs/growth.png';
import conceptionImage from '../imgs/conception.png';
import seedingImage from '../imgs/seeding.png';
import maturationImage from '../imgs/maturation.png';

/* The object of bigrams images. */
const imgStyles = {
  0: conceptionImage,
  1: growthImage,
  2: maturationImage,
  3: seedingImage
};
/* The object has bigrams' names for 25 14 and 36 */
const bigramNames251436 = {
  0: 'Potentiaion',
  1: 'Growth',
  2: 'Maturation',
  3: 'Re-Souring'
};

/* The object has bigrams' names for 13 */
const bigramNames13 = {
  0: 'Transcending/Emptying',
  1: 'Doing/Productive',
  2: 'Embodying/Attuning',
  3: 'Composition/Digesting'
};

/* The object has bigrams' names for 46 */
const bigramNames46 = {
  0: 'System Reset',
  1: 'Organizing/Expanding',
  2: 'Accruing Interest',
  3: 'Dispensing/Consolidating'
};

const ChangingLines = ({ hexagram, hexagramsImgArrMap }) => (
  <div className="mt-4">
    {/* Line 1 */}
    <div className="d-flex mb-2">
      <div className="mr-3">
        <div>Line 1 changes to:</div>
        <div>
          #&nbsp;&nbsp;{hexagramsImgArrMap[hexagram.changing_lines.line1.img_arr].number}
          &nbsp;&nbsp;
          {hexagramsImgArrMap[hexagram.changing_lines.line1.img_arr].resonance_code_name}
        </div>
      </div>
      <div className={styles.hexagramDiv}>
        <HexagramImage
          isBlack
          imageNumber={hexagram.changing_lines.line1.img_arr}
          isFirstImage
          isSmall
        />
      </div>
    </div>
    <table className={styles.table}>
      <tbody>
        <tr>
          <td>Particle Line 1/3</td>
          <td><img src={imgStyles[hexagram.changing_lines.line1.line_13[0]]} alt="bigrams" /> -&gt; <img src={imgStyles[hexagram.changing_lines.line1.line_13[1]]} alt="bigrams" /></td>
          <td>
            {bigramNames13[hexagram.changing_lines.line1.line_13[0]]} -&gt;
            {bigramNames13[hexagram.changing_lines.line1.line_13[1]]}
          </td>
        </tr>
        <tr>
          <td>Particle Line 1/4</td>
          <td><img src={imgStyles[hexagram.changing_lines.line1.line_14[0]]} alt="bigrams" /> -&gt; <img src={imgStyles[hexagram.changing_lines.line1.line_14[1]]} alt="bigrams" /></td>
          <td>
            {bigramNames251436[hexagram.changing_lines.line1.line_14[0]]} -&gt;
            {bigramNames251436[hexagram.changing_lines.line1.line_14[1]]}
          </td>
        </tr>
      </tbody>
    </table>
    <div className="mt-2 font-weight-blod">Line analysis:</div>
    <div className={styles.analysisDiv}>{hexagram.changing_lines.line1.analysis}</div>

    {/* Line 2 */}
    <div className="d-flex mt-4 mb-2">
      <div className="mr-3">
        <div>Line 2 changes to:</div>
        <div>
          #&nbsp;&nbsp;{hexagramsImgArrMap[hexagram.changing_lines.line2.img_arr].number}
          &nbsp;&nbsp;
          {hexagramsImgArrMap[hexagram.changing_lines.line2.img_arr].resonance_code_name}
        </div>
      </div>
      <div className={styles.hexagramDiv}>
        <HexagramImage
          isBlack
          imageNumber={hexagram.changing_lines.line2.img_arr}
          isFirstImage
          isSmall
        />
      </div>
    </div>
    <table className={styles.table}>
      <tbody>
        <tr>
          <td>Particle Line 2/5</td>
          <td><img src={imgStyles[hexagram.changing_lines.line2.line_25[0]]} alt="bigrams" /> -&gt; <img src={imgStyles[hexagram.changing_lines.line2.line_25[1]]} alt="bigrams" /></td>
          <td>
            {bigramNames251436[hexagram.changing_lines.line2.line_25[0]]} -&gt;
            {bigramNames251436[hexagram.changing_lines.line2.line_25[1]]}
          </td>
        </tr>
      </tbody>
    </table>
    <div className="mt-2 font-weight-blod">Line analysis:</div>
    <div className={styles.analysisDiv}>{hexagram.changing_lines.line2.analysis}</div>

    {/* Line 3 */}
    <div className="d-flex mt-4 mb-2">
      <div className="mr-3">
        <div>Line 3 changes to:</div>
        <div>
          #&nbsp;&nbsp;{hexagramsImgArrMap[hexagram.changing_lines.line3.img_arr].number}
          &nbsp;&nbsp;
          {hexagramsImgArrMap[hexagram.changing_lines.line3.img_arr].resonance_code_name}
        </div>
      </div>
      <div className={styles.hexagramDiv}>
        <HexagramImage
          isBlack
          imageNumber={hexagram.changing_lines.line3.img_arr}
          isFirstImage
          isSmall
        />
      </div>
    </div>
    <table className={styles.table}>
      <tbody>
        <tr>
          <td>Particle Line 1/3</td>
          <td><img src={imgStyles[hexagram.changing_lines.line3.line_13[0]]} alt="bigrams" /> -&gt; <img src={imgStyles[hexagram.changing_lines.line3.line_13[1]]} alt="bigrams" /></td>
          <td>
            {bigramNames13[hexagram.changing_lines.line3.line_13[0]]} -&gt;
            {bigramNames13[hexagram.changing_lines.line3.line_13[1]]}
          </td>
        </tr>
        <tr>
          <td>Particle Line 3/6</td>
          <td><img src={imgStyles[hexagram.changing_lines.line3.line_36[0]]} alt="bigrams" /> -&gt; <img src={imgStyles[hexagram.changing_lines.line3.line_36[1]]} alt="bigrams" /></td>
          <td>
            {bigramNames251436[hexagram.changing_lines.line3.line_36[0]]} -&gt;
            {bigramNames251436[hexagram.changing_lines.line3.line_36[1]]}
          </td>
        </tr>
      </tbody>
    </table>
    <div className="mt-2 font-weight-blod">Line analysis:</div>
    <div className={styles.analysisDiv}>{hexagram.changing_lines.line3.analysis}</div>

    {/* Line 4 */}
    <div className="d-flex mt-4 mb-2">
      <div className="mr-3">
        <div>Line 4 changes to:</div>
        <div>
          #&nbsp;&nbsp;{hexagramsImgArrMap[hexagram.changing_lines.line4.img_arr].number}
          &nbsp;&nbsp;
          {hexagramsImgArrMap[hexagram.changing_lines.line4.img_arr].resonance_code_name}
        </div>
      </div>
      <div className={styles.hexagramDiv}>
        <HexagramImage
          isBlack
          imageNumber={hexagram.changing_lines.line4.img_arr}
          isFirstImage
          isSmall
        />
      </div>
    </div>
    <table className={styles.table}>
      <tbody>
        <tr>
          <td>Particle Line 4/6</td>
          <td><img src={imgStyles[hexagram.changing_lines.line4.line_46[0]]} alt="bigrams" /> -&gt; <img src={imgStyles[hexagram.changing_lines.line4.line_46[1]]} alt="bigrams" /></td>
          <td>
            {bigramNames46[hexagram.changing_lines.line4.line_46[0]]} -&gt;
            {bigramNames46[hexagram.changing_lines.line4.line_46[1]]}
          </td>
        </tr>
        <tr>
          <td>Particle Line 1/4</td>
          <td><img src={imgStyles[hexagram.changing_lines.line4.line_14[0]]} alt="bigrams" /> -&gt; <img src={imgStyles[hexagram.changing_lines.line4.line_14[1]]} alt="bigrams" /></td>
          <td>
            {bigramNames251436[hexagram.changing_lines.line4.line_14[0]]} -&gt;
            {bigramNames251436[hexagram.changing_lines.line4.line_14[1]]}
          </td>
        </tr>
      </tbody>
    </table>
    <div className="mt-2 font-weight-blod">Line analysis:</div>
    <div className={styles.analysisDiv}>{hexagram.changing_lines.line4.analysis}</div>

    {/* Line 5 */}
    <div className="d-flex mt-4 mb-2">
      <div className="mr-3">
        <div>Line 5 changes to:</div>
        <div>
          #&nbsp;&nbsp;{hexagramsImgArrMap[hexagram.changing_lines.line5.img_arr].number}
          &nbsp;&nbsp;
          {hexagramsImgArrMap[hexagram.changing_lines.line5.img_arr].resonance_code_name}
        </div>
      </div>
      <div className={styles.hexagramDiv}>
        <HexagramImage
          isBlack
          imageNumber={hexagram.changing_lines.line5.img_arr}
          isFirstImage
          isSmall
        />
      </div>
    </div>
    <table className={styles.table}>
      <tbody>
        <tr>
          <td>Particle Line 2/5</td>
          <td><img src={imgStyles[hexagram.changing_lines.line5.line_25[0]]} alt="bigrams" /> -&gt; <img src={imgStyles[hexagram.changing_lines.line5.line_25[1]]} alt="bigrams" /></td>
          <td>
            {bigramNames251436[hexagram.changing_lines.line5.line_25[0]]} -&gt;
            {bigramNames251436[hexagram.changing_lines.line5.line_25[1]]}
          </td>
        </tr>
      </tbody>
    </table>
    <div className="mt-2 font-weight-blod">Line analysis:</div>
    <div className={styles.analysisDiv}>{hexagram.changing_lines.line5.analysis}</div>

    {/* Line 6 */}
    <div className="d-flex mt-4 mb-2">
      <div className="mr-3">
        <div>Line 6 changes to:</div>
        <div>
          #&nbsp;&nbsp;{hexagramsImgArrMap[hexagram.changing_lines.line6.img_arr].number}
          &nbsp;&nbsp;
          {hexagramsImgArrMap[hexagram.changing_lines.line6.img_arr].resonance_code_name}
        </div>
      </div>
      <div className={styles.hexagramDiv}>
        <HexagramImage
          isBlack
          imageNumber={hexagram.changing_lines.line6.img_arr}
          isFirstImage
          isSmall
        />
      </div>
    </div>
    <table className={styles.table}>
      <tbody>
        <tr>
          <td>Particle Line 4/6</td>
          <td><img src={imgStyles[hexagram.changing_lines.line6.line_46[0]]} alt="bigrams" /> -&gt; <img src={imgStyles[hexagram.changing_lines.line6.line_46[1]]} alt="bigrams" /></td>
          <td>
            {bigramNames46[hexagram.changing_lines.line6.line_46[0]]} -&gt;
            {bigramNames46[hexagram.changing_lines.line6.line_46[1]]}
          </td>
        </tr>
        <tr>
          <td>Particle Line 3/6</td>
          <td><img src={imgStyles[hexagram.changing_lines.line6.line_36[0]]} alt="bigrams" /> -&gt; <img src={imgStyles[hexagram.changing_lines.line6.line_36[1]]} alt="bigrams" /></td>
          <td>
            {bigramNames251436[hexagram.changing_lines.line6.line_36[0]]} -&gt;
            {bigramNames251436[hexagram.changing_lines.line6.line_36[1]]}
          </td>
        </tr>
      </tbody>
    </table>
    <div className="mt-2 font-weight-blod">Line analysis:</div>
    <div className={styles.analysisDiv}>{hexagram.changing_lines.line6.analysis}</div>

  </div>
);
ChangingLines.propTypes = {
  hexagram: PropTypes.object.isRequired,
  hexagramsImgArrMap: PropTypes.object.isRequired
};
export default ChangingLines;
