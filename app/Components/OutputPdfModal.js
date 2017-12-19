import React from 'react';

import LoadingAnimation from './SharedComponents/LoadingAnimation';

const OutputPdfModal = props => (
  <div className="modal fade" id="outputPdfModal" tabIndex="-1" role="dialog" aria-labelledby="outputPdfModalLabel" aria-hidden="true">
    <div className="modal-dialog" role="document">
      <div className="modal-content">
        <div className="modal-header">
          <h5 className="modal-title" id="outputPdfModalLabel">Output PDF...</h5>
          <button type="button" className="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div className="modal-body" style={{ minHeight: '300px', textAlign: 'center' }}>
          <div>Generating the PDF file, please wait a moment.</div>
          <LoadingAnimation />
        </div>
      </div>
    </div>
  </div>
);
export default OutputPdfModal;
