import Radium from 'radium';
import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import ReactDropzone from 'react-dropzone';
import { fileSizeToString } from '../../../utils';
import { colors, errorTextStyle } from '../styles';
import ProgressBar from '../../_common/components/progressBar';

const uploadIcon = require('./upload.svg');

@Radium
export default class Dropzone extends Component {

  static propTypes = {
    accept: PropTypes.string,
    input: PropTypes.object,
    message: PropTypes.node.isRequired,
    meta: PropTypes.object,
    name: PropTypes.string,
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
    this.setState({ progress, total });
    console.log('progress ', (progress / total) * 100, '%');
  }

  onDrop (acceptedFiles) {
    // if we use redux form, update input field.
    if (this.props.input) {
      // Since we have set multiple to false during render, we can be sure that
      // files is a singleton array. As such, we extract the single file inside files.
      this.props.input.onChange(acceptedFiles[0]);
    }
    // if we don't use redux form, invoke onChange method.
    if (this.props.onChange) {
      this.props.onChange({ callback: this.callback, file: acceptedFiles[0] });
    }
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
    const { input, message, meta } = this.props;
    const value = input && input.value;
    const styles = this.constructor.styles;
    return (
      <div>
        {/* Render dropzone */}
        <ReactDropzone accept={this.props.accept} activeStyle={styles.activeDropzone} disablePreview multiple={false} ref={(x) => { this.dropzone = x; }}
          value={value} onDrop={this.onDrop}>
          {this.state.progress && this.state.total &&
            <div style={styles.dropzone}>
              <ProgressBar progress={this.state.progress} total={this.state.total} style={{ width: '200px' }}/>
            </div> ||
            <div style={styles.dropzone}>
              <img src={uploadIcon} />
              <div style={styles.message}>
                {message}
              </div>
              <span style={styles.browseButton}>Browse</span>
            </div>
          }
        </ReactDropzone>

        {/* Render information about selected video. */}
        {value &&
          <div style={styles.file.container} title={`${value.name} - ${fileSizeToString(value.size)}`}>
            <div style={styles.file.name}>{value.name}</div>
            <div style={styles.file.size}>{fileSizeToString(value.size)}</div>
          </div>}

        {meta && meta.touched && meta.error && <div style={errorTextStyle}>{meta.error}</div>}
      </div>
    );
  }
}
