import React from "react";
import PropTypes from "prop-types";
import LineBigram from "./LineBigram";
// import QueryString from "query-string";

const DetailedReading = (props)=>{

  // componentWillMount(){
  //   let queryInfo=QueryString.parse(this.props.location.search);
  //   console.log("DetailedReading page queryInfo:",queryInfo);
  // }

    let renderArray=[];
    props.imageInfos.map((element,index)=>{
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
