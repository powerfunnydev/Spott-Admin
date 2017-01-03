import React, { Component, PropTypes } from 'react';
import { reduxForm, Field, SubmissionError } from 'redux-form/immutable';
import Radium from 'radium';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { FormSubtitle } from '../../../_common/styles';
import TextInput from '../../../_common/inputs/textInput';
import SelectInput from '../../../_common/inputs/selectInput';
import localized from '../../../_common/decorators/localized';
import PersistModal from '../../../_common/components/persistModal';
import { load as loadList } from '../list/actions';
import ImmutablePropTypes from 'react-immutable-proptypes';
import * as actions from './actions';
import { routerPushWithReturnTo } from '../../../../actions/global';
import selector from './selector';
import { FETCHING } from '../../../../constants/statusTypes';

function validate (values, { t }) {
  const validationErrors = {};
  const { defaultLocale, shortName, fullName, brandId } = values.toJS();
  if (!defaultLocale) { validationErrors.defaultLocale = t('common.errors.required'); }
  if (!shortName) { validationErrors.shortName = t('common.errors.required'); }
  if (!fullName) { validationErrors.fullName = t('common.errors.required'); }
  if (!brandId) { validationErrors.brandId = t('common.errors.required'); }

  // Done
  return validationErrors;
}

@localized
@connect(selector, (dispatch) => ({
  loadProducts: bindActionCreators(loadList, dispatch),
  searchBrands: bindActionCreators(actions.searchBrands, dispatch),
  submit: bindActionCreators(actions.submit, dispatch),
  routerPushWithReturnTo: bindActionCreators(routerPushWithReturnTo, dispatch)
}))
@reduxForm({
  form: 'productCreate',
  validate
})
@Radium
export default class CreateProductModal extends Component {

  static propTypes = {
    brandsById: ImmutablePropTypes.map.isRequired,
    change: PropTypes.func.isRequired,
    currentLocale: PropTypes.string.isRequired,
    dispatch: PropTypes.func.isRequired,
    error: PropTypes.any,
    handleSubmit: PropTypes.func.isRequired,
    initialize: PropTypes.func.isRequired,
    loadProducts: PropTypes.func.isRequired,
    localeNames: ImmutablePropTypes.map.isRequired,
    location: PropTypes.object.isRequired,
    params: PropTypes.object,
    reset: PropTypes.func.isRequired,
    route: PropTypes.object,
    routerPushWithReturnTo: PropTypes.func.isRequired,
    searchBrands: PropTypes.func.isRequired,
    searchedBrandIds: ImmutablePropTypes.map.isRequired,
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
      brandId: this.props.params.brandId,
      defaultLocale: this.props.currentLocale
    });
  }
  async submit (form) {
    try {
      const { route: { load }, loadProducts, location, submit, dispatch, change, reset } = this.props;
      await submit(form.toJS());
      const createAnother = form.get('createAnother');
      load && load(this.props);
      // Load the new list of items, using the location query of the previous page.
      const loc = location && location.state && location.state.returnTo;
      if (loc && loc.query) {
        loadProducts(loc.query);
      }
      if (createAnother) {
        await dispatch(reset());
        await dispatch(change('createAnother', true));
      } else {
        this.onCloseClick();
      }
    } catch (error) {
      throw new SubmissionError({ _error: 'common.errors.unexpected' });
    }
  }

  onCloseClick () {
    this.props.routerPushWithReturnTo('/content/products', true);
  }

  render () {
    const { handleSubmit, localeNames, brandsById, searchBrands, searchedBrandIds } = this.props;
    return (
      <PersistModal createAnother isOpen title='Create Product' onClose={this.onCloseClick} onSubmit={handleSubmit(this.submit)}>
        <FormSubtitle first>Content</FormSubtitle>
        <Field
          component={SelectInput}
          filter={(option, filter) => {
            return option && filter ? localeNames.get(option.value).toLowerCase().indexOf(filter.toLowerCase()) !== -1 : true;
          }}
          getItemText={(language) => { return localeNames.get(language); }}
          label='Default language'
          name='defaultLocale'
          options={localeNames.keySeq().toArray()}
          placeholder='Default language'/>
        <Field
          component={TextInput}
          label='Short name product'
          name='shortName'
          placeholder='Short name product'
          required/>
        <Field
          component={TextInput}
          label='Full name product'
          name='fullName'
          placeholder='Full name product'
          required/>
        <Field
          component={SelectInput}
          getItemText={(id) => brandsById.getIn([ id, 'name' ])}
          getOptions={searchBrands}
          isLoading={searchedBrandIds.get('_status') === FETCHING}
          label='Brand'
          name='brandId'
          options={searchedBrandIds.get('data').toJS()}
          placeholder='Brand name'
          required/>
      </PersistModal>
    );
  }

}
