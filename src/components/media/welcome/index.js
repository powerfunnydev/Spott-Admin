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
import Login from '../login';
import * as globalActions from '../../../actions/global';
import { welcomeSelector } from '../../../selectors/global';

@Radium
@connect(welcomeSelector, (dispatch) => ({
  closeModal: bindActionCreators(globalActions.closeModal, dispatch),
  openLoginModal: bindActionCreators(globalActions.openLoginModal, dispatch)
}))
export default class Welcome extends Component {

  static propTypes = {
    closeModal: PropTypes.func.isRequired,
    currentModal: PropTypes.string,
    openLoginModal: PropTypes.func.isRequired
  }

  constructor (props) {
    super(props);
  }

  render () {
    const { closeModal, currentModal, openLoginModal } = this.props;

    return (
      <div style={{ minWidth: 350 }}>
        {currentModal === 'login' &&
          <Login onCancel={closeModal} onSubmit={closeModal} />}
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
