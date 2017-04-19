import PerfectScrollbar from 'perfect-scrollbar';
import Radium from 'radium';
import React, { Component } from 'react';
import * as PropTypes from 'prop-types';
import { findDOMNode } from 'react-dom';

require('./style.css');

/**
 * Wrapper around the rather minimal perfect-scrollbar library, which can be found at
 * https://noraesae.github.io/perfect-scrollbar/.
 */
@Radium
class Application extends Component {

  static propTypes = {
    children: PropTypes.node.isRequired,
    style: PropTypes.object,
    onScroll: PropTypes.func
  };

  constructor (props) {
    super(props);
    this.onScroll = ::this.onScroll;
    this.updateScrollbar = ::this.updateScrollbar;
  }

  componentDidMount () {
    // Create a new scrollbar instance for this component's root node.
    PerfectScrollbar.initialize(findDOMNode(this), {
      minScrollbarLength: 20
    });
    // The scrollbar is made only for fixed-size containers with fixed-size content.
    // Upon window resize, we have to recalculate scrollbar positions and sizes.
    // For this reason we install a global onResize hook.
    window.addEventListener('resize', this.updateScrollbar);
  }
  componentDidUpdate () {
    // The size of the content may have been changes, and thus a recalculation
    // of scrollbar positions and sizes is necessary.
    this.updateScrollbar();
  }
  componentWillUnmount () {
    // Unsubscribe to window resizes
    window.removeEventListener('resize', this.updateScrollbar);
    // Destroy the underlying scrollbar, freeing any resources.
    PerfectScrollbar.destroy(findDOMNode(this));
  }

  updateScrollbar () {
    // Recalculate scrollbar positions and sizes.
    PerfectScrollbar.update(findDOMNode(this));
  }

  /**
   * Public accessor.
   */
  getScrollTop () {
    const myDomNode = findDOMNode(this);
    return (myDomNode && myDomNode.scrollTop) || 0;
  }

  /**
   * Public accessor.
   */
  getClientHeight () {
    const myDomNode = findDOMNode(this);
    return (myDomNode && myDomNode.clientHeight) || 0;
  }

  onScroll () {
    if (this.props.onScroll) {
      this.props.onScroll();
    }
  }

  render () {
    return (
      <div style={[ { position: 'relative' }, this.props.style ]} onScroll={this.onScroll}>
        {this.props.children}
      </div>
    );
  }

}

export default Application;
