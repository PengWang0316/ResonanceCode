import React from 'react';
// import PropTypes from 'prop-types';

import styles from '../styles/SearchHexagramsForm.module.css';

const SearchHexagramsForm = props => {
  const handleSubmit = event => {
    event.preventDefault();
    props.handleSubmit({
      upperId: document.getElementById('upper').value,
      lowerId: document.getElementById('lower').value,
      line13Id: document.getElementById('line13').value,
      line25Id: document.getElementById('line25').value,
      line46Id: document.getElementById('line46').value
    });
  };
  return (
    <div className={`${styles.searchFieldContainer}`}>
      <form className="form-horizontal" onSubmit={handleSubmit}>

        {/* Trigrams
          All list should be loaded from database when we can solve the limitation of api call. value should also be change to id
          */}
        <div className="form-group row mt-3">
          <label htmlFor="upper" className="col-sm-3 col-form-label">Upper Trigrams</label>
          <div className="col-sm-3">
            <select className="form-control" id="upper">
              <option value="0">--</option>
              <option value="595a8b17f271190858935906">Qian - Heaven</option>
              <option value="595a8b17f271190858935907">Zhen - Thunder</option>
              <option value="595a8b17f271190858935908">Kan - Water</option>
              <option value="595a8b17f271190858935909">Gen - Mountain</option>
              <option value="595a8b17f27119085893590a">Kun - Earth</option>
              <option value="595a8b17f27119085893590b">Xun - Wind</option>
              <option value="595a8b17f27119085893590c">Li - Fire</option>
              <option value="595a8b17f27119085893590d">Dui - Lake</option>
            </select>
          </div>
          <label htmlFor="lower" className="col-sm-3 col-form-label">Lower Trigrams</label>
          <div className="col-sm-3">
            <select className="form-control" id="lower">
              <option value="0">--</option>
              <option value="595a91252d1ae608c4aa2935">Qian - Heaven</option>
              <option value="595a91252d1ae608c4aa2936">Zhen - Thunder</option>
              <option value="595a91252d1ae608c4aa2937">Kan - Water</option>
              <option value="595a91252d1ae608c4aa2938">Gen - Mountain</option>
              <option value="595a91252d1ae608c4aa2939">Kun - Earth</option>
              <option value="595a91252d1ae608c4aa293a">Xun - Wind</option>
              <option value="595a91252d1ae608c4aa293b">Li - Fire</option>
              <option value="595a91252d1ae608c4aa293c">Dui - Lake</option>
            </select>
          </div>
        </div>

        {/* Lines 1-3 Bigrams */}
        <div className="form-group row mt-3">
          <label htmlFor="line13" className="col-sm-4 col-form-label">Lines 1-3 Bigrams</label>
          <div className="col-sm-8">
            <select className="form-control" id="line13">
              <option value="0">--</option>
              <option value="595a99862e3b11095f090968">Emptying/Emerging</option>
              <option value="595a99862e3b11095f090969">Doing/Producing</option>
              <option value="595a99862e3b11095f09096a">Embodying/Attuning</option>
              <option value="595a99862e3b11095f09096b">Shedding/Composting</option>
            </select>
          </div>
        </div>

        {/* Lines 2-5 Bigrams */}
        <div className="form-group row mt-3">
          <label htmlFor="line25" className="col-sm-4 col-form-label">Lines 2-5 Bigrams</label>
          <div className="col-sm-8">
            <select className="form-control" id="line25">
              <option value="0">--</option>
              <option value="595a9aff5e190009eac339d6">Conception/Potentiation-Manifestation and Possibility fused in pregnancy</option>
              <option value="595a9aff5e190009eac339d7">Birth/Differentiation-Manifestation takes precedence</option>
              <option value="595a9aff5e190009eac339d8">Maturation/Cultivation-Manifestation and Possibility exchanges information/energy</option>
              <option value="595a9aff5e190009eac339d9">Integration/Returning to Source-Possibility takes precedence</option>
            </select>
          </div>
        </div>

        {/* Lines 4-6 Bigrams */}
        <div className="form-group row mt-3">
          <label htmlFor="line46" className="col-sm-4 col-form-label">Lines 4-6 Bigrams</label>
          <div className="col-sm-8">
            <select className="form-control" id="line46">
              <option value="0">--</option>
              <option value="595a9afa5e190009eac339d2">Emptying/Emerging</option>
              <option value="595a9afa5e190009eac339d3">Doing/Producing</option>
              <option value="595a9afa5e190009eac339d4">Embodying/Attuning</option>
              <option value="595a9afa5e190009eac339d5">Shedding/Composting</option>
            </select>
          </div>
        </div>

        {/* Search button */}
        <div className="text-right mt-3"><button type="submit" className="btn btn-info loginButton">Submit</button></div>

      </form>
    </div>
  );
};

// SearchHexagramsForm.propTypes = {
//   handleSubmit: PropTypes.func.isRequired
// };
export default SearchHexagramsForm;
