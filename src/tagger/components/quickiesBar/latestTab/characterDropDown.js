import Radium from 'radium';
import React, { Component, PropTypes } from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import DropDown from './dropdown';
import DropDownItem from './dropdown/item';
import { colors } from '../styles';

@Radium
export default class CharacterDropDown extends Component {

  static propTypes = {
    characters: ImmutablePropTypes.orderedSet.isRequired,
    currentCharacter: ImmutablePropTypes.map,
    onSelectCharacter: PropTypes.func.isRequired
  };

  static styles = {
    container: {
      base: {
      }
    },
    item: {
      base: {
        alignItems: 'center',
        cursor: 'pointer',
        display: 'flex',
        padding: '6px 20px 6px 20px',
        color: colors.lightGray,
        backgroundColor: colors.darkerGray,
        borderBottom: `1px solid ${colors.darkerGray}`,
        ':hover': {
          backgroundColor: colors.gray
        }
      },
      selected: {
        backgroundColor: colors.lighterGray,
        color: 'white'
      }
    },
    image: {
      flex: '0 0 auto',
      backgroundColor: colors.darkGray,
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center',
      backgroundSize: '25px 25px',
      borderRadius: '100%',
      cursor: 'pointer',
      marginRight: 10,
      width: 25,
      height: 25
    },
    name: {
      fontFamily: 'Rubik-Medium',
      fontSize: '14px',
      marginLeft: 9,
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap'
    }
  }

  render () {
    const { styles } = this.constructor;
    const { currentCharacter, characters, onSelectCharacter } = this.props;
    // Create a title with the shortkey (if shortkey is below 10 and index below 8).
    function getTitle (character, i) {
      const characterName = character && character.get('name');
      if (characterName) {
        return i < 8 ? `${i + 2} - ${characterName}` : characterName;
      }
      return i < 8 ? `${i + 2}` : '';
    }
    let characterIndex = 0;
    return (
      <DropDown
        label='All'
        selectedItemText={currentCharacter && currentCharacter.get('name')}>
        <DropDownItem
          key='all'
          style={[
            styles.item.base,
            !currentCharacter && styles.item.selected
          ]}
          onClick={onSelectCharacter.bind()}>
          <div style={[ styles.image, { backgroundColor: 'none' } ]} />
          <div
            style={styles.name}
            title='1 - Show all characters and products'>
            All
          </div>
        </DropDownItem>
        {characters.map((character) => {
          const title = getTitle(character, characterIndex++);

          return (
            <DropDownItem
              key={character.get('id')}
              style={[
                styles.item.base,
                currentCharacter === character && styles.item.selected
              ]}
              onClick={onSelectCharacter.bind(null, character.get('id'))}>
              <div
                style={[
                  styles.image,
                  character && { backgroundImage: `url('${character.get('portraitImageUrl')}?width=95&height=95')` }
                ]}
                title={title} />
              <div
                style={styles.name}
                title={title}>
                {character && character.get('name')}
              </div>
            </DropDownItem>
          );
        })}
      </DropDown>
    );
  }
}
