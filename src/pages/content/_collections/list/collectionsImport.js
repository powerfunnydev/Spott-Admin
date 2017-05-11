/* eslint-disable react/no-set-state */
// False positive on the arguments of an async function.
/* eslint-disable react/prop-types */
import React, { Component, PropTypes } from 'react';
import Radium from 'radium';
import { FormSubtitle, FormDescription } from '../../../_common/styles';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { reduxForm, Field } from 'redux-form/immutable';
import SelectInput from '../../../_common/inputs/selectInput';
import { FETCHING } from '../../../../constants/statusTypes';
import localized from '../../../_common/decorators/localized';
import PersistModal, { dialogStyle } from '../../../_common/components/persistModal';
import * as actions from './actions';
import selector from './selector';

function validate (values, { medium, t }) {
  const validationErrors = {};
  const { episodeId, seasonId } = values.toJS();
  if (!episodeId) { validationErrors.episodeId = t('common.errors.required'); }
  if (!seasonId) { validationErrors.seasonId = t('common.errors.required'); }
  return validationErrors;
}

@localized
@connect(selector, (dispatch) => ({
  searchSeasons: bindActionCreators(actions.searchSeasons, dispatch),
  searchEpisodes: bindActionCreators(actions.searchEpisodes, dispatch)
}))
@reduxForm({
  form: 'collectionImport',
  validate
})
@Radium
export default class CollectionsImport extends Component {

  static propTypes = {
    currentSeriesEntryId: PropTypes.string,
    currentSeriesId: PropTypes.string,
    mediumId: PropTypes.string,
    searchEpisodes: PropTypes.func.isRequired,
    searchSeasons: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired
  };

  constructor (props) {
    super(props);
    this.searchSeasons = ::this.searchSeasons;
  }

  async searchSeasons (searchString) {
    const { currentSeriesEntryId, searchSeasons } = this.props;
    await searchSeasons(searchString, { seriesEntryId: currentSeriesEntryId });
  }

  static styles = {
    description: {
      marginBottom: '1.25em'
    }
  };

  render () {
    const {
       handleSubmit, mediaById, searchEpisodes,
       searchedEpisodeIds, searchedSeasonIds, onClose, onSubmit
    } = this.props;
    const styles = this.constructor.styles;
    return (
      <PersistModal
        isOpen
        style={{
          ...dialogStyle,
          content: {
            ...dialogStyle.content,
            maxWidth: 830
          }
        }}
        submitButtonText='Import'
        title='Import Collections'
        onClose={onClose}
        onSubmit={handleSubmit(onSubmit)}>
        <div>
          <FormSubtitle first>Import Collections</FormSubtitle>
          <FormDescription style={styles.description}>Select a Season and Episode to import the collections from.</FormDescription>
            <div>
              <Field
                component={SelectInput}
                getItemImage={(id) => mediaById.getIn([ id, 'posterImage', 'url' ])}
                getItemText={(id) => mediaById.getIn([ id, 'title' ])}
                getOptions={this.searchSeasons}
                isLoading={searchedSeasonIds.get('_status') === FETCHING}
                label='Season'
                name='seasonId'
                options={searchedSeasonIds.get('data').toJS()}
                placeholder='Season'
                required
                onChange={() => {
                  this.props.dispatch(this.props.change('episodeId', null));
                }} />
              <Field
                component={SelectInput}
                getItemImage={(id) => mediaById.getIn([ id, 'posterImage', 'url' ])}
                getItemText={(id) => mediaById.getIn([ id, 'title' ])}
                getOptions={searchEpisodes}
                isLoading={searchedEpisodeIds.get('_status') === FETCHING}
                label='Episode'
                name='episodeId'
                options={searchedEpisodeIds.get('data').toJS()}
                placeholder='Episode'
                required />
          </div>
          <div />
      </div>
    </PersistModal>
    );
  }
}
