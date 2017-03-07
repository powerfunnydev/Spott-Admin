import React, { Component, PropTypes } from 'react';
import Radium from 'radium';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { fontWeights, makeTextStyle } from '../../_common/styles';
import SelectInput from '../../_common/inputs/selectInput';
import DateInput from '../../_common/inputs/dateInput';
import { FETCHING, isLoading } from '../../../constants/statusTypes';
import * as actions from './actions';
import { filtersSelector } from './selector';

@connect(filtersSelector, (dispatch) => ({
  loadAges: bindActionCreators(actions.loadAges, dispatch),
  loadGenders: bindActionCreators(actions.loadGenders, dispatch),
  loadLanguages: bindActionCreators(actions.loadLanguages, dispatch)
}))
@Radium
export default class Filters extends Component {

  static propTypes = {
    ages: ImmutablePropTypes.map.isRequired,
    agesById: ImmutablePropTypes.map.isRequired,
    fields: PropTypes.shape({
      ages: PropTypes.array,
      endDate: PropTypes.object,
      startDate: PropTypes.object,
      genders: PropTypes.array
    }).isRequired,
    genders: ImmutablePropTypes.map.isRequired,
    gendersById: ImmutablePropTypes.map.isRequired,
    languagesById: ImmutablePropTypes.map.isRequired,
    loadAges: PropTypes.func.isRequired,
    loadGenders: PropTypes.func.isRequired,
    loadLanguages: PropTypes.func.isRequired,
    style: PropTypes.object,
    onChange: PropTypes.func.isRequired
  };

  async componentDidMount () {
    // Load ages and genders, then load the rankings.
    await this.props.loadAges();
    await this.props.loadGenders();
    await this.props.loadLanguages();
    await this.props.onChange();
  }

  static styles = {
    container: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'flex-start',
      marginLeft: '-0.75em',
      marginRight: '-0.75em'
    },
    field: {
      display: 'inline-block',
      paddingLeft: '0.75em',
      paddingRight: '0.75em',
      paddingTop: 0,
      paddingBottom: '0.5em',
      width: '100%'
    },
    title: {
      ...makeTextStyle(fontWeights.medium, '0.75em'),
      color: '#6d8791',
      paddingBottom: '1em'
    }
  };

  render () {
    const styles = this.constructor.styles;
    const {
      ages, agesById, fields, genders, gendersById, languagesById, style, onChange
    } = this.props;

    console.warn('languages', this.props.languagesById.toJS());

    return (
      <form style={[ styles.container, style ]}>
        <SelectInput
          getItemText={(id) => agesById.getIn([ id, 'description' ])}
          input={{ value: fields.ages }}
          isLoading={isLoading(ages)}
          label='Age Groups'
          multiselect
          name='ages'
          options={ages.get('data').map((e) => e.get('id')).toJS()}
          placeholder='Age'
          style={[ styles.field, { flex: 2 } ]}
          onChange={onChange.bind(null, 'ages', 'array')} />
        <SelectInput
          getItemText={(id) => gendersById.getIn([ id, 'description' ])}
          input={{ value: fields.genders }}
          isLoading={genders.get('_status') === FETCHING}
          label='Gender'
          multiselect
          name='genders'
          options={genders.get('data').map((e) => e.get('id')).toJS()}
          placeholder='Gender'
          style={[ styles.field, { flex: 1.5 } ]}
          onChange={onChange.bind(null, 'genders', 'array')} />
        <SelectInput
          getItemText={(id) => languagesById.getIn([ id, 'name' ])}
          input={{ value: fields.languages }}
          label='Language'
          multiselect
          name='languages'
          options={languagesById.keySeq().toJS()}
          placeholder='Languages'
          style={[ styles.field, { flex: 2 } ]}
          onChange={onChange.bind(null, 'languages', 'array')} />
        <div style={{ display: 'flex', flex: 3.5, marginLeft: 20 }}>
          <DateInput
            dateFormat='D MMMM YYYY'
            first
            input={{ value: fields.startDate }}
            label='Start date'
            name='startDate'
            style={[ styles.field ]}
            onChange={onChange.bind(null, 'startDate', 'date')}/>
          <DateInput
            dateFormat='D MMMM YYYY'
            first
            input={{ value: fields.endDate }}
            label='End date'
            name='endDate'
            style={[ styles.field ]}
            onChange={onChange.bind(null, 'endDate', 'date')}/>
        </div>
      </form>
    );
  }
}
