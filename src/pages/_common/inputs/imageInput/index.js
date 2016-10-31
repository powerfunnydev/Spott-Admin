import Radium from 'radium';
import React, { Component, PropTypes } from 'react';
import ReactDropzone from 'react-dropzone';
import { colors, defaultSpacing } from '../../../styles';
import Label from '../_label';
import { downloadFile } from '../../../utils';

const uploadIcon = require('./upload.svg');
const DeleteIcon = Radium((props) => (
  <svg style={{ height: 24, width: 24 }} viewBox='0 0 24 24'>
    <path
      d='M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z'
      style={{ fill: colors.darkGray }} />
  </svg>
));
const DownloadIcon = Radium((props) => (
  <svg style={{ height: 24, width: 24 }} viewBox='0 0 24 24'>
    <path d='M5,20H19V18H5M19,9H15V3H9V9H5L12,16L19,9Z' style={{ fill: colors.darkGray }} />
  </svg>
));

function fileSizeToString (size) {
  const i = Math.floor(Math.log(size) / Math.log(1024));
  return `${(Number(size / Math.pow(1024, i)).toFixed(2))}${[ 'B', 'kB', 'MB', 'GB', 'TB' ][i]}`;
}

/**
 * The value of an ImageInput can either be:
 * - null: the field has not been filled with an image
 * - File: a file was selected, but has not been persisted to the server yet.
 * - A tuple { url, id }: A file was selected, and it has been persisted to the server.
 *   As such the server has an id.
 */
@Radium
export default class ImageInput extends Component {

  static propTypes = {
    disabled: PropTypes.bool,
    input: PropTypes.object.isRequired,
    first: PropTypes.bool,
    height: PropTypes.number.isRequired,
    label: PropTypes.string,
    required: PropTypes.bool,
    style: PropTypes.object,
    width: PropTypes.number.isRequired
  };

  constructor (props) {
    super(props);
    this.onClear = ::this.onClear;
    this.onDownload = ::this.onDownload;
    this.onDrop = ::this.onDrop;
  }

  onClear () {
    this.props.input.onChange(null);
  }

  onDownload (e) {
    e.preventDefault();
    downloadFile(this.props.input.value.url);
  }

  onDrop (files) {
    // Since we have set multiple to false during render, we can be sure that
    // files is a singleton array. As such, we extract the single file inside files.
    this.props.input.onChange(files[0]);
  }

  static styles = {
    padTop: {
      paddingTop: defaultSpacing * 0.75
    },
    inputContainer: {
      backgroundColor: colors.lightGray,
      border: `1px dashed ${colors.darkGray}`,
      borderRadius: 4,
      color: colors.darkGray,
      overflow: 'hidden',
      position: 'relative'
    },
    dropzone: {
      base: {
        alignItems: 'center',
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: defaultSpacing,
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0
      },
      active: {
        backgroundColor: 'rgba(204, 34, 85, 0.05)',
        boxShadow: `inset 0 0 0 3px ${colors.secondaryPink2}`, // Ensure that dimensions do not change when made active
        border: `1px solid ${colors.secondaryPink2}`
      },
      suggestion: {
        message: {
          fontSize: '12px',
          marginTop: 10,
          textAlign: 'center'
        },
        browseButton: {
          backgroundColor: colors.darkerGray,
          borderRadius: 4,
          color: colors.white,
          fontFamily: 'Rubik-Light',
          fontSize: '14px',
          marginTop: 10,
          padding: '4px 16px 4px 16px'
        }
      }
    },
    selectedImage: {
      image: {
        position: 'absolute',
        maxWidth: '100%',
        maxHeight: '100%',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        margin: 'auto'
      },
      buttons: {
        bottom: 5,
        display: 'flex',
        justifyContent: 'center',
        left: 0,
        position: 'absolute',
        right: 0
      },
      button: {
        height: 20,
        paddingLeft: 5,
        paddingRight: 5,
        width: 20
      }
    }
  };

  render () {
    const { disabled, input: { value }, first, height, label, required, style, width } = this.props;
    const styles = this.constructor.styles;
    return (
      <div style={[ !first && styles.padTop, style ]}>
        {label && <Label required={required} text={label} />}
        <div style={[ styles.inputContainer, { height, width } ]}>
          {/* Render dropzone */}
          {!disabled && !value &&
            <ReactDropzone accept='image/bmp,image/png,image/gif,image/jpeg,image/pjpeg'
              activeStyle={styles.dropzone.active}
              multiple={false}
              style={styles.dropzone.base}
              value={value}
              onDrop={this.onDrop}>
              {/* Render suggestion. */}
              <img src={uploadIcon} />
              <div style={styles.dropzone.suggestion.message}>
                Drop your image. We support BMP, PNG, GIF and JPEG.
              </div>
              <span style={styles.dropzone.suggestion.browseButton}>Browse</span>
            </ReactDropzone>}
          {/* Render selected image. */}
          {value &&
            <div>
              {/* Is it a selected file? */}
              {!value.id &&
                <img
                  alt={`${value.name} - ${fileSizeToString(value.size)}`}
                  src={value.preview}
                  style={styles.selectedImage.image}
                  title={`${value.name} - ${fileSizeToString(value.size)}`} />}
              {/* Is it a persisted image? */}
              {value.id &&
                <img
                  alt={`${value.id}`}
                  src={value.url}
                  style={styles.selectedImage.image}
                  title={`${value.id}`} />}
              {/* Delete button */}
              {!disabled &&
                <div style={styles.selectedImage.buttons}>
                  <div>
                    {value.id && <a href={value.url} style={styles.selectedImage.button} onClick={this.onDownload}><DownloadIcon /></a>}
                    <button style={styles.selectedImage.button} type='button' onClick={this.onClear}><DeleteIcon /></button>
                  </div>
                </div>}
            </div>}
        </div>
      </div>
    );
  }
}
