import Radium from 'radium';
import React, { Component, PropTypes } from 'react';
// import ImmutablePropTypes from 'react-immutable-proptypes';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
// import { ERROR, FETCHING, LOADED, UPDATING } from '../../../data/statusTypes';
// import { Section } from '../../../_common/components';
import { buttonStyles, colors, fontWeights, makeTextStyle } from '../../../_common/styles';
import EntityDetails from '../../../_common/entityDetails';
import { confirmation } from '../../../_common/askConfirmation';
import PersistVideoModal from '../persist';
import * as actions from './actions';
import selector from './selector';

const cross = require('../../../../assets/images/cross/cross-red.svg');
//
// @Radium
// class Video extends Component {
//
//   static propTypes = {
//     localeNames: ImmutablePropTypes.map.isRequired,
//     taggerUrl: PropTypes.string,
//     video: ImmutablePropTypes.map, // Not required, video starting may not have started yet...
//     onUnlinkVideo: PropTypes.func.isRequired
//   };
//
//   constructor (props) {
//     super(props);
//     this.onUnlinkVideoClick = ::this.onUnlinkVideoClick;
//   }
//
//   formatTime (seconds) {
//     const d = new Date(seconds * 1000);
//     return `${d.getHours() - 1}h ${d.getMinutes()}m ${d.getSeconds()}s`;
//   }
//
//   onUnlinkVideoClick (e) {
//     e.preventDefault();
//     this.props.onUnlinkVideo();
//   }
//
//   static styles = {
//     container: {
//       border: `1px solid ${colors.lightGray}`
//     },
//     heading: {
//       backgroundColor: colors.lightGray,
//       display: 'flex',
//       fontFamily: 'Rubik-Medium',
//       justifyContent: 'space-between',
//       padding: defaultSpacing,
//       width: '100%'
//     },
//     body: {
//       color: colors.darkerGray,
//       padding: defaultSpacing
//     },
//     section: {
//       paddingBottom: defaultSpacing / 3
//     },
//     property: {
//       container: {
//         display: 'flex',
//         paddingBottom: defaultSpacing / 3
//       },
//       name: {
//         flex: '1 1 20%'
//       },
//       value: {
//         flex: '1 1 80%',
//         overflow: 'hidden',
//         textOverflow: 'ellipsis'
//       }
//     },
//     filename: {
//       fontSize: 12
//     }
//   };
//
//   render () {
//     const { styles } = this.constructor;
//     const { localeNames, taggerUrl, video } = this.props;
//     if (!video || video.get('_status') === FETCHING) {
//       return <div>Loading video...</div>;
//     } else if (video.get('_status') === ERROR) {
//       return <div>Loading video failed.</div>;
//     } else if (video.get('_status') === LOADED || video.get('_status') === UPDATING) {
//       return (
//         <div style={styles.container}>
//           <div style={styles.heading}>
//             {video.get('description') || 'No description'}
//             <div>
//               <button
//                 style={[ buttonStyles.base, buttonStyles.extraSmall, buttonStyles.gray ]}
//                 type='button'
//                 onClick={this.onUnlinkVideoClick}>
//                 Unlink video
//               </button>
//               {taggerUrl &&
//                 <a
//                   href={taggerUrl}
//                   key='launchEditor'
//                   style={[ buttonStyles.base, buttonStyles.extraSmall, buttonStyles.gray ]}
//                   target='_blank'
//                   title='Go to tagger'>
//                   Launch editor
//                 </a>}
//               </div>
//           </div>
//           <div style={styles.body}>
//             <h3 style={styles.section}>General</h3>
//             <div style={styles.property.container}>
//               <div style={styles.property.name}>Video source</div>
//               <div style={styles.property.value}>
//                 <div>{video.get('videoFilename') ? 'Video file' : 'No video file'}</div>
//                 {video.get('videoFilename') && <div style={styles.filename}>{video.get('videoFilename')}</div>}
//               </div>
//             </div>
//             <div style={styles.property.container}>
//               <div style={styles.property.name}>Duration</div>
//               <div style={styles.property.value}>{this.formatTime(video.get('totalDurationInSeconds'))}</div>
//             </div>
//             <h3 style={styles.section}>Audio</h3>
//             {video.get('audioFingerprints').size === 0 &&
//               <div style={styles.property.container}>
//                 No audio file
//               </div>}
//             {video.get('audioFingerprints').map((fp) => (
//               <div key={`${fp.get('type')}_${fp.get('fingerprint')}`} style={styles.property.container}>
//                 <div style={styles.property.name}>{fp.get('language') ? localeNames.get(fp.get('language')) || fp.get('language') : 'Global'}</div>
//                 <div style={styles.property.value}>
//                   {fp.get('fingerprint')} (<span>{fp.get('type')}</span>)
//                   <div style={styles.filename}>{fp.get('audioFilename')}</div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       );
//     }
//   }
//
// }

