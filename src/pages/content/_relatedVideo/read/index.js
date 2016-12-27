/* eslint-disable react/no-set-state */
import Radium from 'radium';
import React, { Component, PropTypes } from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Link } from 'react-router';
import { buttonStyles, colors, fontWeights, makeTextStyle } from '../../../_common/styles';
import EntityDetails from '../../../_common/entityDetails';
import { confirmation } from '../../../_common/askConfirmation';
import ProgressBar from '../../../_common/components/progressBar';
import { routerPushWithReturnTo } from '../../../../actions/global';
import { COMMERCIAL, EPISODE, MOVIE } from '../../../../constants/mediumTypes';
import Spinner from '../../../_common/components/spinner';
import PersistVideoModal from '../persist';
import * as actions from './actions';
import selector from './selector';

const cross = require('../../../../assets/images/cross/cross-red.svg');

@connect(selector, (dispatch) => ({
  loadVideo: bindActionCreators(actions.loadVideo, dispatch),
  routerPushWithReturnTo: bindActionCreators(routerPushWithReturnTo, dispatch)
}))
@Radium
export default class RelatedVideo extends Component {

  static propTypes = {
    input: PropTypes.object.isRequired,
    loadVideo: PropTypes.func.isRequired,
    medium: ImmutablePropTypes.map.isRequired,
    partialTaggerUrl: PropTypes.string.isRequired,
    routerPushWithReturnTo: PropTypes.func.isRequired,
    video: ImmutablePropTypes.map,
    videoUploadStatus: ImmutablePropTypes.map
  };

  constructor (props) {
    super(props);
    this.onUnlinkVideo = ::this.onUnlinkVideo;
    this.onClickCreate = ::this.onClickCreate;
    this.state = { create: false, edit: false };
  }

  componentDidMount () {
    const { input: { value: videoId } } = this.props;
    if (videoId) {
      this.props.loadVideo(videoId);
    }
  }

  componentWillReceiveProps ({ input: { value: newVideoId } }) {
    const oldVideoId = this.props.input.value;
    if (newVideoId && oldVideoId !== newVideoId) {
      this.props.loadVideo(newVideoId);
    }
  }

  onClickCreate (e) {
    e.preventDefault();
    this.setState({ create: true });
  }

  async onUnlinkVideo (e) {
    e.preventDefault();
    const confirmed = await confirmation('Are you sure you want to unlink this video?');
    if (confirmed) {
      this.props.input.onChange(null);
    }
  }

  static styles = {
    detailsContainer: {
      base: {
        position: 'relative',
        borderTopLeftRadius: 2,
        borderTopRightRadius: 2,
        border: 'solid 1px #ced6da',
        paddingLeft: 24,
        paddingRight: 24,
        marginTop: 18
      },
      bottomBar: {
        borderBottomLeftRadius: 2,
        borderBottomRightRadius: 2
      }
    },
    details: {

    },
    unlink: {
      ...makeTextStyle(fontWeights.medium, '0.75em'),
      color: colors.red,
      display: 'flex',
      justifyContent: 'center',
      backgroundColor: 'rgba(244, 245, 245, 0.5)',
      padding: 8,
      borderBottomLeftRadius: 2,
      borderBottomRightRadius: 2,
      border: 'solid 1px #ced6da',
      cursor: 'pointer',
      // Border collapse.
      marginTop: -1
    },
    linkContainer: {
      borderRadius: 2,
      border: 'solid 1px #ced6da',
      padding: 24,
      marginTop: 18,
      textAlign: 'center'
    },
    title: {
      ...makeTextStyle(fontWeights.regular, '0.75em'),
      color: colors.lightGray3,
      paddingBottom: 20
    },
    overlay: {
      backgroundColor: 'rgba(255, 255, 255, 0.9)',
      position: 'absolute',
      top: 0,
      bottom: 0,
      left: 0,
      right: 0
    },
    progress: {
      container: {
        alignItems: 'center',
        bottom: 0,
        display: 'flex',
        justifyContent: 'center',
        left: 0,
        position: 'absolute',
        right: 0,
        top: 0
      },
      bar: {
        width: '18.75em'
      }
    },
    launchTagger: {
      marginLeft: 0,
      marginTop: '1em',
      paddingLeft: 24,
      paddingRight: 24
    },
    spinnerContainer: {
      alignItems: 'center',
      display: 'flex',
      justifyContent: 'center',
      padding: '3em'
    }
  };

