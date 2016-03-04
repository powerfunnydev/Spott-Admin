import React, { Component, PropTypes } from 'react';
import { StyleRoot } from 'radium';

// Require application-global stylesheets
require('./reset.css');
require('./fonts.css');
require('./global.css');

/**
 * Wrapper component, containing the DOM tree of the entire application.
 */
class Application extends Component {

  static propTypes = {
    children: PropTypes.node.isRequired
  };

  render () {
    return (
      <StyleRoot>
        {this.props.children}
      </StyleRoot>
    );
  }

}

export default Application;
