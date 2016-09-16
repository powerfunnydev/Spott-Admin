import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Link } from 'react-router';
import Highcharts from 'react-highcharts';
import ImmutablePropTypes from 'react-immutable-proptypes';
import moment from 'moment';
import { reduxForm, Field } from 'redux-form/immutable';
import Header from '../app/header';
import DateInput from '../_common/inputs/dateInput';
import SelectInput from '../_common/inputs/selectInput';
import { colors, fontWeights, makeTextStyle } from '../_common/styles';
import { FETCHING } from '../../constants/statusTypes';
import * as actions from './actions';
import selector from './selector';

const config = {
  chart: {
    polar: true
  },
  xAxis: {
    categories: [ 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec' ]
  },
  series: [ {
    data: [ 29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4 ]
  } ]
};

@connect(selector, (dispatch) => ({
  searchSeries: bindActionCreators(actions.searchSeries, dispatch)
}))
// @reduxForm({
//   form: 'reporting',
//   initialValues: {
//     fromDate: moment().startOf('day').subtract(1, 'months').date(1).toDate(),
//     toDate: moment().toDate()
//   }
// })
export default class Rankings extends Component {

  static propTypes = {
    searchSeries: PropTypes.func.isRequired,
    searchedSeriesIds: ImmutablePropTypes.map.isRequired,
    seriesById: ImmutablePropTypes.map
  };

  static styles = {
    header: {
      backgroundColor: colors.black
    },
    tab: {
      base: {
        ...makeTextStyle(fontWeights.bold, '0.75em', '0.237em'),
        color: 'white',
        opacity: 0.5,
        paddingBottom: '1em',
        paddingTop: '1em',
        textDecoration: 'none',
        textAlign: 'center',
        minWidth: '12.5em',
        display: 'inline-block',
        borderBottomWidth: 4,
        borderBottomStyle: 'solid',
        borderBottomColor: colors.dark
      },
      active: {
        borderBottomColor: colors.darkPink,
        opacity: 1
      }
    }
  };

  render () {
    const styles = this.constructor.styles;
    const { searchSeries, seriesById, searchedSeriesIds } = this.props;
    return (
      <div>
        <Highcharts config={config} />
        <form>
          <Field
            component={SelectInput}
            getItemText={(id) => seriesById.getIn([ id, 'title', seriesById.getIn([ id, 'defaultLocale' ]) ])}
            getOptions={searchSeries}
            isLoading={searchedSeriesIds.get('_status') === FETCHING}
            label='Series'
            multiselect
            name='series'
            options={searchedSeriesIds.get('data').toJS()}
            placeholder='Series'
            onChange={(e) => console.warn('UPDATE', e)} />
          <Field component={DateInput} name='fromDate' placeholder={'reporting.activity.dateFrom'} onChange={(e) => console.warn('UPDATE', e)} />
          <Field component={DateInput} name='toDate' placeholder={'reporting.activity.dateTo'} onChange={(e) => console.warn('UPDATE', e)} />
        </form>
      </div>
    );
  }
}
