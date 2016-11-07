import React, { Component, PropTypes } from 'react';
import Radium from 'radium';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import ImmutablePropTypes from 'react-immutable-proptypes';
import SelectInput from '../../_common/inputs/selectInput';
import { FETCHING } from '../../../constants/statusTypes';
import * as actions from '../actions';
import { mediaFilterSelector } from '../selector';

@connect(mediaFilterSelector, (dispatch) => ({
  searchMedia: bindActionCreators(actions.searchMedia, dispatch)
}))
@Radium
export default class MediaFilterForm extends Component {

  static propTypes = {
    fields: PropTypes.shape({
      media: PropTypes.array
    }).isRequired,
    mediaById: ImmutablePropTypes.map,
    searchMedia: PropTypes.func.isRequired,
    searchedMediumIds: ImmutablePropTypes.map.isRequired,
    style: PropTypes.object,
    onChange: PropTypes.func.isRequired
  };

  // If there are no media, select the first 5.
  async componentDidMount () {
    const { media } = this.props.fields;
    if (!media || media.length === 0) {
      // Select the first 5 media.
      const firstFiveMedia = (await this.props.searchMedia()).map(({ id }) => id).splice(0, 5);
      this.props.onChange('media', 'array', firstFiveMedia);
    }
  }

  render () {
    const { fields, searchMedia, mediaById, searchedMediumIds, style, onChange } = this.props;
    return (
      <form style={style}>
        <SelectInput
          getItemText={(id) => mediaById.getIn([ id, 'title' ])}
          getOptions={searchMedia}
          input={{ value: fields.media }}
          isLoading={searchedMediumIds.get('_status') === FETCHING}
          multiselect
          name='media'
          options={searchedMediumIds.get('data').toJS()}
          placeholder='Series/Movies/Commercials'
          onChange={onChange.bind(null, 'media', 'array')} />
      </form>
    );
  }
}
