 /* eslint-disable react/no-set-state */
import React, { Component, PropTypes } from 'react';
import Radium from 'radium';
import ReactDOM from 'react-dom';
import ReactDropzone from 'react-dropzone';
import { colors, makeTextStyle, fontWeights } from '../styles';
import ProgressBar from '../components/progressBar';
import Dropdown, { styles as dropdownStyles } from '../components/actionDropdown';
import { downloadFile } from '../../../utils';
import { aspectRatios, ROUND_LOGO } from '../../../constants/imageTypes';

const uploadIcon = require('../../../assets/images/upload.svg');
const completedIcon = require('../../../assets/images/completed.svg');

function mergeStyles (array) {
  let styles = {};
  for (const style of array) {
    styles = { ...styles, ...style };
  }
  return styles;
}

@Radium
export default class ImageDropzone extends Component {

  static propTypes = {
    accept: PropTypes.string, // Accepts only the given formats.
    downloadUrl: PropTypes.string, // Url to download the image. this is different from the imageUrl, cause the downloadUrl contains a image with higher resolution.
    imageUrl: PropTypes.string, // Url retrieved from server
    multiple: PropTypes.bool, // Possability to upload multiple images
    noPreview: PropTypes.bool, // Never displays an image
    showNoImage: PropTypes.bool, // Used we use this dropzone to upload images, without displaying the uploaded image.
    showOnlyUploadedImage: PropTypes.bool, // Only dislays a image when this is uploaded to the server (imageUrl!==undefined), often used by entities with locales
    style: PropTypes.object,
    type: PropTypes.string,
    onChange: PropTypes.func,
    onClick: PropTypes.func,
    onDelete: PropTypes.func
  };

  constructor (props) {
    super(props);
    this.onChange = ::this.onChange;
    this.onClick = ::this.onClick;
    this.onDrop = ::this.onDrop;
    this.callback = ::this.callback;
    this.onDelete = :: this.onDelete;
    // we haven't delete the image yet
    this.state = { deleteImage: false };
  }

  /**
   * Focus this input.
   */
  componentDidMount () {
    setTimeout(() => {
      ReactDOM.findDOMNode(this.dropzone).focus();
    }, 0);
  }

  componentWillReceiveProps (nextProps) {
    // If chance from locale (=language), we need to reset the state.
    if (this.props.showOnlyUploadedImage && nextProps.imageUrl !== this.props.imageUrl) {
      this.setState({
        ...this.state,
        file: undefined,
        showImage: false,
        deleteImage: false,
        progress: 0,
        total: 0
      });
    }
  }

  callback (progress, total) {
    this.setState(...this.state, { progress, total });
    if (progress === total) {
      const { noPreview } = this.props;
      // If we want to show a preview, set a timeout.
      !noPreview && setTimeout(() => {
        this.setState({ ...this.state, showImage: true });
      }, 1000);
    }
    console.log('progress ', (progress / total) * 100, '%');
  }

  async onDrop (acceptedFiles) {
    if (this.props.onChange) {
      for (const acceptedFile of acceptedFiles) {
        this.setState(...this.state, { file: acceptedFile, showImage: false, deleteImage: false });
        await this.props.onChange({ callback: this.callback, file: acceptedFile });
      }
    }
  }

  onChange (e) {
    e.preventDefault();
    e.stopPropagation();
    this.dropzone.open();
  }

  async onDelete (e) {
    // We want to delete the image. We need to set the state right.
    await this.props.onDelete();
    this.setState({
      ...this.state,
      file: undefined,
      showImage: false,
      deleteImage: true,
      progress: 0,
      total: 0
    });
  }

  onClick (e) {
    e.stopPropagation();
    const { onClick } = this.props;
    if (onClick) {
      onClick();
    }
  }

