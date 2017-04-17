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
import * as actions from './actions';
import selector from './selector';

import plusIcon from '../_images/plus.svg';

@connect(selector, (dispatch) => ({
  loadCrops: bindActionCreators(actions.loadCrops, dispatch),
  persistCrop: bindActionCreators(actions.persistCrop, dispatch),
  selectFrame: bindActionCreators(actions.selectFrame, dispatch)
}))
@Radium
@PureRender
export default class Crops extends Component {

  static propTypes = {
    currentScene: ImmutablePropTypes.map,
    spotts: ImmutablePropTypes.list.isRequired,
    style: PropTypes.object
  };

  constructor (props) {
    super(props);
    this.onAddSpott = ::this.onAddSpott;
    this.onSelectFrame = ::this.onSelectFrame;
    this.onPersistCrop = ::this.onPersistCrop;
  }

  componentDidMount () {
    this.props.loadCrops();
  }

  onAddSpott (e) {
    e.preventDefault();
    this.setState({ modal: 'selectFrame' });
  }

  onSelectFrame ({ sceneId }) {
    console.warn('Select', sceneId);
    this.props.selectFrame({ sceneId });
    console.warn('set state');
    this.setState({ modal: 'createCrop' });
  }

  async onPersistCrop (crop) {
    console.warn('persist crop', crop);
    await this.props.persistCrop(crop);
    await this.props.loadCrops();
  }

  static styles = {
    container: {
      backgroundColor: '#000',
      outline: 0,
      position: 'relative'
      // paddingTop: '2em',
      // paddingBottom: '2em',
      // paddingLeft: '2.5em',
      // paddingRight: '2.5em'
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
    addSpottButton: {
      display: 'inline-block',
      border: 'dashed 1px #cacaca',
      borderRadius: 2,
      cursor: 'pointer',
      height: '12em',
      width: '12em',
      textAlign: 'center',
      verticalAlign: 'top'
    },
    crops: {
      columnGap: '0.875em',
      columnFill: 'initial'
    }
  };

  render () {
    const styles = this.constructor.styles;
    const { crops, currentLocale, currentScene, selectFrame, supportedLocales } = this.props;

    return (
      <div style={[ styles.container, this.props.style ]}>
        <div style={styles.scenes.listContainer}>
          <div style={styles.info.base}>
            <h1 style={styles.info.title.base}><span style={styles.info.title.emph}>Add crops</span></h1>
            <h2 style={styles.info.subtitle}>Create crops to single-out the most interesting parts of the frames</h2>
          </div>
          <Masonry>
            <div style={styles.addSpottButton} onClick={this.onAddSpott}>
              <img src={plusIcon}/>
            </div>
            {crops.get('data').map((crop) => (<Crop crop={crop} key={crop.get('id')} />))}
          </Masonry>

        </div>
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
      </div>
    );
  }
}
