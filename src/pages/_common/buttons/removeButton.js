import React, { Component, PropTypes } from 'react';
import Radium from 'radium';
import { confirmation } from '../../_common/askConfirmation';

const removeIcon = require('../../../assets/images/garbage.svg');

@Radium
export default class RemoveButton extends Component {
  static propTypes = {
    style: PropTypes.object,
    text: PropTypes.string,
    onClick: PropTypes.func.isRequired
  }

  constructor (props) {
    super(props);
    this.remove = :: this.remove;
  }

  async remove () {
    const result = await confirmation();
    if (result) {
      await this.props.onClick();
    }
  }

  render () {
    const { style, text } = this.props;
    return (

      <button style={style} onClick={() => { this.remove(); }} ><span><img src={removeIcon}/></span>{text}</button>
    );
  }
}
