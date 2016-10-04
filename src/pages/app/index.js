import React, { Component, PropTypes } from 'react';
import { StyleRoot } from 'radium';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from './actions';
import { init, pageView } from './googleAnalytics';
import { appSelector } from './selectors';

// Require application-global stylesheets
require('./reset.css');
require('./fonts.css');
require('./global.css');

const modals = {
  '/resetpassword': 'resetPassword',
  '/forgotpassword': 'forgotPassword',
  '/login': 'login'
};

/**
 * Wrapper component, containing the DOM tree of the entire application.
 */
// TODO: integrate google analytics?
@connect(appSelector, (dispatch) => ({
  forgotPassword: bindActionCreators(actions.forgotPassword, dispatch),
  login: bindActionCreators(actions.login, dispatch),
  resetPassword: bindActionCreators(actions.resetPassword, dispatch)
}))
class Application extends Component {

  static propTypes = {
    children: PropTypes.node.isRequired,
    currentModal: PropTypes.string,
    forgotPassword: PropTypes.func.isRequired,
    location: PropTypes.shape({
      pathname: PropTypes.string.isRequired,
      query: PropTypes.shape({
        token: PropTypes.string
      }).isRequired,
      state: PropTypes.object
    }).isRequired,
    login: PropTypes.func.isRequired,
    resetPassword: PropTypes.func.isRequired,
    route: PropTypes.shape({
      path: PropTypes.string
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
    const { currentModal: forgotPassword, location: { pathname, query }, login, resetPassword } = this.props;
    return (
      <StyleRoot>
        {this.props.children}
      </StyleRoot>
    );
  }

}

export default Application;
