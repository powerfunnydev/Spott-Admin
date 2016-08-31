import React, { Component, PropTypes } from 'react';
import { StyleRoot } from 'radium';
import { init, pageView } from './googleAnalytics';

// Require application-global stylesheets
require('./reset.css');
require('./fonts.css');
require('./global.css');

/**
 * Wrapper component, containing the DOM tree of the entire application.
 */
// TODO: integrate google analytics?
class Application extends Component {

  static propTypes = {
    children: PropTypes.node.isRequired,
    location: PropTypes.shape({
      pathname: PropTypes.string.isRequired
    }).isRequired
  };

  componentDidMount () {
    // Initialize google analytics
    init();
    // Log initial page view
    pageView(this.props.location.pathname);
  }

  componentWillReceiveProps (nextProps) {
    const oldLocation = this.props.location;
    const nextLocation = nextProps.location;
    // Log next view if necessary
    if (nextLocation.pathname !== oldLocation.pathname) {
      pageView(nextLocation.pathname);
    }
  }

  render () {
    return (
      <StyleRoot>
        {this.props.children}
      </StyleRoot>
    );
  }

}

export default Application;
