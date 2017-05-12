import React, { Component, PropTypes } from 'react';
import Radium from 'radium';
import { reduxForm, Field, SubmissionError } from 'redux-form/immutable';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { FormSubtitle } from '../../../_common/styles';
import { slowdown } from '../../../../utils';
import TextInput from '../../../_common/inputs/textInput';
import localized from '../../../_common/decorators/localized';
import PersistModal from '../../../_common/components/persistModal';
import { routerPushWithReturnTo } from '../../../../actions/global';
import SelectInput from '../../../_common/inputs/selectInput';
import { FETCHING } from '../../../../constants/statusTypes';
import * as actions from './actions';
import selector from './selector';

function validate (values, { t }) {
  const validationErrors = {};
  const { brandId, defaultLocale, title } = values.toJS();
  if (!brandId) { validationErrors.brandId = t('common.errors.required'); }
  if (!defaultLocale) { validationErrors.defaultLocale = t('common.errors.required'); }
  if (!title) { validationErrors.title = t('common.errors.required'); }
  // Done
  return validationErrors;
}

@localized
@connect(selector, (dispatch) => ({
  loadCommercials: bindActionCreators(actions.loadCommercials, dispatch),
  submit: bindActionCreators(actions.submit, dispatch),
  routerPushWithReturnTo: bindActionCreators(routerPushWithReturnTo, dispatch),
  searchBrands: bindActionCreators(actions.searchBrands, dispatch)
}))
@reduxForm({
  form: 'commercialCreate',
  validate
})
@Radium
export default class CreateEpisodentryModal extends Component {

  static propTypes = {
    brandsById: ImmutablePropTypes.map.isRequired,
    change: PropTypes.func.isRequired,
    currentLocale: PropTypes.string.isRequired,
    dispatch: PropTypes.func.isRequired,
    error: PropTypes.any,
    handleSubmit: PropTypes.func.isRequired,
    initialize: PropTypes.func.isRequired,
    loadCommercials: PropTypes.func.isRequired,
    localeNames: ImmutablePropTypes.map.isRequired,
    location: PropTypes.object.isRequired,
    params: PropTypes.object.isRequired,
    routerPushWithReturnTo: PropTypes.func.isRequired,
    searchBrands: PropTypes.func.isRequired,
    searchedBrandIds: ImmutablePropTypes.map.isRequired,
    submit: PropTypes.func.isRequired,
    t: PropTypes.func.isRequired,
    untouch: PropTypes.func.isRequired
  };

  constructor (props) {
    super(props);
    this.submit = ::this.submit;
    this.onCloseClick = ::this.onCloseClick;
    this.searchBrands = slowdown(props.searchBrands, 300);
  }

  componentWillMount () {
    const { currentLocale, initialize } = this.props;
    initialize({ defaultLocale: currentLocale });
  }

  async submit (form) {
    try {
      const { location, params, submit } = this.props;
      await submit(form.toJS());
      // Load the new list of items, using the location query of the previous page.
      const loc = location && location.state && location.state.returnTo;
      if (loc && loc.query) {
        this.props.loadCommercials(loc.query, params.commercialId);
      }
      this.onCloseClick();
    } catch (error) {
      throw new SubmissionError({ _error: 'common.errors.unexpected' });
    }
  }

  onCloseClick () {
    this.props.routerPushWithReturnTo('/content/commercials', true);
  }

  render () {
    const {
      brandsById, localeNames, searchedBrandIds, handleSubmit
    } = this.props;
    return (
      <PersistModal isOpen title='Create Commercial'
        onClose={this.onCloseClick} onSubmit={handleSubmit(this.submit)}>
        <FormSubtitle first>Content</FormSubtitle>
        <Field
          component={SelectInput}
          getItemText={(language) => localeNames.get(language)}
          getOptions={(language) => localeNames.keySeq().toArray()}
          label='Default language'
          name='defaultLocale'
          options={localeNames.keySeq().toArray()}
          placeholder='Default language'/>
        <Field
          component={SelectInput}
          getItemImage={(id) => brandsById.getIn([ id, 'logo', 'url' ])}
          getItemText={(id) => brandsById.getIn([ id, 'name' ])}
          getOptions={this.searchBrands}
          isLoading={searchedBrandIds.get('_status') === FETCHING}
          label='Brand'
          name='brandId'
          options={searchedBrandIds.get('data').toJS()}
          placeholder='Brand'
          required />
        <Field
          component={TextInput}
          label='Title'
          name='title'
          placeholder='Title'
          required />
      </PersistModal>
    );
  }

}
