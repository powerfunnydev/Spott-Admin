import React, { Component, PropTypes } from 'react';
import { reduxForm, Field } from 'redux-form/immutable';
import ImmutablePropTypes from 'react-immutable-proptypes';
import Radium from 'radium';
import SelectInput from '../../../../_common/inputs/selectInput';
import PersistModal from '../../../../_common/components/persistModal';
import localized from '../../../../_common/decorators/localized';

/* eslint-disable react/no-set-state */

function validate (values, { t }) {
  const validationErrors = {};
  const { characterId } = values.toJS();
  if (!characterId) { validationErrors.characterId = t('common.errors.required'); }
  // Done
  return validationErrors;
}
@localized
@reduxForm({
  form: 'character',
  validate
})
@Radium
export default class CharacterModal extends Component {

  static propTypes = {
    charactersById: ImmutablePropTypes.map.isRequired,
    edit: PropTypes.bool,
    error: PropTypes.any,
    handleSubmit: PropTypes.func.isRequired,
    searchCharacters: PropTypes.func.isRequired,
    searchedCharacterIds: ImmutablePropTypes.map.isRequired,
    onClose: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired
  };

  constructor (props) {
    super(props);
    this.onCloseClick = ::this.onCloseClick;
    this.submit = ::this.submit;
    this.clearPopUpMessage = :: this.clearPopUpMessage;
    this.state = {};
  }

  clearPopUpMessage () {
    this.setState({});
  }

  async submit (form) {
    try {
      await this.props.onSubmit(form.toJS());
      this.onCloseClick();
    } catch (error) {
      if (error.name === 'BadRequestError') {
        this.setState({ popUpMessage: { message: error.body.message, type: 'info' } });
      }
    }
  }

  onCloseClick () {
    this.props.onClose();
  }

  static styles = {
    col2: {
      display: 'flex',
      flexDirection: 'row'
    }
  };

  render () {
    // const { styles } = this.constructor;
    const { edit, handleSubmit, searchCharacters, searchedCharacterIds, charactersById } = this.props;
    return (
      <PersistModal
        clearPopUpMessage={this.clearPopUpMessage}
        isOpen
        popUpObject={this.state.popUpMessage}
        submitButtonText={edit ? 'Save' : 'Add'}
        title={edit ? 'Edit Character' : 'Add Character'}
        onClose={this.onCloseClick}
        onSubmit={handleSubmit(this.submit)}>
        <Field
          component={SelectInput}
          first
          getItemText={(characterId) => charactersById.getIn([ characterId, 'name' ])}
          getOptions={searchCharacters}
          label='Character'
          name='characterId'
          options={searchedCharacterIds.get('data').toArray()}
          placeholder='Character'
          required />
      </PersistModal>
    );
  }

}
