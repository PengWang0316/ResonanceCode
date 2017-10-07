import React from "react";

const LoadingAnimation = _ =>
  <div className="w-100 h-100 d-flex justify-content-center align-items-center" style={{minHeight: "150px"}}>
    <div className="progress" style={{width: "100%"}}>
      <div className="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" aria-valuenow="75" aria-valuemin="0" aria-valuemax="100" style={{width: "100%"}}>Loding...</div>
    </div>
  </div>;
export default LoadingAnimation;
