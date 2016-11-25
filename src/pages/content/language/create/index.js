import React, { Component, PropTypes } from 'react';
import { reduxForm, Field } from 'redux-form/immutable';
import ImmutablePropTypes from 'react-immutable-proptypes';
import Radium from 'radium';
import { connect } from 'react-redux';
import { FormSubtitle } from '../../../_common/styles';
import CreateModal from '../../../_common/createModal';
import SelectInput from '../../../_common/inputs/selectInput';
import selector from './selector';
import localized from '../../../_common/localized';
import { bindActionCreators } from 'redux';
import { routerPushWithReturnTo } from '../../../../actions/global';

function validate (values, { t }) {
  const validationErrors = {};
  const { language } = values.toJS();
  if (!language) { validationErrors.name = t('common.errors.required'); }
  // Done
  return validationErrors;
}

@localized
@connect(selector, (dispatch) => ({
  routerPushWithReturnTo: bindActionCreators(routerPushWithReturnTo, dispatch)
}))
@reduxForm({
  form: 'addLanguage',
  validate
})
@Radium
export default class CreateBroadcasterEntryModal extends Component {

  static propTypes = {
    handleSubmit: PropTypes.func.isRequired,
    localeNames: ImmutablePropTypes.map.isRequired,
    routerPushWithReturnTo: PropTypes.func.isRequired
  };

  constructor (props) {
    super(props);
    this.onCloseClick = ::this.onCloseClick;
  }

  async submit (form) {

  }

  onCloseClick () {
    this.props.routerPushWithReturnTo('/', true);
  }

  render () {
    const { localeNames, handleSubmit } = this.props;
    return (
      <CreateModal isOpen title='Add language' onClose={this.onCloseClick} onSubmit={handleSubmit(this.submit)}>
        <Field
          component={SelectInput}
          getItemText={(language) => (localeNames.get(language))}
          getOptions={(language) => localeNames.keySeq().toArray()}
          label= 'Add language'
          name='language'
          options={localeNames.keySeq().toArray()}
          placeholder='Language'/>
      </CreateModal>
    );
  }

}
