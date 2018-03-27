import React from 'react';
import PropTypes from 'prop-types';

const basicStyles = { height: '3px', background: '#000' };

const BigramLine = ({ isBroken }) => {
  if (isBroken) return (
    <div className="d-flex" style={{ width: '30px' }}><div style={{ ...basicStyles, width: '45%' }} /><div style={{ ...basicStyles, width: '10%', background: '#FFF' }} /><div style={{ ...basicStyles, width: '45%' }} /></div>
  );
  return <div style={{ ...basicStyles, width: '30px' }} />;
};
BigramLine.propTypes = { isBroken: PropTypes.bool };
BigramLine.defaultProps = { isBroken: false };
export default BigramLine;
