import React, { Component, PropTypes } from 'react';
import Radium from 'radium';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Link as ReactRouterLink, withRouter } from 'react-router';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import ImmutablePropTypes from 'react-immutable-proptypes';
import ApptvateLogoSVG from '../../_common/images/apptvateLogo';
import { colors, makeTextStyle, fontWeights, buttonStyles } from '../../_common/styles';
import { menuSelector } from '../selectors';
import * as globalActions from '../../../actions/global';
import * as actions from '../../../actions/user';
import { ADMIN, BROADCASTER, CONTENT_MANAGER } from '../../../constants/userRoles';

require('./style.css');
const Link = Radium(ReactRouterLink);

function mergeStyles (array) {
  let styles = {};
  for (const style of array) {
    if (style) {
      styles = { ...styles, ...style };
    }
  }
  return styles;
}

@connect(menuSelector, (dispatch) => ({
  logout: bindActionCreators(actions.logout, dispatch),
  routerPushWithReturnTo: bindActionCreators(globalActions.routerPushWithReturnTo, dispatch)
}))
@Radium
class VerticalSideMenu extends Component {
  static propTypes = {
    children: PropTypes.object,
    isAuthenticated: PropTypes.bool.isRequired,
    location: PropTypes.object.isRequired,
    logout: PropTypes.func.isRequired,
    routerPushWithReturnTo: PropTypes.func.isRequired,
    userRoles: ImmutablePropTypes.list
  }

  constructor (props) {
    super(props);
    this.isMedia = ::this.isMedia;
    this.onSignInClick = ::this.onSignInClick;
    this.onLogOutClick = ::this.onLogOutClick;
  }

  checkUrl (urls) {
    const { location: { pathname } } = this.props;
    for (const medium of urls) {
      if (pathname.indexOf(medium) !== -1) {
        return true;
      }
    }
    return null;
  }

  isBroadcaster () {
    return this.checkUrl([ '/content/broadcasters', '/content/broadcast-channels' ]);
  }

  isMedia () {
    return this.checkUrl([ '/content/series', '/content/seasons', '/content/episodes', '/content/movies' ]);
  }

  isPeople () {
    return this.checkUrl([ '/content/persons', '/content/characters' ]);
  }

  onSignInClick (e) {
    e.preventDefault();
    this.props.routerPushWithReturnTo('/login');
  }

  async onLogOutClick (e) {
    e.preventDefault();
    await this.props.logout();
    await this.props.routerPushWithReturnTo('/');
  }

  static styles = {
    sideMenu: {
      backgroundColor: colors.black2,
      minWidth: '200px',
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      position: 'fixed',
      overflow: 'auto'
    },
    paddingLogo: {
      paddingTop: '5px',
      paddingBottom: '5px',
      paddingLeft: '24px',
      paddingRight: '24px'
    },
    seperator: {
      minHeight: '24px'
    },
    section: {
      paddingLeft: '24px',
      paddingRight: '24px',
      minHeight: '24px',
      display: 'flex',
      alignItems: 'center',
      textDecoration: 'none',
      ':hover': {
        backgroundColor: '#19262B'
      }
    },
    sectionTitle: {
      color: colors.lightGray3,
      ...makeTextStyle(fontWeights.medium, '11px', '0.4px')
    },
    sectionActive: {
      color: colors.white,
      backgroundColor: '#19262B'
    },
    category: {
      paddingLeft: '24px',
      paddingRight: '24px',
      minHeight: '24px',
      display: 'flex',
      alignItems: 'center'
    },
    categoryTitle: {
      color: colors.darkGray3,
      ...makeTextStyle(fontWeights.regular, '10px', '1px')
    },
    line: {
      minHeight: '1px',
      backgroundColor: colors.veryDarkGray
    },
    logo: {
      width: '130px',
      height: '54px'
    },
    logoContainer: {
      display: 'inline-flex'
    },
    subSection: {
      paddingLeft: '40px'
    },
    subSectionTitle: {
      color: colors.darkGray2,
      ...makeTextStyle(fontWeights.regular, '11px', '0.4px')
    },
    subSectionActive: {
      color: colors.veryLightGray
    },
    dropdownOpen: {
      backgroundColor: '#132226'
    },
    fullHeight: {
      height: '100%'
    },
    content: {
      width: 'auto',
      marginLeft: '200px',
      height: '100%', // !!! By using this field, we can't use ScrollLink anymore (will not work).
                      // So don't use this in combination of react-scroll.
      overflow: 'auto'
    },
    noMarginLeft: {
      marginLeft: 0
    }
  }