  render () {
    const styles = this.constructor.styles;
    const { input: { value: videoId }, medium, video, videoUploadStatus } = this.props;

    if (videoId) {
      if (video.get('_status') === 'loaded') {
        let taggerUrl;
        switch (medium.get('type')) {
          case COMMERCIAL:
            taggerUrl = `tagger/commercial/${medium.get('id')}/video/${videoId}`;
            break;
          case EPISODE:
            taggerUrl = `tagger/episode/${medium.get('id')}/video/${videoId}`;
            break;
          case MOVIE:
            taggerUrl = `tagger/movie/${medium.get('id')}/video/${videoId}`;
            break;
        }

        return (
          <div>
            <div style={styles.detailsContainer.base}>
              <EntityDetails
                content={
                  <div>
                    {video.get('videoFilename')}
                    <div>
                      <Link
                        key='tagger'
                        style={{ ...buttonStyles.base, ...buttonStyles.small, ...buttonStyles.blue, ...styles.launchTagger }}
                        to={taggerUrl}>
                        Launch Tagger
                      </Link>
                    </div>
                  </div>}
                imageUrl={video.getIn([ 'medium', 'profileImage' ]) && `${video.getIn([ 'medium', 'profileImage', 'url' ])}?height=174&width=310`}
                style={styles.details}
                title={video.get('description')}
                onEdit={() => this.props.routerPushWithReturnTo(`/content/videos/edit/${videoId}`)}/>
            </div>
            <div style={styles.unlink} onClick={this.onUnlinkVideo}>
              <img src={cross} />&nbsp;&nbsp;&nbsp;Unlink
            </div>
          </div>
        );
      }
      return (
        <div style={styles.spinnerContainer}>
          <Spinner size='large'/>
        </div>
      );
    }

    if (videoUploadStatus) {
      const showProgress = videoUploadStatus.get('currentBytes') !== videoUploadStatus.get('totalBytes');
      return (
        <div>
          <div style={[ styles.detailsContainer.base, styles.detailsContainer.bottomBar ]}>
            <EntityDetails
              content={videoUploadStatus.get('videoFilename')}
              style={styles.details}
              title={videoUploadStatus.get('description')} />
            {showProgress &&
              <div style={styles.overlay} />}
            {showProgress &&
              <div style={styles.progress.container}>
                <ProgressBar
                  progress={videoUploadStatus.get('currentBytes')}
                  style={styles.progress.bar}
                  total={videoUploadStatus.get('totalBytes')}/>
              </div>}
          </div>

        </div>
      );
    }

    // A description could be 'Suits S02E01 Dogfight'.
    // TODO: support movies etc.
    const description = medium.getIn([ 'title', medium.get('defaultLocale') ]);

    return (
      <div style={styles.linkContainer}>
        <h2 style={styles.title}>Create a new interactive video</h2>
        <button key='create' style={[ buttonStyles.base, buttonStyles.small, buttonStyles.blue ]} type='button' onClick={this.onClickCreate}>
          Create new
        </button>
        {this.state.create &&
          <PersistVideoModal
            initialValues={{
              description,
              externalReference: medium.get('externalReference'),
              externalReferenceSource: medium.get('externalReferenceSource'),
              processAudio: true,
              processScenes: true
            }}
            onClose={() => this.setState({ create: false })} />}
      </div>
    );
  }

}
