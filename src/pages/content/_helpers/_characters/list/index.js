/* eslint-disable react/no-set-state */
import React, { Component, PropTypes } from 'react';
import Radium from 'radium';
import ImmutablePropTypes from 'react-immutable-proptypes';
// import { Field } from 'redux-form/immutable';
// import { fromJS } from 'immutable';
import Section from '../../../../_common/components/section';
import { Table, CustomCel, Rows, Row } from '../../../../_common/components/table/index';
import { colors, fontWeights, makeTextStyle, FormSubtitle, FormDescription } from '../../../../_common/styles';
import Plus from '../../../../_common/images/plus';
// import EditButton from '../../../../_common/buttons/editButton';
import RemoveButton from '../../../../_common/buttons/removeButton';
import PersistCharacterModal from '../persist';

@Radium
export default class Characters extends Component {

  static propTypes = {
    characters: ImmutablePropTypes.list.isRequired,
    charactersById: ImmutablePropTypes.map.isRequired,
    searchCharacters: PropTypes.func.isRequired,
    searchedCharacterIds: ImmutablePropTypes.map.isRequired
  };

  constructor (props) {
    super(props);
    this.persistCharacter = ::this.persistCharacter;
    this.onClickNewEntry = ::this.onClickNewEntry;
    this.getCharacter = ::this.getCharacter;
    this.state = {
      create: false,
      edit: false
    };
  }

  // Transform the date + time + timezone to one date
  transformCharacter ({ countryId, endDate, endTime, startDate, startTime, timezone, videoStatus }) {
    return {

    };
  }

  persistCharacter (index, data) {
    /* const character = this.transformCharacter(data);
    this.props.fields.remove(index);
    this.props.fields.insert(index, fromJS(character));*/
  }

  getCharacter (index) {
  //  const { characterFrom, characterTo, countryId, videoStatus } = this.props.characters.get(index).toJS();
    return {};
  }

  onClickNewEntry (e) {
    e.preventDefault();
    this.setState({ create: true });
  }

  onSubmit (form) {
    const { characterId } = form;
    console.log('character', characterId);
  }

  static styles = {
    add: {
      ...makeTextStyle(fontWeights.medium, '0.75em'),
      color: colors.primaryBlue,
      flex: 8,
      justifyContent: 'center',
      backgroundColor: 'rgba(244, 245, 245, 0.5)'
    },
    editButton: {
      marginRight: '0.75em'
    },
    description: {
      marginBottom: '1.25em'
    },
    image: {
      width: '2em',
      height: '2em',
      objectFit: 'scale-down'
    },
    adaptedCustomCel: {
      fontSize: '11px',
      paddingTop: '4px',
      paddingBottom: '4px',
      paddingLeft: '0px',
      minHeight: '30px'
    },
    paddingLeft: {
      paddingLeft: '11px'
    },
    adaptedRows: {
      minHeight: '3.75em'
    },
    floatRight: {
      marginLeft: 'auto'
    },
    customTable: {
      border: `1px solid ${colors.lightGray2}`
    }
  };

  render () {
    const styles = this.constructor.styles;
    const { characters, searchCharacters, charactersById, searchedCharacterIds } = this.props;
    return (
      <Section>
        <FormSubtitle first>Character</FormSubtitle>
        <FormDescription style={styles.description}>Which characters are starring in this content? This way we’ll do a better job detecting their faces automagically!</FormDescription>
        <Table style={styles.customTable}>
          <Rows style={styles.adaptedRows}>
            {characters.map((character, index) => {
              return (
                <Row isFirst={index === 0} key={index} >
                  <CustomCel style={[ styles.adaptedCustomCel, styles.paddingLeft ]}>
                    <img src={character.getIn([ 'image', 'url' ])} style={styles.image}/>
                  </CustomCel>
                  <CustomCel style={styles.adaptedCustomCel}>{character.get('name')}</CustomCel>
                  <CustomCel style={[ styles.adaptedCustomCel, styles.floatRight ]}>
                    <RemoveButton cross onClick={() => {}}/>
                  </CustomCel>
                </Row>
              );
            })}
            <Row isFirst={characters.size === 0} >
              <CustomCel style={[ styles.add, styles.adaptedCustomCel ]} onClick={this.onClickNewEntry}>
                <Plus color={colors.primaryBlue} />&nbsp;&nbsp;&nbsp;Add Character
              </CustomCel>
            </Row>
          </Rows>
          {this.state.create &&
            <PersistCharacterModal
              charactersById={charactersById}
              searchCharacters={searchCharacters}
              searchedCharacterIds={searchedCharacterIds}
              onClose={() => this.setState({ create: false })}
              onSubmit={this.onSubmit} />}
        </Table>
      </Section>
    );
  }

}
