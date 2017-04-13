import React, { Component } from 'react';
import * as PropTypes from 'prop-types';
import Radium from 'radium';

@Radium
export default class DropDownItem extends Component {

  static propTypes = {
    children: PropTypes.node.isRequired,
    style: PropTypes.oneOfType([
      PropTypes.array,
      PropTypes.object
    ]),
    onClick: PropTypes.func
  };

  static defaultProps = {
    onClick () {}
  };

  constructor (props) {
    super(props);
    this.handleClick = ::this.handleClick;
  }

  handleClick (e) {
    e.preventDefault();
    this.props.onClick();
  }

  render () {
    return (
      <div
        style={this.props.style}
        onClick={this.handleClick}>{this.props.children}</div>
    );
  }

}