  static styles = {
    dropzone: {
      display: 'flex',
      textAlign: 'center',
      justifyContent: 'center',
      position: 'relative',
      width: '100%',
      height: '200px',
      alignItems: 'center',
      border: `1px dashed ${colors.lightGray2}`,
      borderRadius: '2px',
      ...makeTextStyle(fontWeights.medium, '12px'),
      fontWeight: 500,
      color: colors.darkGray2
    },
    activeDropzone: {
      backgroundColor: 'rgba(230, 248, 253, 0.5)',
      cursor: 'copy'
    },
    uploadImage: {
      width: '12px',
      height: '14px'
    },
    completed: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    },
    completedImage: {
      width: '8px',
      height: '6px'
    },
    completedText: {
      paddingTop: '11px'
    },
    chosenImageContainer: {
      position: 'absolute',
      top: 0,
      left: 0,
      bottom: 0,
      right: 0,
      width: 'auto'
    },
    chosenImage: {
      position: 'absolute',
      maxWidth: '100%',
      maxHeight: '100%',
      top: 0,
      left: 0,
      bottom: 0,
      right: 0,
      margin: 'auto'
    },
    roundImageClip: {
      clipPath: 'circle(50% at 50% 50%)'
    },
    progressBar: {
      width: '100%'
    },
    dropdownButton: {
      position: 'absolute',
      right: 7,
      top: 7,
      zIndex: 12
    },
    pointer: {
      cursor: 'pointer'
    }
  };

  render () {
    const styles = this.constructor.styles;
    const { accept, type, imageUrl, downloadUrl, onDelete, style, onChange, noPreview, multiple, showOnlyUploadedImage, showNoImage } = this.props;
    // If we have delete an image, we don't want to display the imageUrl or downloadUrl,
    // cause it doesn't exist anymore.
    // If we didn't delete an image, but there is an image, show that image.
    const downloadUrlOrPreview = !showNoImage && !showOnlyUploadedImage && this.state.showImage && this.state.file && this.state.file.type.startsWith('image') && this.state.file.preview || !this.state.deleteImage && downloadUrl;
    const imageUrlOrPreview = !showNoImage && !showOnlyUploadedImage && this.state.showImage && this.state.file && this.state.file.type.startsWith('image') && this.state.file.preview || !this.state.deleteImage && imageUrl;
    return (
      <div style={{ position: 'relative' }}>
        {/* Render dropzone */}
        <ReactDropzone
          accept={accept || 'image/*'} activeStyle={styles.activeDropzone}
          disableClick={Boolean(!noPreview && imageUrlOrPreview)}
          multiple={multiple}
          ref={(x) => { this.dropzone = x; }}
          style={mergeStyles([ styles.dropzone, onChange && styles.pointer, { width: 200 * (aspectRatios[type] || 1) }, style ])}
          onDrop={this.onDrop} >
          <div onClick={this.onClick}>
            {downloadUrlOrPreview &&
              <Dropdown style={styles.dropdownButton}>
                {downloadUrlOrPreview && <div key='downloadImage' style={dropdownStyles.floatOption} onClick={(e) => { downloadFile(downloadUrlOrPreview); }}>Download</div>}
                {downloadUrlOrPreview && onChange && <div style={dropdownStyles.line}/>}
                {downloadUrlOrPreview && onChange && <div key='replaceImage' style={dropdownStyles.floatOption} onClick={this.onChange}>Replace</div>}
                {downloadUrlOrPreview && onDelete && <div style={dropdownStyles.line}/>}
                {downloadUrlOrPreview && onDelete && <div key='deleteImage' style={dropdownStyles.floatOption} onClick={this.onDelete}>Delete</div>}
              </Dropdown>}
            {// Uploading
            (this.state.progress && this.state.total && this.state.progress !== this.state.total &&
              <ProgressBar
                progress={this.state.progress}
                style={styles.progressBar}
                total={this.state.total}/>) ||
            // Upload completed
            (!showNoImage && this.state.progress && this.state.total && this.state.progress === this.state.total &&
                <div>
                  {!this.state.showImage && <div style={styles.completed}>
                    <img src={completedIcon} style={styles.completedImage}/>
                    <div style={styles.completedText}>Completed</div>
                  </div>}
                  { // We want to display the in local image when we have uploaded an image (instant response).
                    !noPreview && this.state.showImage && this.state.file && this.state.file.type.startsWith('image') &&
                    (!showOnlyUploadedImage && <img src={this.state.file.preview} style={styles.chosenImage}/> ||
                    // If we don't want to display the local image, we wait for the url of the server.
                    showOnlyUploadedImage && imageUrlOrPreview && <img src={imageUrlOrPreview} style={[ styles.chosenImage, type === ROUND_LOGO && styles.roundImageClip ]}/> ||
                    <div style={styles.completed}>Oops, no image to show...</div>) }
                </div>) ||
            // When there was already an image uploaded
            ((!noPreview && imageUrlOrPreview) &&
              <img src={imageUrlOrPreview} style={[ styles.chosenImage, type === ROUND_LOGO && styles.roundImageClip ]}/>) ||
            // Idle state, user has to chose a image.
            <img src={uploadIcon} style={styles.uploadImage}/>}
          </div>
        </ReactDropzone>
      </div>
    );
  }
}
