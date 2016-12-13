import React, { Component, PropTypes } from 'react';

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
      <div>
        {this.props.children}
      </div>
    );
  }

}

export default Application;
