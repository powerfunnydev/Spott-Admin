import React, { Component } from 'react';
import Radium from 'radium';
import { Link } from 'react-router';
import { colors, fontWeights, makeTextStyle, Container } from '../../_common/styles';

@Radium
export default class Reporting extends Component {

  static propTypes = {
  };

  constructor (props) {
    super(props);
  }

  static styles = {
    tabs: {
      borderBottomWidth: 1,
      borderBottomStyle: 'solid',
      borderBottomColor: colors.lightGray2
    },
    tab: {
      container: {
        display: 'inline-block',
        paddingRight: '2em'
      },
      base: {
        ...makeTextStyle(fontWeights.regular, '0.875em'),
        color: colors.black,
        opacity: 0.5,
        paddingBottom: '1.5em',
        paddingTop: '1.5em',
        textDecoration: 'none',
        textAlign: 'center',
        display: 'inline-block',
        borderBottomWidth: 2,
        borderBottomStyle: 'solid',
        borderBottomColor: 'transparent',
        marginBottom: -1
      },
      active: {
        borderBottomColor: colors.primaryBlue,
        opacity: 1
      }
    },
    mediaFilterForm: {
      float: 'right',
      width: '50%'
    },
    wrapper: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-end'
    }
  };

  render () {
    const styles = this.constructor.styles;

    return (
      <div style={{ backgroundColor: '#FFFFFF' }}>
        <div style={styles.tabs}>
          <Container style={styles.wrapper}>
            <div>
              <div style={styles.tab.container}>
                <Link activeStyle={styles.tab.active} style={styles.tab.base} to='/content/content-producers'>Content producers</Link>
              </div>
              <div style={styles.tab.container}>
                <Link activeStyle={styles.tab.active} style={styles.tab.base} to='/content/broadcasters'>Broadcasters</Link>
              </div>
              <div style={styles.tab.container}>
                <Link activeStyle={styles.tab.active} style={styles.tab.base} to='/content/series'>Series</Link>
              </div>
              {/* <div style={styles.tab.container}>
                <Link activeStyle={styles.tab.active} style={styles.tab.base} to='/content/commercials'>Commercials</Link>
              </div> */}
              <div style={styles.tab.container}>
                <Link activeStyle={styles.tab.active} style={styles.tab.base} to='/content/characters'>Characters</Link>
              </div>
              <div style={styles.tab.container}>
                <Link activeStyle={styles.tab.active} style={styles.tab.base} to='/content/persons'>People</Link>
              </div>
              <div style={styles.tab.container}>
                <Link activeStyle={styles.tab.active} style={styles.tab.base} to='/content/movies'>Movies</Link>
              </div>
            </div>
          </Container>
        </div>
      </div>
    );
  }
}
