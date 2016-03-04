import Radium from 'radium';
import React, { Component, PropTypes } from 'react';
import { buttonStyles } from '../../../_common/styles';

@Radium
export default class Cancelled extends Component {

  static propTypes = {
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
      fontSize: '35px',
      marginBottom: 10
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
    const styles = this.constructor.styles;
    return (
      <div style={styles.text}>
        <div style={styles.title}>Your upload has been</div>
        <div style={styles.status}>Cancelled</div>
        <div style={styles.info}>Even if you stumble, you’re still moving forward.</div>
        <div><button style={[ buttonStyles.base, buttonStyles.first, buttonStyles.bordered ]} onClick={this.onOkay}>Okay</button></div>
      </div>
    );
  }
}
