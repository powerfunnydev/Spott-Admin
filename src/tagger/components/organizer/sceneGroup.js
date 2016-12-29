/* eslint-disable react/no-set-state */
import React, { Component, PropTypes } from 'react';
import Radium from 'radium';
import ImmutablePropTypes from 'react-immutable-proptypes';
import colors from '../colors';
import Arrow from './images/arrow';
import Cross from './images/cross';

@Radium
export default class SceneGroup extends Component {

  static propTypes = {
    children: PropTypes.node.isRequired,
    hidden: PropTypes.bool,
    number: PropTypes.number.isRequired,
    sceneGroup: ImmutablePropTypes.map.isRequired,
    onRemove: PropTypes.func,
    onSubmit: PropTypes.func.isRequired,
    onToggleVisibility: PropTypes.func.isRequired
  };

  constructor (props) {
    super(props);
    this.onBlurLabel = ::this.onBlurLabel;
    this.onChangeLabel = ::this.onChangeLabel;
    this.onRemove = ::this.onRemove;
    this.onToggleVisibility = ::this.onToggleVisibility;
    this.state = {
      hovered: {},
      label: props.sceneGroup.get('label')
    };
  }

  // Update the label if there is the scene group has a new number or label.
  componentWillReceiveProps (newProps) {
    if (this.props.sceneGroup.get('label') !== newProps.sceneGroup.get('label') ||
      this.props.number !== newProps.number) {
      this.setState({ ...this.state, label: newProps.sceneGroup.get('label') || `Scene ${newProps.number}` });
    }
  }

  onBlurLabel (e) {
    const sceneGroup = this.props.sceneGroup;
    e.preventDefault();
    this.props.onSubmit({
      ...sceneGroup.toJS(),
      label: this.state.label
    });
  }

  onChangeLabel (e) {
    e.preventDefault();
    this.setState({ ...this.state, label: e.target.value });
  }

  onRemove (e) {
    e.preventDefault();
    this.props.onRemove();
  }

  onToggleVisibility (e) {
    e.preventDefault();
    this.props.onToggleVisibility();
  }

  // When hovering the title, visibility button, or remove button,
  // the title gets highlighted and the button can be highlighted extra.
  onMouseEnter (key, e) {
    e.preventDefault();
    this.setState({
      ...this.state,
      hovered: {
        ...this.state.hovered,
        [key]: true,
        label: true
      }
    });
  }

  // When leaving the title, visibility button, or remove button,
  // the title section loses focus and all hovered statusses become falsy.
  onMouseLeave (key, e) {
    e.preventDefault();
    this.setState({
      ...this.state,
      hovered: {}
    });
  }

  static styles = {
    line: {
      base: {
        height: '0.125em',
        borderRadius: '6.25em',
        backgroundColor: colors.black3,
        width: '100%'
      },
      highlight: {
        backgroundColor: colors.warmGray
      }
    },
    titleContainer: {
      alignItems: 'center',
      display: 'flex',
      marginBottom: '1.25em',
      marginTop: '1.25em',
      paddingLeft: 15,
      paddingRight: 4
    },
    title: {
      base: {
        backgroundColor: 'transparent',
        border: 'none',
        color: colors.warmGray,
        fontFamily: 'Rubik-Regular',
        fontSize: '0.75em',
        fontWeight: 500,
        textAlign: 'center',
        marginLeft: '0.625em',
        marginRight: '0.625em'
      },
      highlight: {
        color: colors.veryLightGray
      }
    },
    removeButton: {
      // marginLeft: '0.875em',
      height: '0.75em',
      width: '0.75em'
    },
    visibilityButton: {
      // marginRight: '0.875em',
      // center
      paddingTop: '0.188em',
      height: '0.75em',
      width: '0.75em'
    },
    arrowDown: {
      width: '100%'
    },
    cross: {
      width: '100%'
    },
    side: {
      width: '3em'
    },
    sideRight: {
      textAlign: 'right'
    }
  }

  render () {
    const { children, hidden, onRemove } = this.props;
    const { hovered } = this.state;
    const styles = this.constructor.styles;
    return (
      <div>
        <div style={styles.titleContainer} onMouseEnter={this.onMouseEnter.bind(this, 'title')} onMouseLeave={this.onMouseLeave.bind(this, 'title')}>
          <div style={styles.side}>
            <button style={styles.visibilityButton} title='Toggle visibility' onClick={this.onToggleVisibility} onMouseEnter={this.onMouseEnter.bind(this, 'visibility')} onMouseLeave={this.onMouseLeave.bind(this, 'visibility')}>
              <Arrow color={(hovered.visibility && '#fff') || (hovered.title && colors.warmGray) || colors.black4} position={hidden ? 'UP' : 'DOWN'} />
            </button>
          </div>
          <div style={[ styles.line.base, hovered.title && styles.line.highlight ]} />
          <div>
            <input style={[ styles.title.base, hovered.title && styles.title.highlight ]} value={this.state.label} onBlur={this.onBlurLabel} onChange={this.onChangeLabel} />
          </div>
          <div style={[ styles.line.base, hovered.title && styles.line.highlight ]} />
          {onRemove
            ? <div style={[ styles.side, styles.sideRight ]}>
                <button style={styles.removeButton} title='Remove Scene' onClick={this.onRemove} onMouseEnter={this.onMouseEnter.bind(this, 'remove')} onMouseLeave={this.onMouseLeave.bind(this, 'remove')}>
                  <Cross color={(hovered.remove && '#fff') || (hovered.title && colors.warmGray) || colors.black4} />
                </button>
              </div>
            : <div style={[ styles.line.base, hovered.title && styles.line.highlight, styles.side ]} />}
        </div>
        {!hidden && children}
      </div>
    );
  }
}
