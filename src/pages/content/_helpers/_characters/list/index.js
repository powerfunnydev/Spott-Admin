/* eslint-disable react/no-set-state */
import React, { Component, PropTypes } from 'react';
import Radium from 'radium';
import ImmutablePropTypes from 'react-immutable-proptypes';
// import { Field } from 'redux-form/immutable';
// import { fromJS } from 'immutable';
import Section from '../../../../_common/components/section';
// import { headerStyles, Table, Headers, CustomCel, Rows, Row } from '../../../../_common/components/table/index';
import { colors, fontWeights, makeTextStyle, FormSubtitle, FormDescription } from '../../../../_common/styles';
import Plus from '../../../../_common/images/plus';
// import EditButton from '../../../../_common/buttons/editButton';
// import RemoveButton from '../../../../_common/buttons/removeButton';
import PersistCharacterModal from '../persist';

@Radium
export default class Characters extends Component {

  static propTypes = {
    characters: ImmutablePropTypes.list.isRequired,
    fields: PropTypes.object.isRequired
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
    }
  };

  render () {
    const styles = this.constructor.styles;
    const { fields } = this.props;
    console.log('props', this.props);
    return (
      <Section>
        <FormSubtitle first>Character</FormSubtitle>
        <FormDescription style={styles.description}>Which characters are starring in this content? This way we’ll do a better job detecting their faces automagically!</FormDescription>
        {fields.map((character, index) => {
          return (
            <div>
            test
            </div>
          );
        })}
        <div style={styles.add} onClick={this.onClickNewEntry}>
          <Plus color={colors.primaryBlue} />&nbsp;&nbsp;&nbsp;Add character
        </div>
        {this.state.create &&
          <PersistCharacterModal
            initialValues={{

            }}
            onClose={() => this.setState({ create: false })}
            onSubmit={this.persistCharacter.bind(this, this.props.fields.length)} />}
        {typeof this.state.edit === 'number' &&
          <PersistCharacterModal
            edit
            initialValues={this.getCharacter(this.state.edit)}
            onClose={() => this.setState({ edit: false })}
            onSubmit={this.persistCharacter.bind(this, this.state.edit)} />}
      </Section>
    );
  }

}