@connect(selector, (dispatch) => ({
  loadVideo: bindActionCreators(actions.loadVideo, dispatch)
}))
@Radium
export default class RelatedVideo extends Component {

  static propTypes = {
    input: PropTypes.object.isRequired,
    // editStatusCurrentVideo: ImmutablePropTypes.map,
    loadVideo: PropTypes.func.isRequired
    // localeNames: ImmutablePropTypes.map.isRequired,
    // partialTaggerUrl: PropTypes.string,
    // relatedVideoIdField: PropTypes.object.isRequired,
    // videoUploadUrl: PropTypes.string,
    // videosById: ImmutablePropTypes.map.isRequired
  };

  constructor (props) {
    super(props);
    this.onUnlinkVideo = ::this.onUnlinkVideo;
    this.onClickCreate = ::this.onClickCreate;
    this.state = { create: false, edit: false };
  }

  componentWillMount () {
    const videoId = this.props.input.value;
    if (videoId) {
      this.props.loadVideo(videoId);
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

  persistVideo () {

  }

  static styles = {
    detailsContainer: {
      borderTopLeftRadius: 2,
      borderTopRightRadius: 2,
      border: 'solid 1px #ced6da',
      paddingLeft: 24,
      paddingRight: 24,
      marginTop: 18
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
    }
  };

  render () {
    const styles = this.constructor.styles;
    const { input: { value: videoId }, video } = this.props;
    console.warn('VIDEO', videoId, video && video.toJS());
    if (videoId) {
      if (video.get('_status') === 'loaded') {
        return (
          <div>
            <div style={styles.detailsContainer}>
              <EntityDetails
                content={video.get('videoFilename')}
                imageUrl={video.getIn([ 'scenes', 0, 'image' ]) && `${video.getIn([ 'scenes', 0, 'image', 'url' ])}?height=174&width=310`}
                style={styles.details}
                title={video.get('description')} />
            </div>
            <div style={styles.unlink} onClick={this.onUnlinkVideo}>
              <img src={cross} />&nbsp;&nbsp;&nbsp;Unlink
            </div>
          </div>
        );
      }
      return <div>Loading...</div>;
    }

    return (
      <div style={styles.linkContainer}>
        <h2 style={styles.title}>Create a new interactive video</h2>
        <button key='create' style={[ buttonStyles.base, buttonStyles.small, buttonStyles.blue ]} type='button' onClick={this.onClickCreate}>
          Create new
        </button>
        {this.state.create &&
          <PersistVideoModal
            onClose={() => this.setState({ create: false })}
            onSubmit={this.persistVideo} />}
      </div>
    );

    // (
      // <Section {...this.props}>
      //    {!videoId && (
      //     <div>
      //       No linked project.
      //       {/* {videoUploadUrl &&
      //         <a
      //           href={videoUploadUrl}
      //           key='uploadVideo'
      //           style={[ buttonStyles.base, buttonStyles.extraSmall, buttonStyles.gray ]}
      //           target='_blank'
      //           title='Upload a video'>
      //           Upload video
      //         </a>} */}
      //     </div>
      //   )}
      //   {videoId && (
      //     <div>
      //       {/* <Video
      //         key={videoId}
      //         localeNames={localeNames}
      //         taggerUrl={partialTaggerUrl && `${partialTaggerUrl}/video/${videoId}`}
      //         video={videosById.get(videoId)}
      //         onUnlinkVideo={this.onUnlinkVideo} /> */}
      //
      //         {currentEpisode.get('_status') === 'loaded' && currentEpisode &&
      //           <EntityDetails
      //             imageUrl={imageUrl}
      //             title={currentEpisode.getIn([ 'title', defaultLocale ])}
      //             onEdit={() => { this.props.routerPushWithReturnTo(`content/series/read/${params.seriesEntryId}/seasons/read/${params.seasonId}/episodes/edit/${currentEpisode.get('id')}`); }}
      //             onRemove={() => console.warn('delete')} />}
      //     </div>
      //   )}
      // </Section>
    // );
  }

}
