import React, { Component, PropTypes } from 'react';
import Radium from 'radium';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import ImmutablePropTypes from 'react-immutable-proptypes';
import SelectInput from '../../_common/inputs/selectInput';
import { fontWeights, makeTextStyle, mediaQueries } from '../../_common/styles';
import { FETCHING, isLoading } from '../../../constants/statusTypes';
import * as actions from '../actions';
import { rankingsFilterSelector } from '../selector';

@connect(rankingsFilterSelector, (dispatch) => ({
  loadAges: bindActionCreators(actions.loadAges, dispatch),
  loadGenders: bindActionCreators(actions.loadGenders, dispatch)
}))
@Radium
export default class RankingsFilterForm extends Component {

  static propTypes = {
    ages: ImmutablePropTypes.map.isRequired,
    agesById: ImmutablePropTypes.map.isRequired,
    fields: PropTypes.shape({
      ages: PropTypes.array,
      genders: PropTypes.array
    }),
    genders: ImmutablePropTypes.map.isRequired,
    gendersById: ImmutablePropTypes.map.isRequired,
    loadAges: PropTypes.func.isRequired,
    loadGenders: PropTypes.func.isRequired,
    style: PropTypes.object,
    onChange: PropTypes.func.isRequired
  };

  async componentDidMount () {
    // Load ages and genders, then load the rankings.
    await this.props.loadAges();
    await this.props.loadGenders();
    await this.props.onChange();
  }

  static styles = {
    filters: {
      marginLeft: '-0.75em',
      marginRight: '-0.75em'
    },
    field: {
      display: 'inline-block',
      paddingLeft: '0.75em',
      paddingRight: '0.75em',
      paddingTop: 0,
      paddingBottom: '0.5em',
      width: '100%',
      [mediaQueries.small]: {
        width: '50%'
      },
      [mediaQueries.medium]: {
        // For the moment there are only 2 charts, location is coming soon.
        width: '50%'
      }
    },
    title: {
      ...makeTextStyle(fontWeights.medium, '0.75em'),
      color: '#6d8791',
      paddingBottom: '1em'
    }
  };

  render () {
    const styles = this.constructor.styles;
    const { ages, agesById, fields, genders, gendersById, style, onChange } = this.props;
    return (
      <form style={style}>
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
      </form>
    );
  }
}
