import React, { Component, PropTypes } from 'react';
import { reduxForm, Field, SubmissionError } from 'redux-form/immutable';
import Radium from 'radium';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { FormSubtitle } from '../../../../../_common/styles';
import SelectInput from '../../../../../_common/inputs/selectInput';
import RadioInput from '../../../../../_common/inputs/radioInput';
import localized from '../../../../../_common/decorators/localized';
import PersistModal from '../../../../../_common/components/persistModal';
import { slowdown } from '../../../../../../utils';
import * as actions from '../../actions';
import { tagsSelector } from '../../selector';
import ProductCharacter from './productCharacter';

const relevanceTypes = [
  { label: 'Exact', value: 'EXACT' },
  { label: 'Medium', value: 'MEDIUM' }
];

const entityTypes = [
  { label: 'Add product', value: 'PRODUCT' },
  { label: 'Add character', value: 'CHARACTER' },
  { label: 'Add person', value: 'PERSON' }
];

function validate (values, { t }) {
  const validationErrors = {};
  const { characterId, entityType, personId, productId, relevance } = values.toJS();

  switch (entityType) {
    case 'CHARACTER':
      if (!characterId) { validationErrors.characterId = t('common.errors.required'); }
      break;
    case 'PERSON':
      if (!personId) { validationErrors.personId = t('common.errors.required'); }
      break;
    case 'PRODUCT':
      if (!relevance) { validationErrors.relevance = t('common.errors.required'); }
      if (!productId) { validationErrors.productId = t('common.errors.required'); }
      break;
    default:
      validationErrors.entityType = t('common.errors.required');
  }

  // Done
  return validationErrors;
}

function renderProductCharacterInput ({ productCharacters, style, ...props }) {
  return (
    <div style={style}>
      <ProductCharacter
        {...props}
        empty
        key='none' />
      {productCharacters.map((pc, i) => (
        <ProductCharacter
          {...props}
          {...pc}
          key={pc.id} />
      ))}
    </div>
  );
}
renderProductCharacterInput.propTypes = {
  productCharacters: PropTypes.array.isRequired,
  style: PropTypes.object
};

@localized
@connect(tagsSelector, (dispatch) => ({
  searchCharacters: bindActionCreators(actions.searchCharacters, dispatch),
  searchPersons: bindActionCreators(actions.searchPersons, dispatch),
  searchProducts: bindActionCreators(actions.searchProducts, dispatch)
}))
@reduxForm({
  form: 'tagCreate',
  validate
})
@Radium
export default class PersistTag extends Component {

  static propTypes = {
    charactersById: ImmutablePropTypes.map.isRequired,
    entityType: PropTypes.string,
    error: PropTypes.any,
    handleSubmit: PropTypes.func.isRequired,
    initialize: PropTypes.func.isRequired,
    personsById: ImmutablePropTypes.map.isRequired,
    productCharacters: PropTypes.array.isRequired,
    productsById: ImmutablePropTypes.map.isRequired,
    searchCharacters: PropTypes.func.isRequired,
    searchPersons: PropTypes.func.isRequired,
    searchProducts: PropTypes.func.isRequired,
    searchedCharacterIds: ImmutablePropTypes.map.isRequired,
    searchedPersonIds: ImmutablePropTypes.map.isRequired,
    searchedProductIds: ImmutablePropTypes.map.isRequired,
    submitButtonText: PropTypes.string,
    t: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired
  };

  constructor (props) {
    super(props);
    this.searchCharacters = slowdown(props.searchCharacters, 300);
    this.searchPersons = slowdown(props.searchPersons, 300);
    this.searchProducts = slowdown(props.searchProducts, 300);
    this.submit = ::this.submit;
  }

  async submit (form) {
    try {
      const { onSubmit } = this.props;
      await onSubmit(form.toJS());
      this.props.onClose();
    } catch (error) {
      throw new SubmissionError({ _error: 'common.errors.unexpected' });
    }
  }

