import React, { Component, PropTypes } from 'react';
import { reduxForm, Field, SubmissionError } from 'redux-form/immutable';
import Radium from 'radium';
import { connect } from 'react-redux';
import moment from 'moment';
import { bindActionCreators } from 'redux';
import { Root, FormSubtitle, colors, EditTemplate } from '../../../_common/styles';
import { routerPushWithReturnTo } from '../../../../actions/global';
import { Tabs, Tab } from '../../../_common/components/formTabs';
import * as actions from './actions';
import Header from '../../../app/header';
import ImmutablePropTypes from 'react-immutable-proptypes';
import localized from '../../../_common/localized';
import Section from '../../../_common/components/section';
import selector from './selector';
import SpecificHeader from '../../header';
import TextInput from '../../../_common/inputs/textInput';

function validate (values, { t }) {
  const validationErrors = {};
  const { description, externalReference, externalReferenceSource } = values.toJS();
  if (!description) { validationErrors.description = t('common.errors.required'); }
  if (!externalReference) { validationErrors.externalReference = t('common.errors.required'); }
  if (!externalReferenceSource) { validationErrors.externalReferenceSource = t('common.errors.required'); }
  // Done
  return validationErrors;
}

@localized
@connect(selector, (dispatch) => ({
  loadVideo: bindActionCreators(actions.loadVideo, dispatch),
  routerPushWithReturnTo: bindActionCreators(routerPushWithReturnTo, dispatch),
  searchSeriesEntries: console.warn,
  submit: bindActionCreators(actions.submit, dispatch)
}))
@reduxForm({
  form: 'videoEdit',
  validate
})
@Radium
export default class EditVideo extends Component {

  static propTypes = {
    change: PropTypes.func.isRequired,
    children: PropTypes.node,
    currentVideo: ImmutablePropTypes.map.isRequired,
    // currentSeasonId: PropTypes.string,
    // currentSeriesEntryId: PropTypes.string,
    dispatch: PropTypes.func.isRequired,
    error: PropTypes.any,
    errors: PropTypes.object,
    handleSubmit: PropTypes.func.isRequired,
    initialize: PropTypes.func.isRequired,
    loadVideo: PropTypes.func.isRequired,
    location: PropTypes.object.isRequired,
    params: PropTypes.object.isRequired,
    routerPushWithReturnTo: PropTypes.func.isRequired,
    // searchSeriesEntries: PropTypes.func.isRequired,
    // searchedSeriesEntryIds: ImmutablePropTypes.map.isRequired,
    // seriesEntriesById: ImmutablePropTypes.map.isRequired,
    submit: PropTypes.func.isRequired,
    t: PropTypes.func.isRequired
  };

  constructor (props) {
    super(props);
    this.submit = ::this.submit;
    this.redirect = ::this.redirect;
  }

  async componentWillMount () {
    if (this.props.params.videoId) {
      const video = await this.props.loadVideo(this.props.params.videoId);
      this.props.initialize(video);
    }
  }

  formatVideoLength (seconds) {
    const date = moment.utc(seconds * 1000);
    return date.format('HH:mm:ss');
  }

  redirect () {
    this.props.routerPushWithReturnTo('content/series', true);
  }

  async submit (form) {
    const { params: { videoId } } = this.props;
    try {
      await this.props.submit({
        ...form.toJS(),
        videoId
      });
      this.redirect();
    } catch (error) {
      throw new SubmissionError({ _error: 'common.errors.unexpected' });
    }
  }

  static styles = {
    backgroundRoot: {
      backgroundColor: colors.lightGray4,
      paddingBottom: '50px'
    },
    container: {
      display: 'flex',
      marginTop: '1.3em',
      paddingLeft: 40,
      paddingRight: 40,
      width: '100%'
    },
    details: {
      width: '40%',
      paddingLeft: '3.75em',
      minWidth: '20em'
    },
    sceneImage: {
      width: '100%'
    },
    sceneImageContainer: {
      width: '60%',
      minWidth: '25em'
    },
    label: {
      fontSize: '0.75em',
      color: colors.lightGray3,
      flex: '0 0 90px'
    },
    value: {
      base: {
        alignSelf: 'flex-end',
        fontSize: '0.75em',
        color: colors.darkGray2
      }
    },
    row: {
      display: 'flex',
      paddingBottom: '0.438em'
    },
    subtitle: {
      base: {
        paddingBottom: '0.625em',
        marginTop: '1.25em'
      },
      first: {
        marginTop: 0
      }
    }
  };

  render () {
    const styles = this.constructor.styles;
    const { currentVideo, handleSubmit, location } = this.props;

    const imageUrl = currentVideo.getIn([ 'scenes', 0, 'image', 'url' ]);

    return (
      <Root style={styles.backgroundRoot}>
        <Header currentLocation={location} hideHomePageLinks />
        <SpecificHeader/>
        <div style={styles.container}>
          <div style={styles.sceneImageContainer}>
            {imageUrl && <img src={imageUrl} style={styles.sceneImage} />}
          </div>
          <div style={styles.details}>
            <FormSubtitle style={[ styles.subtitle.base, styles.subtitle.first ]}>Video information</FormSubtitle>
            <div style={styles.row}>
              <div style={styles.label}>Video length</div>
              <div style={styles.value.base}>{this.formatVideoLength(currentVideo.get('totalDurationInSeconds'))}</div>
            </div>
            <div style={styles.row}>
              <div style={styles.label}>Raw file</div>
              <div style={styles.value.base}>{currentVideo.get('videoFilename')}</div>
            </div>
          </div>
        </div>
        <EditTemplate onCancel={this.redirect} onSubmit={handleSubmit(this.submit)}>
          <Tabs showPublishStatus>
            <Tab title='Details'>
              <Section>
                <FormSubtitle first>General</FormSubtitle>
                <Field
                  component={TextInput}
                  label='Interactive video name'
                  name='description'
                  placeholder='Interactive video name'
                  required />
                <Field
                  component={TextInput}
                  label='Source'
                  name='externalReferenceSource'
                  placeholder='Source'
                  required />
                <Field
                  component={TextInput}
                  label='Reference source'
                  name='externalReference'
                  placeholder='Reference source'
                  required />
              </Section>
            </Tab>
          </Tabs>
        </EditTemplate>
      </Root>
    );
  }

}
