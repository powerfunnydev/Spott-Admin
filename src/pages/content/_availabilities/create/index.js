import React, { Component, PropTypes } from 'react';
import { reduxForm, Field, SubmissionError } from 'redux-form/immutable';
import ImmutablePropTypes from 'react-immutable-proptypes';
import Radium from 'radium';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { FormSubtitle } from '../../../_common/styles';
import TextInput from '../../../_common/inputs/textInput';
import DateInput from '../../../_common/inputs/dateInput';
import TimeInput from '../../../_common/inputs/timeInput';
import SelectInput from '../../../_common/inputs/selectInput';
import CreateModal from '../../../_common/createModal';
// import { load } from '../list/actions';
// import * as actions from './actions';
import { routerPushWithReturnTo } from '../../../../actions/global';
import timezones, { timezoneKeys } from '../../../../constants/timezones';
import selector from './selector';

// function validate (values, { t }) {
//   const validationErrors = {};
//   const { defaultLocale, title } = values.toJS();
//   if (!defaultLocale) { validationErrors.defaultLocale = t('common.errors.required'); }
//   if (!title) { validationErrors.title = t('common.errors.required'); }
//   // Done
//   return validationErrors;
// }
const noop = () => 'test';

@connect(selector, (dispatch) => ({
  load: noop, // bindActionCreators(load, dispatch),
  submit: noop, // bindActionCreators(actions.submit, dispatch),
  routerPushWithReturnTo: bindActionCreators(routerPushWithReturnTo, dispatch)
}))
@reduxForm({
  form: 'createAvailability'
  // validate
})
@Radium
export default class CreateAvailabilityModal extends Component {

  static propTypes = {
    countries: ImmutablePropTypes.map.isRequired,
    error: PropTypes.any,
    handleSubmit: PropTypes.func.isRequired,
    initialize: PropTypes.func.isRequired,
    load: PropTypes.func.isRequired,
    location: PropTypes.object.isRequired,
    routerPushWithReturnTo: PropTypes.func.isRequired,
    submit: PropTypes.func.isRequired,
    t: PropTypes.func.isRequired
  };

  constructor (props) {
    super(props);
    this.onCloseClick = ::this.onCloseClick;
    this.submit = ::this.submit;
  }

  componentWillMount () {
    this.props.initialize({
      defaultLocale: this.props.currentLocale
    });
  }

  async submit (form) {
    try {
      await this.props.submit(form.toJS());
      // Load the new list of items, using the location query of the previous page.
      const location = this.props.location && this.props.location.state && this.props.location.state.returnTo;
      if (location && location.query) {
        this.props.load(location.query);
      }
      this.onCloseClick();
    } catch (error) {
      throw new SubmissionError({ _error: 'common.errors.unexpected' });
    }
  }

  onCloseClick () {
    const location = this.props.location;
    this.props.routerPushWithReturnTo({
      ...this.props.location,
      pathname: location.pathname.substring(0, location.pathname.indexOf('/create/availability'))
    }, true);
  }

  static styles = {
    col2: {
      display: 'flex',
      flexDirection: 'row'
    }
  };

  render () {
    const styles = this.constructor.styles;
    const { countries, handleSubmit } = this.props;
    return (
      <CreateModal isOpen title='Add Availability' onClose={this.onCloseClick} onSubmit={handleSubmit(this.submit)}>
        <Field
          component={SelectInput}
          first
          getItemText={(countryId) => countries.getIn([ countryId, 'name' ])}
          label='Country'
          name='country'
          options={countries.keySeq().toArray()}
          placeholder='Country'
          required />
        <Field
          component={SelectInput}
          getItemText={(timezoneKey) => timezones[timezoneKey]}
          label='Timezone'
          name='timezone'
          options={timezoneKeys}
          placeholder='Country'
          required />
        <div style={styles.col2}>
          <Field
            component={DateInput}
            label='Start'
            name='startDate'
            required
            style={{ flex: 1, paddingRight: '0.313em' }} />
          <Field
            component={TimeInput}
            name='startTime'
            required
            style={{ flex: 1, paddingLeft: '0.313em' }} />
        </div>
        <div style={styles.col2}>
          <Field
            component={DateInput}
            label='End'
            name='endDate'
            required
            style={{ flex: 1, paddingRight: '0.313em' }} />
          <Field
            component={TimeInput}
            name='endTime'
            required
            style={{ flex: 1, paddingLeft: '0.313em' }} />
        </div>
      </CreateModal>
    );
  }

}
