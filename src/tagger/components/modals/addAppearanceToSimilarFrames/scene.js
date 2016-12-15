import Radium from 'radium';
import React, { Component, PropTypes } from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';

const checkIcon = require('../images/check.svg');

@Radium
export default class Scene extends Component {

  static propTypes = {
    isSelected: PropTypes.bool.isRequired,
    scene: ImmutablePropTypes.map.isRequired,
    onClickScene: PropTypes.func.isRequired
  };

  constructor (props) {
    super(props);
    this.onClickScene = ::this.onClickScene;
  }

  onClickScene (e) {
    e.preventDefault();
    this.props.onClickScene(this.props.scene);
  }

  static styles= {
    container: {
      display: 'inline-block',
      padding: 5,
      transition: 'width 0.5s ease-in-out',
      width: '33.33333333%'
    },
    selectedIcon: {
      position: 'absolute',
      backgroundImage: `url('${checkIcon}')`,
      backgroundRepeat: 'no-repeat',
      top: -5,
      right: -5,
      width: 20,
      height: 20
    },
    content: {
      base: {
        backgroundColor: '#fff',
        backgroundSize: '100% 100%',
        cursor: 'pointer',
        position: 'relative',
        width: '100%',
        WebkitFilter: 'brightness(80%)',
        transition: 'filter 0.3s ease-in-out',
        ':hover': {
          WebkitFilter: 'brightness(130%)'
        }
      }
    },
    sceneNumber: {
      color: '#fff',
      fontFamily: 'Rubik-Regular',
      fontSize: '11px',
      textShadow: '1px 1px 0px rgba(0, 0, 0, 0.7)',
      position: 'absolute',
      right: 8,
      bottom: 6
    }
  };

  render () {
    const styles = this.constructor.styles;
    const { scene, isSelected } = this.props;

    return (
      <li key={scene.get('id')} style={[ styles.container ]}>
        <div
          role='button'
          style={[ styles.content.base, { paddingBottom: '60%' }, { backgroundImage: `url('${scene.get('imageUrl')}?width=160&height=90')` } ]}
          onClick={this.onClickScene}>

          {isSelected && <div style={styles.selectedIcon} />}

          {/* Render the scene number */}
          <div style={styles.sceneNumber}>{scene.get('sceneNumber')}</div>

        </div>
      </li>
    );
  }

}
