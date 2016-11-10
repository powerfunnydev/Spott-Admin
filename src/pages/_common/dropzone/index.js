import Radium from 'radium';
import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import ReactDropzone from 'react-dropzone';
import { colors, makeTextStyle, fontWeights } from '../styles';
import ProgressBar from '../components/progressBar';

 /* eslint-disable react/no-set-state */

const uploadIcon = require('../../../assets/images/upload.svg');
const completedIcon = require('../../../assets/images/completed.svg');

@Radium
export default class Dropzone extends Component {

  static propTypes = {
    accept: PropTypes.string,
    type: PropTypes.string,
    onChange: PropTypes.func
  };

  constructor (props) {
    super(props);
    this.onDrop = ::this.onDrop;
    this.callback = ::this.callback;
    this.state = { };
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
        this.setState(...this.state, { showImage: true });
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
    profileImage: {
      width: '200px'
    },
    backgroundImage: {
      width: '426px'
    }
  };

  render () {
    const styles = this.constructor.styles;
    const { type } = this.props;
    return (
      <div style={type === 'backgroundImage' ? styles.backgroundImage : styles.profileImage}>
        {/* Render dropzone */}
        <ReactDropzone accept={this.props.accept} activeStyle={styles.activeDropzone} multiple={false} ref={(x) => { this.dropzone = x; }}
          style={styles.dropzone} onDrop={this.onDrop} >
          <div >
            { /* Uploading */ (this.state.progress && this.state.total && this.state.progress !== this.state.total &&
                <ProgressBar
                  progress={this.state.progress}
                  style={styles.progressBar}
                  total={this.state.total}/>) ||
            /* Upload completed */ (this.state.progress && this.state.total && this.state.progress === this.state.total &&
                <div>
                  {!this.state.showImage && <div style={styles.completed}>
                    <img src={completedIcon} style={styles.completedImage}/>
                    <div style={styles.completedText}>Completed</div>
                  </div>}
                  {this.state.showImage && this.state.file && this.state.file.type.startsWith('image') && <div style={styles.chosenImage}><img src={this.state.file.preview} style={styles.chosenImage}/></div>}
                </div>) ||
            /* Idle state, user has to chose a image */ (<img src={uploadIcon} style={styles.uploadImage}/>)
            }
          </div>
        </ReactDropzone>
      </div>
    );
  }
}
