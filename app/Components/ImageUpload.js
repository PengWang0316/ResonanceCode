import React, { Component } from 'react';
import Dropzone from 'react-dropzone';

import styles from '../styles/ImageUpload.module.css';
import { uploadImages } from '../actions/JournalActions';

/** The component for the image uploading, deleting, and showing. */
export class ImageUpload extends Component {
  state = {
    isDropZoneActive: false,
    temporaryUploadStubs: [],
    previewImage: ''
  };

  /** Handle image drop event when a user add some images.
    * @param {array} files is an array of files' name.
    * @return {null} No return.
  */
  onImageDrop = files => {
    this.onDragLeave();
    let stubKey = 0;
    // Put stub divs to show the user some animation when the images are uploading.
    this.setState({ temporaryUploadStubs: files.map((_) => (<div key={stubKey++} className={`d-flex align-items-center ${styles.stubDiv}`}><div className={`progress-bar progress-bar-striped progress-bar-animated text-center ${styles.progressBar}`} role="progressbar">Uploading...</div></div>)) }, () => {
      uploadImages(files).then(result => {
        this.props.imageDropCallback(result.map(file => ({ [file.public_id]: file.secure_url })));
        // Remove the uploading animation.
        this.setState({ temporaryUploadStubs: [] });
      });
    });
    // this.props.imageDropCallback(result.map(file => 1)));
  };

  /** Show the cover div when a user draging some files to the uploading area.
    * @return {null} No return.
  */
  onDragEnter = () => this.setState({ isDropZoneActive: true });

  /** Hide the cover div when a user draging away the file from uploading area.
    * @return {null} No return.
  */
  onDragLeave = () => this.setState({ isDropZoneActive: false });

  /** Set the dropzone reference to this.dropzone in order to allow a button to trigge open file window.
    * @param {object} node is the reference of dropzone.
    * @return {null} No return.
  */
  setDropzoneReference = node => {
    this.dropzoneReference = node;
  };

  /** Open file select window via the dropzone library.
    * @return {null} No return.
  */
  dropzoneOpen = () => this.dropzoneReference.open();

  /** Call the callback function when a user click the remove image icon.
    * @param {object} event is the object repersents the element a user clicked.
    * @return {null} No return.
  */
  deleteImage = ({ target }) =>
    this.props.deleteImageCallback(target.parentElement.attributes.id.value);

  /** Show a modal with the image's preview. This method will use index.html's $ from jQUery.
    * @param {object} event is the object a user just clicked.
    * @return {null} No return.
  */
  showPreview = ({ target }) => this.setState({ previewImage: target.attributes.src.value }, () => $('#imagePreviewModal').modal('toggle'));
  /** Rendering the component.
    * @return {jsx} Return jsx for the component.
  */
  render() {
    return (
      <div className={`${styles.addJournalContentDiv}`}>
        <Dropzone
          multiple
          disableClick
          style={{ position: 'relative' }}
          accept="image/*"
          onDrop={this.onImageDrop}
          onDragEnter={this.onDragEnter}
          onDragLeave={this.onDragLeave}
          ref={this.setDropzoneReference}
        >
          { this.state.isDropZoneActive && <div className={`font-weight-bold h3 d-flex justify-content-center align-items-center ${styles.coverDiv}`}><div>Drop your files here...</div></div> }
          <div className="row font-weight-bold">
            <div className="col-sm-4 font-weight-bold">Upload your images</div>
            <div className="col-sm-8"><small className="text-muted">The maximum size of image is 3M.</small></div>
          </div>
          <div className="mt-3"><button id="addImagesBtn" type="button" className="btn btn-primary btn-sm" onClick={this.dropzoneOpen}>Add Images</button></div>
          {/* If this journal has none image,
              show the user some clues about how to upload images */}
          {this.props.uploadImages.length === 0 && this.state.temporaryUploadStubs.length === 0 && <div className={`d-flex justify-content-center align-items-center ${styles.emptyDiv}`}><div>Drag your images here or click button to upload them.</div></div>}
          <div className="d-flex flex-wrap">
            {this.props.uploadImages.length > 0 &&
                this.props.uploadImages.map(image => {
                  const key = Object.keys(image)[0];
                  return (<div key={key} className={styles.imageDiv} id={key}><img className={`img-thumbnail ${styles.uploadImage}`} src={image[key]} alt="Journal" role="button" tabIndex="-2" onClick={this.showPreview} /><i role="button" tabIndex="-1" title="Remove this image" className={`fas fa-times-circle ${styles.closeIcon}`} onClick={this.deleteImage} /></div>);
                })
              }
            {/* Show the uploading process divs */}
            {this.state.temporaryUploadStubs}
          </div>
        </Dropzone>
        {/* Show bigger image modal */}
        <div className="modal fade" id="imagePreviewModal" tabIndex="-1" role="dialog" aria-labelledby="imagePreviewModalLabel" aria-hidden="true">
          <div className="modal-dialog modal-lg" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="imagePreviewModalLabel">Image preview</h5>
                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <div className="d-flex justify-content-center align-items-center">
                  <img className={styles.previewImage} src={this.state.previewImage} alt="preview" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
export default ImageUpload;
