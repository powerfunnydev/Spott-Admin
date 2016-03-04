import Radium from 'radium';
import React, { Component, PropTypes } from 'react';
import { Link } from 'react-scroll';
import { buttonStyles } from '../../_common/styles';

@Radium
export default class Menu extends Component {

  static propTypes = {
    neutral: PropTypes.bool,
    onOpenLoginModal: PropTypes.func.isRequired
  };

  constructor (props) {
    super(props);
    this.onSignInClick = ::this.onSignInClick;
  }

  onSignInClick (e) {
    e.preventDefault();
    this.props.onOpenLoginModal();
  }

  static styles = {
    linkButton: {
      color: 'rgb(135, 141, 143)',
      fontFamily: 'Rubik-Medium',
      textTransform: 'uppercase'
    },
    hideWhenNecessary: {
      '@media only screen and (max-width: 740px)': {
        display: 'none'
      }
    }
    /*
    signOutButton: {
      color: 'rgb(135, 141, 143)',
      textTransform: 'uppercase'
    }
    */
  };

  /* TODO: temporarily removed, add when login system is being implemented
   <button style={[ buttonStyles.base, buttonStyles.extraSmall, styles.header.signOutButton ]}>Sign Out</button>*/
  render () {
    const { neutral } = this.props;
    const { styles } = this.constructor;
    return (
      <div>
        <span style={styles.hideWhenNecessary}>
          <Link duration={500} offset={50} smooth spy to='about'>
            <button key='about' style={[ buttonStyles.base, buttonStyles.extraSmall, styles.linkButton ]}>About</button>
          </Link>
        </span>
        <span style={styles.hideWhenNecessary}>
          <Link duration={500} offset={50} smooth spy to='forWho'>
            <button key='forWho' style={[ buttonStyles.base, buttonStyles.extraSmall, styles.linkButton ]}>Clients</button>
          </Link>
        </span>
        {/* TODO: Whitepapers temporarily removed */}
        <span style={styles.hideWhenNecessary}>
          <Link duration={500} offset={50} smooth spy to='howItWorks'>
            <button key='howItWorks' style={[ buttonStyles.base, buttonStyles.extraSmall, styles.linkButton ]}>Product</button>
          </Link>
        </span>
        <span style={styles.hideWhenNecessary}>
          <Link duration={500} offset={50} smooth spy to='contact'>
            <button key='contact' style={[ buttonStyles.base, buttonStyles.extraSmall, styles.linkButton ]}>Contact</button>
          </Link>
        </span>
        <button key='signIn' style={[ buttonStyles.base, buttonStyles.extraSmall, neutral ? styles.linkButton : buttonStyles.pink ]} onClick={this.onSignInClick}>Sign In</button>
      </div>
    );
  }

}
