import React, { Component, PropTypes } from 'react';
import Radium from 'radium';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Link } from 'react-router';
import moment from 'moment';
import { reduxForm, Field } from 'redux-form/immutable';
import Header from '../app/header';
import DateInput from '../_common/inputs/dateInput';
import { colors, fontWeights, makeTextStyle, Container } from '../_common/styles';
import * as actions from './actions';
import selector from './selector';

@connect(selector, (dispatch) => ({
  searchSeries: bindActionCreators(actions.searchSeries, dispatch)
}))
@reduxForm({
  form: 'reportingDateRange',
  initialValues: {
    fromDate: moment().startOf('day').subtract(1, 'months').date(1).toDate(),
    toDate: moment().toDate()
  }
})
@Radium
class DateRangeForm extends Component {

  static propTypes = {
    children: PropTypes.node.isRequired,
    style: PropTypes.object
  };

  static styles = {
    dateInput: {
      width: '6em'
    },
    separator: {
      paddingTop: 11.25
    }
  };

  render () {
    const styles = this.constructor.styles;
    return (
      <form style={this.props.style}>
        <Field
          component={DateInput}
          name='fromDate'
          placeholder={'reporting.activity.dateFrom'}
          style={styles.dateInput}
          onChange={(e) => console.warn('UPDATE', e)} />
        <div style={styles.separator}>&nbsp;-&nbsp;</div>
        <Field
          component={DateInput}
          name='toDate'
          placeholder={'reporting.activity.dateTo'}
          style={styles.dateInput}
          onChange={(e) => console.warn('UPDATE', e)} />
      </form>
    );
  }
}

@Radium
export default class Reporting extends Component {

  static propTypes = {
    children: PropTypes.node.isRequired
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
    dateRangeForm: {
      alignItems: 'center',
      display: 'flex',
      float: 'right'
    }
  };

  render () {
    const styles = this.constructor.styles;
    const { children } = this.props;
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
            <DateRangeForm style={styles.dateRangeForm} />
          </Container>
        </div>
        {children}
      </div>
    );
  }
}
