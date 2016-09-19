import React, { Component, PropTypes } from 'react';
import Radium from 'radium';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { reduxForm, Field } from 'redux-form/immutable';
import SelectInput from '../../_common/inputs/selectInput';
import { FETCHING } from '../../../constants/statusTypes';
import * as actions from '../actions';
import { mediaFilterSelector } from '../selector';

@connect(mediaFilterSelector, (dispatch) => ({
  searchMedia: bindActionCreators(actions.searchMedia, dispatch)
}))
@reduxForm({
  destroyOnUnmount: false,
  form: 'reportingMediaFilter'
})
@Radium
export default class MediaFilterForm extends Component {

  static propTypes = {
    mediaById: ImmutablePropTypes.map,
    searchMedia: PropTypes.func.isRequired,
    searchedMediumIds: ImmutablePropTypes.map.isRequired,
    style: PropTypes.object
  };

  render () {
    const { searchMedia, mediaById, searchedMediumIds, style } = this.props;
    return (
      <form style={style}>
        <Field
          component={SelectInput}
          getItemText={(id) => mediaById.getIn([ id, 'title' ])}
          getOptions={searchMedia}
          isLoading={searchedMediumIds.get('_status') === FETCHING}
          multiselect
          name='media'
          options={searchedMediumIds.get('data').toJS()}
          placeholder='Series/Movies/Commercials'
          onChange={(e) => console.warn('UPDATE', e)} />
      </form>
    );
  }
}
