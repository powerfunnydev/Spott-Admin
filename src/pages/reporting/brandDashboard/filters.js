import React, { Component, PropTypes } from 'react';
import Radium from 'radium';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import ImmutablePropTypes from 'react-immutable-proptypes';
import SelectInput from '../../_common/inputs/selectInput';
import DateInput from '../../_common/inputs/dateInput';
import { FETCHING, isLoading } from '../../../constants/statusTypes';
// import * as actions from '../actions';
// import { filtersSelector } from '../selector';

function filtersSelector () {
  return {};
}
const actions = {};

// endDate: moment().startOf('day'),
// // We assume the ALL event will be always there.
// event: 'ALL',
// startDate: moment().startOf('day').subtract(1, 'months').date(1)

@connect(filtersSelector, (dispatch) => ({
  loadAges: bindActionCreators(actions.loadAges, dispatch),
  loadGenders: bindActionCreators(actions.loadGenders, dispatch)
}))
@Radium
export default class Filters extends Component {

  static propTypes = {
    events: ImmutablePropTypes.map,
    eventsById: ImmutablePropTypes.map,
    fields: PropTypes.shape({
      endDate: PropTypes.object,
      events: PropTypes.array, // event ids
      startDate: PropTypes.object
    }).isRequired,
    loadEvents: PropTypes.func.isRequired,
    style: PropTypes.object,
    onChange: PropTypes.func.isRequired
  };

  constructor (props) {
    super(props);
    this.onChangeEvents = ::this.onChangeEvents;
  }

  async componentDidMount () {
    // Load ages and genders, then load the rankings.
    await this.props.loadAges();
    await this.props.loadGenders();
    await this.props.onChange();
  }

  static styles = {
    container: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center'
    },
    col6: {
      width: '100%'
    },
    eventContainer: {
      display: 'flex',
      paddingRight: '1.5em'
    },
    field: {
      flex: 5
    }
  };

  render () {
    const styles = this.constructor.styles;
    const {
      ages, agesById, events, eventsById, fields, genders, gendersById, style, onChange
    } = this.props;

    return (
      <form style={[ styles.container, style ]}>
        <h2 style={styles.title}>Filter</h2>
        <div style={styles.filters}>
          <SelectInput
            getItemText={(id) => agesById.getIn([ id, 'description' ])}
            input={{ value: fields.ages }}
            isLoading={isLoading(ages)}
            multiselect
            name='ages'
            options={ages.get('data').map((e) => e.get('id')).toJS()}
            placeholder='Age'
            style={styles.field}
            onChange={onChange.bind(null, 'ages', 'array')} />
          <SelectInput
            getItemText={(id) => gendersById.getIn([ id, 'description' ])}
            input={{ value: fields.genders }}
            isLoading={genders.get('_status') === FETCHING}
            multiselect
            name='genders'
            options={genders.get('data').map((e) => e.get('id')).toJS()}
            placeholder='Gender'
            style={styles.field}
            onChange={onChange.bind(null, 'genders', 'array')} />
          {/* TODO: Add location filter. */}
        </div>
        <DateInput
          dateFormat='D MMMM YYYY'
          first
          input={{ value: fields.startDate }}
          name='startDate'
          required
          style={{ flex: 2.25 }}
          onChange={onChange.bind(null, 'startDate', 'date')}/>
        <div style={{ flex: 0.3, display: 'flex', justifyContent: 'center' }}><p>-</p></div>
        <DateInput
          dateFormat='D MMMM YYYY'
          first
          input={{ value: fields.endDate }}
          name='endDate'
          required
          style={{ flex: 2.25 }}
          onChange={onChange.bind(null, 'endDate', 'date')}/>
      </form>
    );
  }
}
