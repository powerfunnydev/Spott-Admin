import React, { Component, PropTypes } from 'react';
import { StyleRoot } from 'radium';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as globalActions from '../../actions/global';
import * as actions from './actions';
import { init, pageView } from './googleAnalytics';
import LoginModal from '../login';
import ForgotPasswordModal from '../forgotPassword';
import ResetPasswordModal from '../resetPassword';
import { appSelector } from './selectors';

// Require application-global stylesheets
require('./reset.css');
require('./fonts.css');
require('./global.css');

/**
 * Wrapper component, containing the DOM tree of the entire application.
 */
// TODO: integrate google analytics?
@connect(appSelector, (dispatch) => ({
  closeModal: bindActionCreators(globalActions.closeModal, dispatch),
  forgotPassword: bindActionCreators(actions.forgotPassword, dispatch),
  login: bindActionCreators(actions.login, dispatch),
  resetPassword: bindActionCreators(actions.resetPassword, dispatch)
}))
class Application extends Component {

  static propTypes = {
    children: PropTypes.node.isRequired,
    closeModal: PropTypes.func.isRequired,
    currentModal: PropTypes.string,
    forgotPassword: PropTypes.func.isRequired,
    location: PropTypes.shape({
      pathname: PropTypes.string.isRequired,
      query: PropTypes.shape({
        token: PropTypes.string
      }).isRequired
    }).isRequired,
    login: PropTypes.func.isRequired,
    resetPassword: PropTypes.func.isRequired,
    route: PropTypes.shape({
      path: PropTypes.string
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
    const { closeModal, currentModal: modal, forgotPassword, location: { query }, login, resetPassword, route } = this.props;
    const currentModal = route.path === 'reset-password' ? 'resetPassword' : modal;
    return (
      <StyleRoot>
        {currentModal === 'login' &&
          <LoginModal onCancel={closeModal} onSubmit={login} />}
        {currentModal === 'forgotPassword' &&
          <ForgotPasswordModal onCancel={closeModal} onSubmit={forgotPassword} />}
        {currentModal === 'resetPassword' &&
          <ResetPasswordModal initialValues={{ token: query.token }} onCancel={closeModal} onSubmit={resetPassword} />}
        {this.props.children}
      </StyleRoot>
    );
  }

}

export default Application;
