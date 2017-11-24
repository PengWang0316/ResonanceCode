import React from 'react';
import PropTypes from 'prop-types';
import LineBigram from './LineBigram';
// import QueryString from "query-string";

const DetailedReading = props => {
  // componentWillMount(){
  //   let queryInfo=QueryString.parse(this.props.location.search);
  //   console.log("DetailedReading page queryInfo:",queryInfo);
  // }
  /* Exchanging the order for line 46 and line 25 */
  const newArray = [props.imageInfos[0], props.imageInfos[2], props.imageInfos[1]];
  return (
    <div className="mt-3">
      {newArray.map(element =>
        <LineBigram key={element._id} title={element.title} data={element} />)}
    </div>
  );
};
DetailedReading.proptypes = {
  imageInfos: PropTypes.array.isRequired
};
export default DetailedReading;
