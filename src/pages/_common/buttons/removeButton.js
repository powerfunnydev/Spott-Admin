import React, { Component, PropTypes } from 'react';
import Radium from 'radium';
import { confirmation } from '../../_common/askConfirmation';

const removeIcon = require('../../../assets/images/garbage.svg');

@Radium
export default class RemoveButton extends Component {
  static propTypes = {
    noCofirmation: PropTypes.bool,
    style: PropTypes.object,
    onClick: PropTypes.func.isRequired
  }

  constructor (props) {
    super(props);
    this.remove = :: this.remove;
  }

  async remove () {
    if (this.props.noCofirmation) {
      await this.props.onClick();
    } else {
      const result = await confirmation();
      if (result) {
        await this.props.onClick();
      }
    }
  }

  render () {
    const { style } = this.props;
    return (
      <button style={style} onClick={() => this.remove()}>
        <img src={removeIcon}/>
      </button>
    );
  }
}
