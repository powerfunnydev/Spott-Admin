import Radium from 'radium';
import React, { Component } from 'react';
import * as PropTypes from 'prop-types';

/**
 * Component which implements the default behaviour of an appearance (product/character) on a scene, that can be hovered and selected.
 */
@Radium
export default class DefaultAppearanceBehavior extends Component {

  static propTypes = {
    children: PropTypes.node,
    connectDragSource: PropTypes.func,
    style: PropTypes.string,
    onHover: PropTypes.func.isRequired,
    onLeave: PropTypes.func.isRequired,
    onSelect: PropTypes.func.isRequired,
    onToggleSelect: PropTypes.func.isRequired
  };

  constructor (props) {
    super(props);
    this.onClick = ::this.onClick;
    this.onContextMenu = ::this.onContextMenu;
    this.onMouseEnter = ::this.onMouseEnter;
    this.onMouseLeave = ::this.onMouseLeave;
  }

  onClick (e) {
    // Prevent the click from bubbling up.
    e.stopPropagation();
    // Trigger selection.
    this.props.onToggleSelect();
  }

  onContextMenu (e) {
    // Prevent right click from bubbling up.
    e.stopPropagation();
    // Trigger selection.
    this.props.onSelect();
  }

  onMouseEnter (e) {
    e.preventDefault();
    this.props.onHover();
  }

  onMouseLeave (e) {
    e.preventDefault();
    this.props.onLeave();
  }

  render () {
    const { connectDragSource, style } = this.props;
    const comp = (
      <div style={style} onClick={this.onClick} onContextMenu={this.onContextMenu} onMouseEnter={this.onMouseEnter} onMouseLeave={this.onMouseLeave}>
        {this.props.children}
      </div>
    );
    return (connectDragSource ? connectDragSource(comp) : comp);
  }

}
