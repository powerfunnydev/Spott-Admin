import React, { Component, PropTypes } from 'react';
import Radium from 'radium';
import { confirmation } from '../../../_common/askConfirmation';
import PlusSVG from '../../images/plus';

const removeIcon = require('../../../../assets/images/garbage.svg');

@Radium
export default class RemoveButton extends Component {
  static propTypes = {
    color: PropTypes.string,
    cross: PropTypes.bool,
    hoverColor: PropTypes.string,
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

  static styles = {
    cross: {
      transform: 'rotate(45deg)',
      width: '12px',
      height: '12px'
    }
  }

  render () {
    const { style, cross } = this.props;
    const { styles } = this.constructor;
    return (
      <button style={style} onClick={() => this.remove()}>
        {cross && <PlusSVG color='#aab5b8' style={styles.cross}/> || <img src={removeIcon}/>}
      </button>
    );
  }
}
