/* eslint-disable react/no-set-state */
import React, { Component, PropTypes } from 'react';
import Radium from 'radium';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Section from '../../../../_common/components/section';
import { Table, CustomCel, Rows, Row } from '../../../../_common/components/table/index';
import { colors, fontWeights, makeTextStyle, FormSubtitle, FormDescription } from '../../../../_common/styles';
import Plus from '../../../../_common/images/plus';
import RemoveButton from '../../../../_common/components/buttons/removeButton';
import PersistCharacterModal from '../persist';
import * as actions from './actions';

@connect(null, (dispatch) => ({
  persistMediumCharacter: bindActionCreators(actions.persistMediumCharacter, dispatch),
  deleteMediumCharacter: bindActionCreators(actions.deleteMediumCharacter, dispatch)
}))
@Radium
export default class Characters extends Component {

  static propTypes = {
    charactersById: ImmutablePropTypes.map.isRequired,
    deleteMediumCharacter: PropTypes.func.isRequired,
    loadMediumCharacters: PropTypes.func.isRequired,
    mediumCharacterIds: ImmutablePropTypes.map.isRequired,
    mediumId: PropTypes.string.isRequired,
    persistMediumCharacter: PropTypes.func.isRequired,
    searchCharacters: PropTypes.func.isRequired,
    searchedCharacterIds: ImmutablePropTypes.map.isRequired
  };

  constructor (props) {
    super(props);
    this.onClickNewEntry = ::this.onClickNewEntry;
    this.onSubmit = :: this.onSubmit;
    this.state = {
      create: false,
      edit: false
    };
  }

  async componentWillMount () {
    const { loadMediumCharacters, mediumId } = this.props;
    await loadMediumCharacters(mediumId);
  }

  onClickNewEntry (e) {
    e.preventDefault();
    this.setState({ create: true });
  }

  async onClickDeleteMediumCharacter (characterId) {
    const { mediumId, loadMediumCharacters, deleteMediumCharacter } = this.props;
    await deleteMediumCharacter({ characterId, mediumId });
    await loadMediumCharacters(mediumId);
  }

  async onSubmit (form) {
    const { characterId } = form;
    const { loadMediumCharacters, persistMediumCharacter, mediumId } = this.props;
    await persistMediumCharacter({ characterId, mediumId });
    await loadMediumCharacters(mediumId);
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
    const { mediumCharacterIds, searchCharacters, charactersById, searchedCharacterIds } = this.props;
    return (
      <Section>
        <FormSubtitle first>Character</FormSubtitle>
        <FormDescription style={styles.description}>Which characters are starring in this content? This way we’ll do a better job detecting their faces automagically!</FormDescription>
        <Table style={styles.customTable}>
          <Rows style={styles.adaptedRows}>
            {mediumCharacterIds.get('data').map((character, index) => {
              return (
                <Row isFirst={index === 0} key={index} >
                  <CustomCel style={[ styles.adaptedCustomCel, styles.paddingLeft ]}>
                    <img src={character.get('portraitImage') && `${character.getIn([ 'portraitImage', 'url' ])}?height=70&width=70`} style={styles.image}/>
                  </CustomCel>
                  <CustomCel style={styles.adaptedCustomCel}>{character.get('name')}</CustomCel>
                  <CustomCel style={[ styles.adaptedCustomCel, styles.floatRight ]}>
                    <RemoveButton cross onClick={this.onClickDeleteMediumCharacter.bind(this, character.get('id'))}/>
                  </CustomCel>
                </Row>
              );
            })}
            <Row isFirst={mediumCharacterIds.get('data') && mediumCharacterIds.get('data').size === 0} >
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
