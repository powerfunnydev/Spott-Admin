 /* eslint-disable react/no-set-state */
import React, { Component, PropTypes } from 'react';
import Radium from 'radium';
import ReactDOM from 'react-dom';
import ReactDropzone from 'react-dropzone';
import { colors, makeTextStyle, fontWeights } from '../styles';
import ProgressBar from '../components/progressBar';
import Dropdown, { styles as dropdownStyles } from '../components/actionDropdown';
import { downloadFile } from '../../../utils';
import { aspectRatios } from '../../../constants/imageTypes';

const uploadIcon = require('../../../assets/images/upload.svg');
const completedIcon = require('../../../assets/images/completed.svg');

@Radium
export default class ImageDropzone extends Component {

  static propTypes = {
    accept: PropTypes.string,
    downloadUrl: PropTypes.string,
    imageUrl: PropTypes.string,
    type: PropTypes.string,
    onChange: PropTypes.func,
    onDelete: PropTypes.func
  };

  constructor (props) {
    super(props);
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

  callback (progress, total) {
    this.setState(...this.state, { progress, total });
    if (progress === total) {
      setTimeout(() => {
        this.setState({ ...this.state, showImage: true });
      }, 1000);
    }
    console.log('progress ', (progress / total) * 100, '%');
  }

  onDrop (acceptedFiles) {
    this.setState(...this.state, { file: acceptedFiles[0], showImage: false });
    if (this.props.onChange) {
      this.props.onChange({ callback: this.callback, file: acceptedFiles[0] });
    }
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
      color: colors.darkGray2,
      cursor: 'pointer'
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
    progressBar: {
      width: '130px'
    },
    dropdownButton: {
      position: 'absolute',
      right: 7,
      top: 7,
      zIndex: 12
    }
  };

  render () {
    const styles = this.constructor.styles;
    const { accept, type, imageUrl, downloadUrl, onDelete } = this.props;
    // If we have delete an image, we don't want to display the imageUrl or downloadUrl,
    // cause it doesn't exist anymore. So we show the local image if there is one.
    // Else, if we didn't delete an image, but there is an image, show that image.
    const downloadUrlOrPreview = this.state.showImage && this.state.file && this.state.file.type.startsWith('image') && this.state.file.preview || !this.state.deleteImage && downloadUrl;
    const imageUrlOrPreview = this.state.showImage && this.state.file && this.state.file.type.startsWith('image') && this.state.file.preview || !this.state.deleteImage && imageUrl;
    return (
      <div style={{ position: 'relative', width: 200 * (aspectRatios[type] || 1) }}>
        {/* Render dropzone */}
        <ReactDropzone accept={accept || 'image/*'} activeStyle={styles.activeDropzone} multiple={false} ref={(x) => { this.dropzone = x; }}
          style={styles.dropzone} onDrop={this.onDrop} >
          <div>
            {downloadUrlOrPreview && <Dropdown style={styles.dropdownButton}>
              {downloadUrlOrPreview && <div key='downloadImage' style={dropdownStyles.floatOption} onClick={(e) => { downloadFile(downloadUrlOrPreview); }}>Download</div>}
              {downloadUrlOrPreview && onDelete && <div style={dropdownStyles.line}/>}
              {downloadUrlOrPreview && onDelete && <div key='deleteImage' style={dropdownStyles.floatOption} onClick={this.onDelete}>Delete</div>}
            </Dropdown>}
            { /* Uploading */
              (this.state.progress && this.state.total && this.state.progress !== this.state.total &&
                <ProgressBar
                  progress={this.state.progress}
                  style={styles.progressBar}
                  total={this.state.total}/>) ||
            /* Upload completed */
            (this.state.progress && this.state.total && this.state.progress === this.state.total &&
                <div>
                  {!this.state.showImage && <div style={styles.completed}>
                    <img src={completedIcon} style={styles.completedImage}/>
                    <div style={styles.completedText}>Completed</div>
                  </div>}
                  {this.state.showImage && this.state.file && this.state.file.type.startsWith('image') &&
                    <img src={this.state.file.preview} style={styles.chosenImage}/>
                  }
                </div>) ||
            /* When there was already an image uploaded */
            ((imageUrlOrPreview) &&
              <img src={imageUrlOrPreview} style={styles.chosenImage}/>
            ) ||
            /* Idle state, user has to chose a image */
            (<img src={uploadIcon} style={styles.uploadImage}/>)
            }
          </div>
        </ReactDropzone>
      </div>
    );
  }
}
