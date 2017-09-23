import React from "react";
import PropTypes from "prop-types";
import LineBigram from "./LineBigram";
// import QueryString from "query-string";

const DetailedReading = (props)=>{

  // componentWillMount(){
  //   let queryInfo=QueryString.parse(this.props.location.search);
  //   console.log("DetailedReading page queryInfo:",queryInfo);
  // }

    const renderArray=[];
    /* Exchanging the order for line 46 and line 25 */
    const newArray = [props.imageInfos[0], props.imageInfos[2], props.imageInfos[1]]
    newArray.map((element,index)=>{
      renderArray.push(<LineBigram key={index} title={element.title} data={element} />);
    });

    return(
      <div className="detailContainer">
        {renderArray}
      </div>
    );

};
DetailedReading.proptypes={
  imageInfos: PropTypes.array.isRequired
};
export default DetailedReading;
