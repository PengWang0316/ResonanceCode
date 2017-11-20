import React from 'react';
import { connect } from 'react-redux';

const LoadingAnimation = props => {
  if (props.isLoading) return (
    <div className="w-100 h-100 d-flex justify-content-center align-items-center" style={{ minHeight: '150px' }}>
      <div className="progress" style={{ width: '80%' }}>
        <div className="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" aria-valuenow="75" aria-valuemin="0" aria-valuemax="100" style={{ width: '100%' }}>Loading...</div>
      </div>
    </div>);
  return <div />;
};

const mapStateToProps = state => ({ isLoading: state.isLoading });
export default connect(mapStateToProps, null)(LoadingAnimation);
