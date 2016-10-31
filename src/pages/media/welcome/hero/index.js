import Radium from 'radium';
import React, { Component, PropTypes } from 'react';
import { Link } from 'react-scroll';
import Header from '../../../app/header';
import { buttonStyles } from '../../../_common/styles';

const backgroundImage = require('./background.jpg');

@Radium
export default class Hero extends Component {

  static propTypes={
    currentLocation: PropTypes.object.isRequired
  }
  constructor (props) {
    super(props);
    this._updateHeight = ::this._updateHeight;
  }

  componentDidMount () {
    this._updateHeight();
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
        textDecoration: 'underline'
      }
    }
  }

  render () {
    const { styles } = this.constructor;

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
              <span style={styles.body.subtitleUnderline}>Sign in</span>, upload your video and we make it interactive
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
