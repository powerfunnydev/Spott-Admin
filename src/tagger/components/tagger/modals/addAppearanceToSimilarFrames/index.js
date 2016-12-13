import Radium from 'radium';
import React, { Component, PropTypes } from 'react';
import ReactModal from 'react-modal';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import ImmutablePropTypes from 'react-immutable-proptypes';
import Scene from './scene';
import * as appearanceActions from '../../../../actions/appearance';
import * as sceneActions from '../../../../actions/scene';
import addAppearanceToSimilarFramesSelector from '../../../../selectors/addAppearanceToSimilarFrames';
import { buttonStyle, dialogStyle, modalStyle } from '../styles';

@connect(addAppearanceToSimilarFramesSelector, (dispatch) => ({
  selectSimilarScene: bindActionCreators(sceneActions.selectSimilarScene, dispatch),
  onCancel: bindActionCreators(appearanceActions.addAppearanceToSimilarFramesCancel, dispatch),
  onSubmit: bindActionCreators(appearanceActions.addAppearanceToSimilarFrames, dispatch)
}))
@Radium
export default class AddAppearanceToSimilarFrames extends Component {

  static propTypes = {
    isSimilarScenes: ImmutablePropTypes.map.isRequired,
    scenes: ImmutablePropTypes.list.isRequired,
    selectSimilarScene: PropTypes.func.isRequired,
    title: PropTypes.string,
    onCancel: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired
  };

  constructor (props) {
    super(props);
    this.onCancel = ::this.onCancel;
    this.onRequestClose = ::this.onRequestClose;
    this.onSubmit = ::this.onSubmit;
  }

  onCancel (e) {
    e.preventDefault();
    this.props.onCancel();
  }

  onRequestClose () {
    this.props.onCancel();
  }

  onSubmit (e) {
    e.preventDefault();
    this.props.onSubmit();
  }

  static styles = {
    header: {
      borderBottom: '1px solid rgb(232,232,232)',
      fontFamily: 'Rubik-Regular',
      fontWeight: 'normal',
      paddingBottom: 20,
      paddingLeft: 34,
      paddingRight: 34,
      paddingTop: 20
    },
    content: {
      paddingRight: 12
    },
    emph: {
      fontWeight: 'bold'
    },
    scenes: {
      height: 300,
      overflowY: 'auto'
    },
    subtitle: {
      paddingBottom: 0,
      paddingTop: 0
    }
  }

  renderScenes () {
    // scenes is a List of scene Maps (as shown in the scene selector)
    // isSimilarScenes is a Map of <sceneId, isSimilar> of scenes which are not hidden.
    const { isSimilarScenes, scenes, selectSimilarScene } = this.props;
    const result = scenes.reduce((similarScenesComponents, scene) => {
      const sceneId = scene.get('id');
      const isSelected = isSimilarScenes.get(sceneId);
      if (typeof isSelected === 'boolean') {
        similarScenesComponents.push(
          <Scene
            isSelected={isSelected}
            key={scene.get('id')}
            scene={scene}
            onClickScene={selectSimilarScene} />
        );
      }
      return similarScenesComponents;
    }, []);
    return result;
  }

  render () {
    const styles = this.constructor.styles;
    const { isSimilarScenes, title, onSubmit } = this.props;
    const numberOfSelectedScenes = isSimilarScenes.reduce((total, isSelected) => isSelected ? total + 1 : total, 0);

    return (
      <ReactModal
        isOpen
        style={dialogStyle}
        onRequestClose={this.onRequestClose}>
        <form noValidate onSubmit={onSubmit}>
          <div style={styles.header}>
            <h1 style={modalStyle.title}>Add to similar frames</h1>
            <h3 style={[ modalStyle.subtitle, styles.subtitle ]}>Where does <span style={styles.emph}>{title}</span> appear?</h3>
          </div>

          <div style={[ modalStyle.content, styles.content ]}>
            <div style={styles.scenes}>
              {this.renderScenes()}
            </div>
          </div>

          <div style={modalStyle.footer}>
            <button key='cancel' style={[ buttonStyle.base, buttonStyle.cancel ]} onClick={this.onCancel}>No thanks</button>
            <button key='save' style={[ buttonStyle.base, buttonStyle.save ]} onClick={this.onSubmit}>
              {numberOfSelectedScenes > 0 ? `Add to ${numberOfSelectedScenes} more frames` : 'Add to no frames'}
            </button>
          </div>
        </form>
      </ReactModal>
    );
  }
}
