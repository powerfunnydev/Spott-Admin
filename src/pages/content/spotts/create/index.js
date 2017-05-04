/* eslint-disable react/no-set-state */
import React, { Component, PropTypes } from 'react';
import { reduxForm, Field, SubmissionError } from 'redux-form/immutable';
import ImmutablePropTypes from 'react-immutable-proptypes';
import Radium from 'radium';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { FormSubtitle } from '../../../_common/styles';
import TextInput from '../../../_common/inputs/textInput';
// import ImageDropzone from '../../../_common/dropzone/imageDropzone';
import SelectInput from '../../../_common/inputs/selectInput';
import localized from '../../../_common/decorators/localized';
import PersistModal, { dialogStyle } from '../../../_common/components/persistModal';
import { FETCHING } from '../../../../constants/statusTypes';
// import { POSTER_IMAGE } from '../../../../constants/imageTypes';
import { routerPushWithReturnTo } from '../../../../actions/global';
import createPersistTag from '../_common/tags/persist';
import { load as loadList } from '../list/actions';
import * as actions from './actions';
import selector from './selector';
// For testing
import Scene from '../_common/scene';
import createTagsSelector from '../_common/selector';

const tagsSelector = createTagsSelector('spottCreate', 'create');
const PersistTag = createPersistTag(tagsSelector, actions);

let spottCount = 1;

function validate (values, { t }) {
  const validationErrors = {};
  const { defaultLocale, image, title } = values.toJS();
  if (!defaultLocale) { validationErrors.defaultLocale = t('common.errors.required'); }
  if (!title) { validationErrors.title = t('common.errors.required'); }
  if (!image) { validationErrors.image = t('common.errors.required'); }
  // Done
  return validationErrors;
}

@localized
@connect(selector, (dispatch) => ({
  load: bindActionCreators(loadList, dispatch),
  searchTopics: bindActionCreators(actions.searchTopics, dispatch),
  searchUsers: bindActionCreators(actions.searchUsers, dispatch),
  persistTopic: bindActionCreators(actions.persistTopic, dispatch),
  submit: bindActionCreators(actions.submit, dispatch),
  routerPushWithReturnTo: bindActionCreators(routerPushWithReturnTo, dispatch),
  fetchPersonTopic: bindActionCreators(actions.fetchPersonTopic, dispatch),
  fetchBrandTopic: bindActionCreators(actions.fetchBrandTopic, dispatch),
  fetchCharacterTopic: bindActionCreators(actions.fetchCharacterTopic, dispatch)
}))
@reduxForm({
  form: 'spottCreate',
  validate
})
@Radium
export default class CreateSpottModal extends Component {

  static propTypes = {
    change: PropTypes.func.isRequired,
    charactersById: ImmutablePropTypes.map.isRequired,
    currentLocale: PropTypes.string.isRequired,
    dispatch: PropTypes.func.isRequired,
    error: PropTypes.any,
    fetchBrandTopic: PropTypes.func.isRequired,
    fetchCharacterTopic: PropTypes.func.isRequired,
    fetchPersonTopic: PropTypes.func.isRequired,
    genders: ImmutablePropTypes.map.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    image: PropTypes.object,
    initialize: PropTypes.func.isRequired,
    load: PropTypes.func.isRequired,
    localeNames: ImmutablePropTypes.map.isRequired,
    location: PropTypes.object.isRequired,
    persistTopic: PropTypes.func.isRequired,
    personsById: ImmutablePropTypes.map.isRequired,
    productsById: ImmutablePropTypes.map.isRequired,
    reset: PropTypes.func.isRequired,
    routerPushWithReturnTo: PropTypes.func.isRequired,
    searchedTopicIds: ImmutablePropTypes.map.isRequired,
    searchedUserIds: ImmutablePropTypes.map.isRequired,
    searchTopics: PropTypes.func.isRequired,
    searchUsers: PropTypes.func.isRequired,
    submit: PropTypes.func.isRequired,
    t: PropTypes.func.isRequired,
    tags: PropTypes.array,
    topicIds: PropTypes.array,
    topicsById: ImmutablePropTypes.map.isRequired,
    usersById: ImmutablePropTypes.map.isRequired
  };

  constructor (props) {
    super(props);
    this.submit = ::this.submit;
    this.addTopic = ::this.addTopic;
    this.onChangeImage = ::this.onChangeImage;
    this.onCloseClick = ::this.onCloseClick;
    this.onCreateTopic = ::this.onCreateTopic;
    this.onEditTag = ::this.onEditTag;
    this.onMoveTag = ::this.onMoveTag;
    this.onRemoveTag = ::this.onRemoveTag;
    this.onSelectionRegion = ::this.onSelectionRegion;
    this.onPersistTag = ::this.onPersistTag;
  }

  componentWillMount () {
    this.props.initialize({
      defaultLocale: this.props.currentLocale
    });
  }