  static styles = {
    productCharacters: {
      display: 'flex',
      flexWrap: 'wrap',
      paddingTop: 14
    }
  };

  render () {
    const styles = this.constructor.styles;
    const {
      charactersById, entityType, handleSubmit, personsById, productCharacters, productsById,
      searchedCharacterIds, searchedPersonIds, searchedProductIds, submitButtonText,
      onClose
    } = this.props;
    return (
      <PersistModal isOpen submitButtonText={submitButtonText} title='Tag your spott' onClose={onClose} onSubmit={handleSubmit(this.submit)}>
        {/* <EditTemplate onCancel={this.redirect} onSubmit={handleSubmit(this.submit)}>
          <Tabs activeTab={tab} showPublishStatus onBeforeChange={this.props.onBeforeChangeTab} onChange={this.props.onChangeTab}>
            <Tab title='Details'>
              <div style={{ display: 'flex', marginTop: -1 }}>
                <div style={{ width: '40%' }}>
                  <Section style={{ marginTop: 0, marginRight: -1 }}>
                    {currentSpott.get('image') &&
                      <Scene
                        imageUrl={currentSpott.getIn([ 'image', 'url' ])}
                        tags={tags}
                        onChangeImage={this.onChangeImage}
                        onEditTag={this.onEditTag}
                        onMoveTag={this.onMoveTag}
                        onRemoveTag={this.onRemoveTag}
                        onSelectionRegion={this.onSelectionRegion}/>}
                      <Field
                        component={TextInput}
                        label='Image source'
                        name='imageSource'
                        placeholder='Image source'/>
                  </Section>
                </div>
                <div style={{ width: '60%', display: 'flex', flexDirection: 'column' }}>
                  <Section noPadding style={[ styles.background, { marginTop: 0 } ]}>
                    <LanguageBar
                      _activeLocale={_activeLocale}
                      defaultLocale={defaultLocale}
                      errors={errors}
                      openCreateLanguageModal={this.openCreateLanguageModal}
                      removeLanguage={this.removeLanguage}
                      supportedLocales={supportedLocales}
                      onSetDefaultLocale={this.onSetDefaultLocale}/>
                  </Section>
                  <Section clearPopUpMessage={this.props.closePopUpMessage} popUpObject={this.props.popUpMessage} style={{ height: '100%' }}>
                    <FormSubtitle first>General</FormSubtitle>
                    <Field
                      component={TextInput}
                      label='Title'
                      name={`title.${_activeLocale}`}
                      placeholder='Title'
                      required/>
                    <Field
                      component={TextInput}
                      label='Comment'
                      name={`comment.${_activeLocale}`}
                      placeholder='Comment'/>
                    <Field
                      component={SelectInput}
                      getItemText={(id) => topicsById.getIn([ id, 'text' ])}
                      getOptions={searchTopics}
                      isLoading={searchedTopicIds.get('_status') === FETCHING}
                      label='Topics'
                      multiselect
                      name='topicIds'
                      options={searchedTopicIds.get('data').toJS()}
                      placeholder='Topics'
                      onCreateOption={this.onCreateTopic}/>
                </Section>
              </div>
            </div>
          </Tab>
          <Tab title='Promote'>
            <Section>
              <FormSubtitle first>Promote this spott</FormSubtitle>
              <FormDescription style={styles.description}>When you promote a spott, users that are in the target audience will see this on the homepage. Promoted spotts will have a label “Promoted” on them.</FormDescription>
              <Field
                component={Checkbox}
                first
                label='Promote this spott'
                name='promoted'/>
            </Section>
          </Tab>
          <Tab title='Audience'>
            <Audiences
              mediumId={this.props.params.spottId}
              mediumType='spott'
              searchCountries={searchAudienceCountries}
              searchLanguages={searchAudienceLanguages}
              searchedCountryIds={searchedAudienceCountryIds}
              searchedLanguageIds={searchedAudienceLanguageIds}/>
          </Tab>
        </Tabs>
      </EditTemplate> */}
      </PersistModal>
    );
  }

}
