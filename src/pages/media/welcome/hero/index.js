import Radium from 'radium';
import React, { Component, PropTypes } from 'react';
import { Link } from 'react-scroll';
import Header from '../../../app/header';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { buttonStyles } from '../../../_common/styles';
import { menuSelector } from '../selectors';
import * as globalActions from '../../../../actions/global';

const backgroundImage = require('./background.jpg');

@connect(menuSelector, (dispatch) => ({
  routerPushWithReturnTo: bindActionCreators(globalActions.routerPushWithReturnTo, dispatch)
}))
@Radium
export default class Hero extends Component {

  static propTypes={
    currentLocation: PropTypes.object.isRequired,
    isAuthenticated: PropTypes.bool,
    routerPushWithReturnTo: PropTypes.func.isRequired
  }
  constructor (props) {
    super(props);
    this._updateHeight = ::this._updateHeight;
    this.goToLogin = ::this.goToLogin;
  }

  componentDidMount () {
    this._updateHeight();
  }

  goToLogin () {
    this.props.routerPushWithReturnTo('/login');
  }

  _updateHeight () {
    this.hero.style.height = `${Math.round(window.innerHeight * 0.8)}px`;
  }

  static styles = {
    container: {
      backgroundImage: `url('${backgroundImage}')`,
      backgroundSize: 'cover',
      display: 'flex',
      flexDirection: 'column',
      left: 0,
      minHeight: 600,
      width: '100%'
    },
    body: {
      div: {
        alignItems: 'center',
        color: 'white',
        display: 'flex',
        flex: '1 0',
        fontFamily: 'Rubik-Light',
        paddingLeft: 90,
        paddingRight: 60,
        position: 'relative'
      },
      quote: {
        color: 'rgb(86, 88, 89)',
        fontFamily: 'Arial, Helvetica, sans-serif',
        fontStyle: 'italic',
        position: 'absolute',
        bottom: 30,
        right: 40,
        fontSize: 12
      },
      title: {
        fontSize: 54,
        marginBottom: 10,
        '@media only screen and (max-width: 640px)': {
          fontSize: 40
        }
      },
      subtitle: {
        fontSize: 22,
        marginBottom: 60
      },
      subtitleUnderline: {
        textDecoration: 'underline',
        cursor: 'pointer'
      }
    }
  }

  render () {
    const { styles } = this.constructor;
    const { isAuthenticated } = this.props;
    return (
      <div ref={(x) => { this.hero = x; }} style={styles.container}>
        <Header currentLocation={this.props.currentLocation}/>

        {/* Page body */}
        <div style={styles.body.div}>
          <div>
            <div style={styles.body.title}>
              We make video content shoppable
            </div>
            <div style={styles.body.subtitle}>
              {!isAuthenticated && <div><span style={styles.body.subtitleUnderline} onClick={this.goToLogin}>Sign in</span>, upload your video and we make it interactive</div>}
              {isAuthenticated && <div>Upload your video and we make it interactive</div>}
            </div>
            <div>
              {/* TODO: should be a button "request access", but temporarily replaced by "contact us" link */}
              <Link duration={500} offset={50} smooth spy to='contact'>
                <button style={[ buttonStyles.base, buttonStyles.first, buttonStyles.blue, buttonStyles.large ]}>Contact Us</button>
              </Link>
            </div>
          </div>
          {/* Quote at the bottom-right */}
          <div style={styles.body.quote}>
            — De keuken van Sofie, Medialaan 2016
          </div>
        </div>

      </div>
    );
  }

}
