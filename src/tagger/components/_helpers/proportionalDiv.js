import React, { Component, PropTypes } from 'react';

class ProportionalDiv extends Component {

  static propTypes = {
    aspectRatio: PropTypes.number.isRequired,
    children: PropTypes.node,
    style: PropTypes.object
  };

  constructor (props) {
    super(props);
    this._updateHeight = ::this._updateHeight;
  }

  componentDidMount () {
    window.addEventListener('resize', this._updateHeight);
    this._updateHeight();
  }
  componentDidUpdate () {
    this._updateHeight();
  }
  componentWillUnmount () {
    window.removeEventListener('resize', this._updateHeight);
  }

  _updateHeight () {
    this.myElement.style.height = `${this.myElement.offsetWidth * this.props.aspectRatio}px`;
  }

  render () {
    return (
      <div ref={(myElement) => { this.myElement = myElement; }}
        style={this.props.style}>
        {this.props.children}
      </div>
    );
  }

}

export default ProportionalDiv;
