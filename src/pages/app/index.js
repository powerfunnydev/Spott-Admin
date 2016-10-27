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
export default class Application extends Component {

  static propTypes = {
    children: PropTypes.node.isRequired,
    location: PropTypes.shape({
      pathname: PropTypes.string.isRequired
    }).isRequired
  };

  constructor (props) {
    super(props);
  }
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
      <StyleRoot style={{ height: '100%' }}>
        {this.props.children}
      </StyleRoot>
    );
  }

}
