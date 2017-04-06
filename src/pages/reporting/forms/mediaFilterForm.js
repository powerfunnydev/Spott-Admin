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
  fetchMedium: bindActionCreators(actions.fetchMedium, dispatch),
  searchMedia: bindActionCreators(actions.searchMedia, dispatch)
}))
@Radium
export default class MediaFilterForm extends Component {

  static propTypes = {
    fetchMedium: PropTypes.func.isRequired,
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
    const { fetchMedium, fields: { media } } = this.props;
    if (!media || media.length === 0) {
      // Select the first 5 media.
      const mediaResults = await this.props.searchMedia();
      const firstFiveMedia = mediaResults.map(({ id }) => id).splice(0, 5);
      this.props.onChange('media', 'array', firstFiveMedia);
    }
    if (media) {
      // Get media which are not yet in the state.
      for (const mediumId of media) {
        await fetchMedium({ mediumId });
      }
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
