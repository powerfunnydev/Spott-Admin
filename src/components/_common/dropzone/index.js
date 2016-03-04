import Radium from 'radium';
import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import ReactDropzone from 'react-dropzone';
import { fileSizeToString } from '../../../utils';
import { colors } from '../styles';

const uploadIcon = require('./upload.svg');

@Radium
export default class Dropzone extends Component {

  static propTypes = {
    message: PropTypes.node.isRequired,
    value: PropTypes.object,
    onChange: PropTypes.func.isRequired
  };

  constructor (props) {
    super(props);
    this.onDrop = ::this.onDrop;
  }

  /**
   * Focus this input.
   */
  focus () {
    // Focus the first input
    ReactDOM.findDOMNode(this.dropzone).focus();
  }

  onDrop (files) {
    // Since we have set multiple to false during render, we can be sure that
    // files is a singleton array. As such, we extract the single file inside files.
    this.props.onChange(files[0]);
  }

  static styles = {
    file: {
      container: {
        backgroundColor: 'rgb(251, 252, 252)',
        border: `1px dashed ${colors.darkGray}`,
        borderRadius: 4,
        color: colors.darkGray,
        display: 'flex',
        fontSize: '12px',
        justifyContent: 'space-between',
        marginTop: 5,
        padding: 10
      },
      name: {
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap'
      },
      size: {
        fontFamily: 'Rubik-Regular',
        textAlign: 'right'
      }
    },
    dropzone: {
      alignItems: 'center',
      backgroundColor: 'rgb(251, 252, 252)',
      border: `1px dashed ${colors.darkGray}`,
      borderRadius: 4,
      color: colors.darkGray,
      cursor: 'pointer',
      display: 'flex',
      flexDirection: 'column',
      padding: 30
    },
    activeDropzone: {
      backgroundColor: 'rgba(34, 204, 85, 0.05)',
      boxShadow: 'inset 0 0 0 3px rgb(34, 204, 85)', // Ensure that dimensions do not change when made active
      border: '1px solid rgb(34, 204, 85)'
    },
    message: {
      marginTop: 10,
      textAlign: 'center'
    },
    browseButton: {
      backgroundColor: 'rgb(123, 129, 134)',
      borderRadius: 4,
      color: 'white',
      fontFamily: 'Rubik-Light',
      fontSize: '14px',
      marginTop: 10,
      padding: '4px 16px 4px 16px'
    }
  };

  render () {
    const { message, value } = this.props;
    const styles = this.constructor.styles;
    return (
      <div>
        {/* Render dropzone */}
        <ReactDropzone activeStyle={styles.activeDropzone} disablePreview multiple={false} ref={(x) => { this.dropzone = x; }}
          style={styles.dropzone} value={value} onDrop={this.onDrop}>
          <img src={uploadIcon} />
          <div style={styles.message}>
            {message}
          </div>
          <span style={styles.browseButton}>Browse</span>
        </ReactDropzone>
        {/* Render information about selected video. */}
        {value &&
          <div style={styles.file.container} title={`${value.name} - ${fileSizeToString(value.size)}`}>
            <div style={styles.file.name}>{value.name}</div>
            <div style={styles.file.size}>{fileSizeToString(value.size)}</div>
          </div>}
      </div>
    );
  }
}
