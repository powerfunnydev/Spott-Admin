import Radium from 'radium';
import React, { Component, PropTypes } from 'react';
import { buttonStyles } from '../../../_common/styles';

@Radium
export default class Completed extends Component {

  static propTypes = {
    name: PropTypes.string.isRequired,
    onOkay: PropTypes.func.isRequired
  };

  constructor (props) {
    super(props);
    this.onOkay = ::this.onOkay;
  }

  onOkay (e) {
    e.preventDefault();
    this.props.onOkay();
  }

  static styles = {
    text: {
      color: 'white',
      fontFamily: 'Rubik-Light'
    },
    title: {
      base: {
        fontSize: '35px',
        marginBottom: 10,
        textOverflow: 'ellipsis',
        overflow: 'hidden',
        whiteSpace: 'nowrap'
      },
      name: {
        fontFamily: 'Rubik-Bold'
      }
    },
    status: {
      fontSize: '70px',
      fontFamily: 'Rubik-Regular'
    },
    info: {
      fontSize: '20px',
      marginBottom: 30
    }
  }

  render () {
    const { name } = this.props;
    const styles = this.constructor.styles;
    return (
      <div style={styles.text}>
        <div style={styles.title.base}>Upload of <span style={styles.title.name}>{name}</span>...</div>
        <div style={styles.status}>Complete</div>
        <div style={styles.info}>Thank you, come again.</div>
        <div><button style={[ buttonStyles.base, buttonStyles.first, buttonStyles.bordered ]} onClick={this.onOkay}>Okay</button></div>
      </div>
    );
  }
}
