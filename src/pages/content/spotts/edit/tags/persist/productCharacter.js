import Radium from 'radium';
import React, { Component, PropTypes } from 'react';
const crossImage = require('../../../../../../tagger/components/modals/images/cross.svg');

@Radium
export default class ProductCharacter extends Component {

  static propTypes = {
    empty: PropTypes.bool,
    entityType: PropTypes.string,
    id: PropTypes.string,
    imageUrl: PropTypes.string,
    input: PropTypes.object.isRequired,
    name: PropTypes.string.isRequired
  };

  constructor (props) {
    super(props);
    this.onClick = ::this.onClick;
  }

  onClick (e) {
    const { entityType, empty, id, input } = this.props;
    e.preventDefault();
    if (empty) {
      input.onChange(null);
    } else {
      input.onChange({ entityType, id });
    }
  }

  static styles = {
    character: {
      base: {
        backgroundColor: 'white',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'contain',
        border: '1px solid white',
        flex: '0 0 auto',
        height: 32,
        width: 32
      },
      selected: {
        border: '1px solid #09bbf0'
      }
    },
    noCharacter: {
      base: {
        background: 'rgb(220, 222, 223)',
        border: '1px solid white',
        height: 32,
        width: 32,
        padding: 5
      },
      cross: {
        height: 20,
        textAlign: 'center',
        width: 20
      },
      selected: {
        border: '1px solid #09bbf0'
      }
    },
    wrapper: {
      cursor: 'pointer',
      marginRight: 10,
      marginBottom: 10,
      position: 'relative'
    },
    overlay: {
      backgroundColor: 'rgba(8, 186, 240, 0.5)',
      position: 'absolute',
      top: 0,
      bottom: 0,
      left: 0,
      right: 0
    }
  };

  render () {
    const styles = this.constructor.styles;
    const { empty, id, imageUrl, input, name } = this.props;

    console.warn('Input', input.value);

    // Render a circle with in it a visualisation (photo) of the character
    if (!empty) {
      const selected = input.value && (input.value.id || (input.value.get && input.value.get('id'))) === id;
      return (
        <div style={styles.wrapper} title={name} onClick={this.onClick}>
          <div style={[ styles.character.base, { backgroundImage: `url('${imageUrl}?width=70&height=70')` }, selected && styles.character.selected ]} />
          {selected && <div style={styles.overlay} />}
        </div>

      );
    }

    // Render a cross in a placeholder for a character, representing the
    // option "not associated with any character".
    const selected = !input.value;
    return (
      <div style={styles.wrapper} title='Nobody' onClick={this.onClick}>
        <div style={[ styles.noCharacter.base, selected && styles.noCharacter.selected ]}>
          <img src={crossImage} style={styles.noCharacter.cross} />
        </div>
        {selected && <div style={styles.overlay} />}
      </div>
    );
  }
}
