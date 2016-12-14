import Radium from 'radium';
import React, { Component, PropTypes } from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
const crossImage = require('../images/cross.svg');

@Radium
export default class Character extends Component {

  static propTypes = {
    character: ImmutablePropTypes.map,
    field: PropTypes.object.isRequired
  };

  constructor (props) {
    super(props);
    this.onClick = ::this.onClick;
  }

  onClick (e) {
    e.preventDefault();
    this.props.field.onChange(this.props.character && this.props.character.get('id'));
  }

  static styles = {
    border: {
      base: {
        border: '2px solid white',
        borderRadius: '100%',
        cursor: 'pointer',
        height: 50,
        marginRight: 5,
        padding: 3,
        width: 50
      },
      checked: {
        border: '2px solid rgb(0, 115, 211)'
      }
    },
    character: {
      base: {
        backgroundColor: 'white',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'contain',
        borderRadius: '100%',
        cursor: 'pointer',
        flex: '0 0 auto',
        height: 40,
        width: 40
      }
    },
    noCharacter: {
      base: {
        background: 'rgb(220, 222, 223)',
        borderRadius: '50%',
        height: 40,
        paddingLeft: 14,
        paddingTop: 12,
        width: 40
      },
      cross: {
        height: 12,
        textAlign: 'center',
        width: 12
      }
    }
  };

  render () {
    const styles = this.constructor.styles;
    const { character, field } = this.props;

    // Render a circle with in it a visualisation (photo) of the character
    if (character) {
      const checked = field.value === character.get('id');
      return (
        <div style={[ styles.border.base, checked && styles.border.checked ]} onClick={this.onClick}>
          <div style={[ styles.character.base, { backgroundImage: `url('${character.get('portraitImageUrl')}?width=70&height=70')` } ]}></div>
        </div>
      );
    }

    // Render a cross in a placeholder for a character, representing the
    // option "not associated with any character".
    const checked = !field.value;
    return (
      <div style={[ styles.border.base, checked && styles.border.checked ]} onClick={this.onClick}>
        <div style={styles.noCharacter.base}>
          <img src={crossImage} style={styles.noCharacter.cross} />
        </div>
      </div>
    );
  }
}
