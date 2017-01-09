import React, { Component, PropTypes } from 'react';
import Radium from 'radium';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import selector from './selector';
import { Container, colors, fontWeights, makeTextStyle } from '../../_common/styles';
import { routerPushWithReturnTo } from '../../../actions/global';
import Line from '../../_common/components/line';
import Dropdown, { styles as dropdownStyles } from '../../_common/components/actionDropdown';
import * as userActions from '../../../actions/user';

@connect(selector, (dispatch) => ({
  logout: bindActionCreators(userActions.logout, dispatch),
  routerPushWithReturnTo: bindActionCreators(routerPushWithReturnTo, dispatch)
}))
@Radium
export default class Header extends Component {
  static propTypes = {
    hierarchy: PropTypes.array,
    routerPushWithReturnTo: PropTypes.func.isRequired,
    username: PropTypes.string
  }

  constructor (props) {
    super(props);
    this.onLogOutClick = ::this.onLogOutClick;
  }

  async onLogOutClick (e) {
    e.preventDefault();
    await this.props.logout();
    await this.props.routerPushWithReturnTo('/');
  }

  static styles = {
    container: {
      ...makeTextStyle(fontWeights.regular, '17px'),
      color: colors.lightGray3,
      backgroundColor: colors.white,
      height: '69px'
    },
    clickable: {
      cursor: 'pointer'
    },
    last: {
      color: colors.veryDarkGray
    },
    row: {
      display: 'flex',
      alignItems: 'center',
      height: '100%',
      width: '100%',
      flexDirection: 'row'
    },
    userInformation: {
      ...makeTextStyle(fontWeights.medium, '13px'),
      paddingLeft: '20px',
      paddingRight: '10px',
      color: colors.black2,
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      marginLeft: 'auto',
      borderLeft: `1px solid ${colors.veryLightGray}`
    },
    noBorder: {
      borderTop: 'none',
      borderLeft: 'none',
      borderRight: 'none',
      borderBottom: 'none',
      ':hover': {
        borderTop: 'none',
        borderLeft: 'none',
        borderRight: 'none',
        borderBottom: 'none'
      },
      ':active': {
        backgroundColor: 'transparent'
      }
    }
  }

  render () {
    const { hierarchy, username } = this.props;
    const { styles } = this.constructor;
    return (
      <div>
        <Container style={styles.container}>
          <div style={styles.row}>
            <div style={styles.row}>
              {hierarchy && hierarchy.map((obj, index) => {
                return <div key={index} style={[ (index === (hierarchy.length - 1)) && styles.last, styles.clickable ]} onClick={() => { obj.url && this.props.routerPushWithReturnTo(obj.url); }}>{obj.title}{(index !== (hierarchy.length - 1)) && ' /\u00a0'}</div>;
              })}
            </div>
            <div style={styles.userInformation}>
              {username}
            </div>
            <Dropdown arrowStyle={styles.noBorder}>
              <div key='logout' style={dropdownStyles.floatOption} onClick={this.onLogOutClick}>Logout</div>
            </Dropdown>
          </div>
        </Container>
        <Line/>
      </div>
    );
  }
}