  render () {
    const { styles } = this.constructor;
    const { isAuthenticated, userRoles } = this.props;
    return (
      <div style={styles.fullHeight}>
        <div style={styles.sideMenu}>
          <div style={styles.paddingLogo}>
            <Link style={styles.logoContainer} to='/'>
              <ApptvateLogoSVG style={styles.logo}/>
            </Link>
          </div>
          <div style={styles.line}/>
          <div style={styles.seperator}/>
          {isAuthenticated && (userRoles.includes(ADMIN)) &&
            <div>
              <div style={styles.category}>
                <div style={styles.categoryTitle}>GENERAL</div>
              </div>
              <Link activeStyle={styles.sectionActive} key='users' onlyActiveOnIndex style={styles.section} to='/users'>
                <div style={styles.sectionTitle}>USERS</div>
              </Link>
              <div style={styles.seperator}/>
            </div>
          }
          {isAuthenticated && (userRoles.includes(ADMIN) || userRoles.includes(CONTENT_MANAGER)) &&
          <div>
            <div style={styles.category}>
              <div style={styles.categoryTitle}>CONTENT</div>
            </div>
            <Link key='media' style={mergeStyles([ styles.section, styles.sectionTitle, this.isMedia() && styles.sectionActive ])} to='/content/series'>
              MEDIA
            </Link>
            <ReactCSSTransitionGroup
              transitionEnterTimeout={1000}
              transitionLeaveTimeout={1000}
              transitionName='dropdown'>
              { // Show dropdown
                this.isMedia() &&
                  <div key='mediaDropdown' style={styles.dropdownOpen}>
                    <Link activeStyle={styles.subSectionActive} key='series' style={mergeStyles([ styles.section, styles.subSectionTitle, styles.subSection ])} to='/content/series'>
                      Series
                    </Link>
                    <Link activeStyle={styles.subSectionActive} key='movies' style={mergeStyles([ styles.section, styles.subSectionTitle, styles.subSection ])} to='/content/movies'>
                      Movies
                    </Link>
                  </div>
              }
            </ReactCSSTransitionGroup>
            <Link activeStyle={styles.sectionActive} key='persons' onlyActiveOnIndex style={styles.section} to='/content/persons'>
              <div style={styles.sectionTitle}>PEOPLE</div>
            </Link>
            <ReactCSSTransitionGroup
              transitionEnterTimeout={1000}
              transitionLeaveTimeout={1000}
              transitionName='dropdown'>
              { // Show dropdown
                this.isPeople() &&
                  <div key='mediaDropdown' style={styles.dropdownOpen}>
                    <Link activeStyle={styles.subSectionActive} key='persons' style={mergeStyles([ styles.section, styles.subSectionTitle, styles.subSection ])} to='/content/persons'>
                      People
                    </Link>
                    <Link activeStyle={styles.subSectionActive} key='characters' style={mergeStyles([ styles.section, styles.subSectionTitle, styles.subSection ])} to='/content/characters'>
                      Characters
                    </Link>
                  </div>
              }
            </ReactCSSTransitionGroup>
            <Link activeStyle={styles.sectionActive} key='contentProducers' onlyActiveOnIndex style={styles.section} to='/content/content-producers'>
              <div style={styles.sectionTitle}>CONTENT PRODUCERS</div>
            </Link>
            <Link activeStyle={styles.sectionActive} key='broadcasters' onlyActiveOnIndex style={styles.section} to='/content/broadcasters'>
              <div style={styles.sectionTitle}>BROADCASTERS</div>
            </Link>
            <ReactCSSTransitionGroup
              transitionEnterTimeout={1000}
              transitionLeaveTimeout={1000}
              transitionName='dropdown'>
              { // Show dropdown
                this.isBroadcaster() &&
                  <div key='broadcasterDropdown' style={styles.dropdownOpen}>
                    <Link activeStyle={styles.subSectionActive} key='broadcasters' style={mergeStyles([ styles.section, styles.subSectionTitle, styles.subSection ])} to='/content/broadcasters'>
                      Broadcasters
                    </Link>
                    <Link activeStyle={styles.subSectionActive} key='broadcastChannels' style={mergeStyles([ styles.section, styles.subSectionTitle, styles.subSection ])} to='/content/broadcast-channels'>
                      Broadcast channels
                    </Link>
                  </div>
              }
            </ReactCSSTransitionGroup>
            <div style={styles.seperator}/>
          </div>}
          {isAuthenticated && (userRoles.includes(ADMIN) || userRoles.includes(CONTENT_MANAGER)) &&
            <div>
              <div style={styles.category}>
                <div style={styles.categoryTitle}>PRODUCTS</div>
              </div>
              <Link activeStyle={styles.sectionActive} key='brands' style={styles.section} to='/content/brands'>
                <div style={styles.sectionTitle}>BRANDS</div>
              </Link>
              <div style={styles.seperator}/>
            </div>
          }
          {isAuthenticated && (userRoles.includes(ADMIN) || userRoles.includes(CONTENT_MANAGER)) &&
            <div>
              <div style={styles.category}>
                <div style={styles.categoryTitle}>PUBLISHING</div>
              </div>
              <Link activeStyle={styles.sectionActive} key='tvGuide' style={styles.section} to='/tv-guide'>
                <div style={styles.sectionTitle}>TV-GUIDE</div>
              </Link>
              <div style={styles.seperator}/>
            </div>
          }
          {isAuthenticated && (userRoles.includes(ADMIN) || userRoles.includes(CONTENT_MANAGER) || userRoles.includes(BROADCASTER)) &&
            <div>
              <div style={styles.category}>
                <div style={styles.categoryTitle}>REPORTING</div>
              </div>
              <Link activeStyle={styles.sectionActive} key='activity' style={styles.section} to='/reporting/activity'>
                <div style={styles.sectionTitle}>ACTIVITY</div>
              </Link>
              <Link activeStyle={styles.sectionActive} key='rankings' style={styles.section} to='/reporting/rankings'>
                <div style={styles.sectionTitle}>RANKINGS</div>
              </Link>
            </div>
          }
          <div style={styles.seperator}/>
          {isAuthenticated
            ? <button key='logout' style={[ buttonStyles.base, buttonStyles.extraSmall, buttonStyles.pink, styles.noMarginLeft ]} onClick={this.onLogOutClick}>Logout</button>
            : <button key='signIn' style={[ buttonStyles.base, buttonStyles.extraSmall, buttonStyles.pink, styles.noMarginLeft ]} onClick={this.onSignInClick}>Login</button>}
        </div>
        <div style={styles.content}>
          {this.props.children}
        </div>
      </div>
    );
  }
}
export const SideMenu = withRouter(VerticalSideMenu);
