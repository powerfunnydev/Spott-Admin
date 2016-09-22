import React, { Component, PropTypes } from 'react';
import Radium from 'radium';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Link } from 'react-router';
import Header from '../app/header';
import { colors, fontWeights, makeTextStyle, mediaQueries, Container } from '../_common/styles';
import MediaFilterForm from './forms/mediaFilterForm';
import * as actions from './actions';

@connect(null, (dispatch) => ({
  loadActivities: bindActionCreators(actions.loadActivities, dispatch)
}))
@Radium
export default class Reporting extends Component {

  static propTypes = {
    children: PropTypes.node.isRequired,
    loadActivities: PropTypes.func.isRequired
  };

  static styles = {
    header: {
      backgroundColor: colors.black
    },
    tabs: {
      borderBottomWidth: 1,
      borderBottomStyle: 'solid',
      borderBottomColor: colors.lightGray2
    },
    tab: {
      container: {
        display: 'inline-block',
        paddingRight: '3em'
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
    }
  };

  render () {
    const styles = this.constructor.styles;
    const { children, loadActivities } = this.props;
    return (
      <div>
        <div style={styles.header}>
          <Header />
        </div>
        <div style={styles.tabs}>
          <Container>
            <div style={styles.tab.container}>
              <Link activeStyle={styles.tab.active} style={styles.tab.base} to='/reporting/activity'>Activity</Link>
            </div>
            <div style={styles.tab.container}>
              <Link activeStyle={styles.tab.active} style={styles.tab.base} to='/reporting/rankings'>Rankings</Link>
            </div>
            <MediaFilterForm style={styles.mediaFilterForm} onChange={() => this.props.loadActivities()} />
          </Container>
        </div>
        {children}
      </div>
    );
  }
}
