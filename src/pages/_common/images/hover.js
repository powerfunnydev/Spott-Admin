/* eslint-disable react/no-set-state */
import React, { Component, PropTypes } from 'react';
import Radium from 'radium';

@Radium
export default class Hover extends Component {

  static propTypes = {
    color: PropTypes.string,
    hoverColor: PropTypes.string,
    renderSVG: PropTypes.func.isRequired,
    style: PropTypes.object
  };

  constructor (props) {
    super(props);
    this.state = { hover: false };
  }

  static styles = {
    container: {
      display: 'inline-flex'
    }
  };

  render () {
    const styles = this.constructor.styles;
    const { style, color, hoverColor, renderSVG } = this.props;
    return (
      <div
        style={styles.container}
        onMouseEnter={() => { this.setState({ hover: true }); }}
        onMouseLeave={() => { this.setState({ hover: false }); }}>
       {renderSVG(this.state.hover ? hoverColor || color : color, style)}
      </div>
    );
  }
}
