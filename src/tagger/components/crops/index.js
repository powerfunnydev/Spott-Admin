/* eslint-disable react/no-set-state */ // TODO remove this line.
import Radium from 'radium';
import React, { Component } from 'react';
import * as PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { connect } from 'react-redux';
import Masonry from 'react-masonry-component';
import PureRender from '../_helpers/pureRenderDecorator';
import colors from '../colors';
import PersistCrop from './persist';
import SelectFrame from './persist/selectFrame';
import Crop from './crop';
import BottomBar from '../_helpers/bottomBar';
import * as actions from './actions';
import selector from './selector';

import plusIcon from '../_images/plus.svg';

@connect(selector, (dispatch) => ({
  deleteCrop: bindActionCreators(actions.deleteCrop, dispatch),
  loadCrop: bindActionCreators(actions.fetchCrop, dispatch),
  loadCrops: bindActionCreators(actions.loadCrops, dispatch),
  persistCrop: bindActionCreators(actions.persistCrop, dispatch),
  selectFrame: bindActionCreators(actions.selectFrame, dispatch),
  getKeyScenes: bindActionCreators(actions.getKeyScenes, dispatch)
}))
@Radium
@PureRender
export default class Crops extends Component {

  static propTypes = {
    crops: ImmutablePropTypes.map.isRequired,
    currentLocale: PropTypes.string.isRequired,
    currentScene: ImmutablePropTypes.map,
    currentVideoId: PropTypes.string.isRequired,
    deleteCrop: PropTypes.func.isRequired,
    getKeyScenes: PropTypes.func.isRequired,
    loadCrop: PropTypes.func.isRequired,
    loadCrops: PropTypes.func.isRequired,
    persistCrop: PropTypes.func.isRequired,
    selectFrame: PropTypes.func.isRequired,
    style: PropTypes.object,
    supportedLocales: PropTypes.array
  };

  constructor (props) {
    super(props);
    this.onAddSpott = ::this.onAddSpott;
    this.onDeleteCrop = ::this.onDeleteCrop;
    this.onEditCrop = ::this.onEditCrop;
    this.onPersistCrop = ::this.onPersistCrop;
    this.onSelectFrame = ::this.onSelectFrame;
  }

  componentDidMount () {
    const currentVideoId = this.props.currentVideoId;
    this.props.loadCrops();
    this.props.getKeyScenes(currentVideoId);
  }

  onAddSpott (e) {
    e.preventDefault();
    this.setState({ modal: 'selectFrame' });
  }

  async onDeleteCrop (cropId) {
    await this.props.deleteCrop({ cropId });
    await this.props.loadCrops();
  }

  onSelectFrame ({ sceneId }) {
    this.props.selectFrame({ sceneId });
    this.setState({ modal: 'createCrop' });
  }

  async onPersistCrop (crop) {
    await this.props.persistCrop(crop);
    await this.props.loadCrops();
  }

  async onEditCrop (cropId) {
    const crop = await this.props.loadCrop({ cropId });
    this.props.selectFrame({ sceneId: crop.sceneId });
    this.setState({ crop, modal: 'editCrop' });
  }

  static styles = {
    container: {
      backgroundColor: '#000',
      outline: 0,
      position: 'relative'
    },
    scenes: {
      listContainer: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        paddingLeft: '2.5em', // + 5px padding of the scene image
        paddingRight: '1.5em', // + 5px padding of the scene image
        // Add some margin to top and bottom to prevent the scrollbar reaching the
        // very top/bottom
        marginBottom: '2em',
        marginTop: '2em',
        marginLeft: '-1em',
        overflow: 'scroll',
        paddingBottom: '2em'
      },
      list: {
        position: 'relative',
        paddingLeft: 0,
        marginTop: 0,
        listStyle: 'none'
      },
      listInner: {
        height: '100%',
        paddingRight: 20,
        marginRight: -20
      }
    },
    info: {
      base: {
        marginLeft: '0.7em',
        marginBottom: '1em'
      },
      title: {
        base: {
          color: '#fff',
          fontSize: '1.25em',
          fontWeight: 'normal',
          paddingBottom: '0.25em'
        },
        emph: {
          fontWeight: 600
        }
      },
      subtitle: {
        color: colors.warmGray,
        fontSize: '0.75em'
      }
    },
    addCropButton: {
      alignItems: 'center',
      border: 'dashed 1px #cacaca',
      borderRadius: 2,
      cursor: 'pointer',
      display: 'flex',
      height: '100%',
      justifyContent: 'center'
    },
    addCropContainer: {
      height: '14em',
      padding: '0.438em',
      width: '14em'
    }
  };

  render () {
    const styles = this.constructor.styles;
    const { crops, currentLocale, currentScene, supportedLocales } = this.props;
    const crop = this.state.crop;

    return (
      <div style={[ styles.container, this.props.style ]}>
        <div style={styles.scenes.listContainer}>
          <div style={styles.info.base}>
            <h1 style={styles.info.title.base}><span style={styles.info.title.emph}>Add crops</span></h1>
            <h2 style={styles.info.subtitle}>Create crops to single-out the most interesting parts of the frames</h2>
          </div>
          <Masonry>
            <div style={styles.addCropContainer}>
              <div style={styles.addCropButton} onClick={this.onAddSpott}>
                <img src={plusIcon}/>
              </div>
            </div>
            {crops.get('data').map((c) => (
              <Crop
                crop={c}
                key={c.get('id')}
                onDelete={this.onDeleteCrop}
                onEdit={this.onEditCrop}/>))}
          </Masonry>
        </div>
        {/* Render bottom bar. */}
        <BottomBar info={`${crops.get('data').size} crops`} />
        {/* Render modals. */}
        {this.state.modal === 'selectFrame' &&
          <SelectFrame
            onClose={() => this.state.modal === 'selectFrame' && this.setState({ modal: null })}
            onSubmit={this.onSelectFrame}/>}
        {this.state.modal === 'createCrop' &&
          <PersistCrop
            currentScene={currentScene}
            initialValues={{
              _activeLocale: currentLocale,
              defaultLocale: currentLocale,
              locales: [ currentLocale ],
              sceneId: currentScene.get('id')
            }}
            submitButtonText='Create'
            title='Create crop'
            onClose={() => this.setState({ modal: null })}
            onSubmit={this.onPersistCrop}/>}
        {this.state.modal === 'editCrop' &&
          <PersistCrop
            currentScene={currentScene}
            edit
            initialValues={{
              ...crop,
              _activeLocale: crop.defaultLocale,
              cropId: crop.id,
              topicIds: crop.topics && crop.topics.map(({ id }) => id)
            }}
            submitButtonText='Save'
            title='Edit crop'
            onClose={() => this.setState({ modal: null })}
            onSubmit={this.onPersistCrop}/>}
      </div>
    );
  }
}
