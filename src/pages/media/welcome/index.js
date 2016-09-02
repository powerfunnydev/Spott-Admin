import Radium from 'radium';
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import About from './about';
import Contact from './contact';
import Footer from './footer';
import ForWho from './forWho';
import Hero from './hero';
import HowItWorks from './howItWorks';
import Partners from './partners';
import Pricing from './pricing';
import Whitepapers from './whitepapers';
import LoginModal from '../login';
import ForgotPasswordModal from '../forgotPassword';
import ResetPasswordModal from '../resetPassword';
import * as globalActions from '../../../actions/global';
import * as actions from '../actions';
import { welcomeSelector } from '../../../selectors/global';

@Radium
@connect(welcomeSelector, (dispatch) => ({
  closeModal: bindActionCreators(globalActions.closeModal, dispatch),
  forgotPassword: bindActionCreators(actions.forgotPassword, dispatch),
  login: bindActionCreators(actions.login, dispatch),
  openLoginModal: bindActionCreators(globalActions.openLoginModal, dispatch),
  resetPassword: bindActionCreators(actions.resetPassword, dispatch)
}))
export default class Welcome extends Component {

  static propTypes = {
    closeModal: PropTypes.func.isRequired,
    currentModal: PropTypes.string,
    forgotPassword: PropTypes.func.isRequired,
    location: PropTypes.shape({
      query: PropTypes.shape({
        token: PropTypes.string
      }).isRequired
    }).isRequired,
    login: PropTypes.func.isRequired,
    openLoginModal: PropTypes.func.isRequired,
    resetPassword: PropTypes.func.isRequired,
    route: PropTypes.shape({
      path: PropTypes.string.isRequired
    }).isRequired
  };

  constructor (props) {
    super(props);
  }

  render () {
    const { closeModal, currentModal: modal, forgotPassword, location: { query: { token } }, login, openLoginModal, resetPassword, route } = this.props;
    const currentModal = route.path === 'reset-password' ? 'resetPassword' : modal;

    return (
      <div style={{ minWidth: 350 }}>
        {currentModal === 'login' &&
          <LoginModal onCancel={closeModal} onSubmit={login} />}
        {currentModal === 'forgotPassword' &&
          <ForgotPasswordModal onCancel={closeModal} onSubmit={forgotPassword} />}
        {currentModal === 'resetPassword' &&
          <ResetPasswordModal initialValues={{ token }} onCancel={closeModal} onSubmit={resetPassword} />}
        <Hero onOpenLoginModal={openLoginModal} />
        <About />
        <ForWho />
        <Partners />
        <Whitepapers />
        <HowItWorks />
        <Pricing />
        <Contact />
        <Footer onOpenLoginModal={openLoginModal} />
      </div>
    );
  }
}