  async submit (form) {
    try {
      const { load, location, submit, dispatch, change, reset } = this.props;
      await submit(form.toJS());
      const createAnother = form.get('createAnother');
      // Load the new list of items, using the location query of the previous page.
      const loc = location && location.state && location.state.returnTo;
      if (loc && loc.query) {
        load(loc.query);
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

  onChangeImage (image) {
    const { change, dispatch } = this.props;
    dispatch(change('image', image));
  }

  onEditTag (tagId) {
    const { tags } = this.props;
    const myTags = tags ? tags : [];
    this.setState({ ...this.state, modal: 'editTag', tag: myTags.find((t) => t.id === tagId) });
  }

  onRemoveTag (tagId) {
    const { change, dispatch, tags = [] } = this.props;
    const newTags = tags.filter((t) => t.id !== tagId);
    dispatch(change('tags', newTags));
  }

  onSelectionRegion (point) {
    this.setState({ ...this.state, point, modal: 'createTag' });
  }

  onMoveTag (tagId, point) {
    console.warn('onMoveTag');
    const { change, dispatch, tags } = this.props;
    const myTags = tags ? tags : [];
    const tag = myTags.find((t) => t.id === tagId);
    tag.point = point;
    dispatch(change('tags', myTags));
  }

  async onPersistTag (tag) {
    const { change, charactersById, dispatch, fetchBrandTopic, fetchCharacterTopic, fetchPersonTopic, personsById, productsById, tags } = this.props;
    const myTags = tags ? tags : [];
    console.warn('tags', myTags);
    const newTags = [ ...myTags ];

    switch (tag.entityType) {
      case 'CHARACTER':
        tag.character = charactersById.get(tag.characterId).toJS();
        const characterTopic = await fetchCharacterTopic({ characterId: tag.characterId });
        this.addTopic(characterTopic.id);
        break;
      case 'PERSON':
        tag.person = personsById.get(tag.personId).toJS();
        const personTopic = await fetchPersonTopic({ personId: tag.personId });
        this.addTopic(personTopic.id);
        break;
      case 'PRODUCT':
        tag.product = productsById.get(tag.productId).toJS();
        const brandTopic = await fetchBrandTopic({ brandId: tag.product.brand.id });
        this.addTopic(brandTopic.id);
        break;
    }

    // Edit an existing tag.
    if (tag.id) {
      const index = myTags.findIndex((t) => t.id === tag.id);
      newTags[index] = tag;
    } else { // Create a new tag.
      const newTag = { id: `_${spottCount++}`, ...tag };
      newTags.push(newTag);
    }
    dispatch(change('tags', newTags));
  }

  onCloseClick () {
    this.props.routerPushWithReturnTo('/content/spotts', true);
  }
  addTopic (id) {
    const { change, dispatch, topicIds } = this.props;
    const ids = topicIds ? topicIds : [];
    if (ids.indexOf(id) === -1) {
      ids.push(id);
      dispatch(change('topicIds', ids));
    }
  }

  async onCreateTopic (text) {
    const { change, dispatch, persistTopic, topicIds } = this.props;
    const ids = topicIds ? topicIds : [];
    const { id } = await persistTopic({ text });
    ids.push(id);
    dispatch(change('topicIds', ids));
  }

  render () {
    const { change, dispatch, handleSubmit, image, localeNames, searchedTopicIds,
      searchTopics, searchUsers, searchedUserIds, usersById, tags, topicsById } = this.props;
    return (
      <PersistModal createAnother isOpen style={{ ...dialogStyle, content: { ...dialogStyle.content, maxWidth: 620 } }} title='Add Spott' onClose={this.onCloseClick} onSubmit={handleSubmit(this.submit)}>
        {this.state.modal === 'createTag' &&
          <PersistTag
            initialValues={{
              entityType: 'PRODUCT',
              point: this.state.point,
              relevance: 'EXACT'
            }}
            onClose={() => this.setState({ ...this.state, modal: null })}
            onSubmit={this.onPersistTag}/>}
        {this.state.modal === 'editTag' && this.state.tag &&
          <PersistTag
            initialValues={{
              ...this.state.tag,
              relevance: this.state.tag.relevance || 'EXACT'
            }}
            submitButtonText='Save'
            onClose={() => this.setState({ ...this.state, modal: null })}
            onSubmit={this.onPersistTag}/>}
        <div style={{ display: 'flex' }}>
          <div style={{ paddingRight: 20, width: '100%' }}>
            {/* Only mounted fields will be validated and stop submit on errors.
                Without using Field, the field is not mounted. */}
            <Field
              component={Scene}
              imageUrl={image && image.preview}
              name='image'
              tags={tags}
              onChangeImage={this.onChangeImage}
              onEditTag={this.onEditTag}
              onMoveTag={this.onMoveTag}
              onRemoveTag={this.onRemoveTag}
              onSelectionRegion={this.onSelectionRegion}/>
          </div>
          <div style={{ width: '100%' }}>
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
              placeholder='Default language'
              required/>
            <Field
              component={TextInput}
              label='Title'
              name='title'
              placeholder='Title'
              required/>
            <Field
              component={TextInput}
              label='Comment'
              name='comment'
              placeholder='Comment'/>
            <Field
              component={SelectInput}
              getItemImage={(id) => usersById.getIn([ id, 'avatar', 'url' ])}
              getItemText={(id) => usersById.getIn([ id, 'userName' ])}
              getOptions={searchUsers}
              isLoading={searchedUserIds.get('_status') === FETCHING}
              label='Author'
              name='authorId'
              options={searchedUserIds.get('data').toJS()}
              placeholder='Author'/>
            <Field
              component={SelectInput}
              getItemImage={(id) => topicsById.getIn([ id, 'icon', 'url' ])}
              getItemText={(id) => topicsById.getIn([ id, 'text' ])}
              getOptions={searchTopics}
              isLoading={searchedTopicIds.get('_status') === FETCHING}
              label='Topics'
              multiselect
              name='topicIds'
              options={searchedTopicIds.get('data').toJS()}
              placeholder='Topics'
              onCreateOption={this.onCreateTopic}/>
          </div>
        </div>
      </PersistModal>
    );
  }

}
