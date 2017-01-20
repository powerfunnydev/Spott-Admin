import React, { Component, PropTypes } from 'react';
import { StyleRoot } from 'radium';
import HTML5Backend from 'react-dnd-html5-backend';
import { DragDropContext } from 'react-dnd';
import { init, pageView } from './googleAnalytics';
import Toast from '../_common/components/toast';

// Require application-global stylesheets
require('./reset.css');
require('./fonts.css');
require('./global.css');

/**
 * Wrapper component, containing the DOM tree of the entire application.
 */
// TODO: integrate google analytics?
@DragDropContext(HTML5Backend)
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

  static styles = {
    fullHeight: {
      height: '100%'
    },
    container: {
      width: 'auto',
      marginLeft: '200px',
      overflow: 'auto'
    }
  }

  render () {
    const { styles } = this.constructor;
    return (
      <StyleRoot key='root' style={styles.fullHeight}>
        <Toast/>
        {this.props.children}
      </StyleRoot>
    );
  }

}
