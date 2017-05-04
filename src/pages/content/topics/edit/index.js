import React, { Component, PropTypes } from 'react';
import { reduxForm, Field, SubmissionError } from 'redux-form/immutable';
import Radium from 'radium';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import ImmutablePropTypes from 'react-immutable-proptypes';
import TextInput from '../../../_common/inputs/textInput';
import { Root, FormSubtitle, colors, EditTemplate } from '../../../_common/styles';
import localized from '../../../_common/decorators/localized';
import * as actions from './actions';
import { Tabs, Tab } from '../../../_common/components/formTabs';
import Section from '../../../_common/components/section';
import { routerPushWithReturnTo } from '../../../../actions/global';
import Label from '../../../_common/inputs/_label';
import selector from './selector';
import ImageDropzone from '../../../_common/dropzone/imageDropzone';
import { PROFILE_IMAGE } from '../../../../constants/imageTypes';
import ensureEntityIsSaved from '../../../_common/decorators/ensureEntityIsSaved';
import { SideMenu } from '../../../app/sideMenu';
import Header from '../../../app/multiFunctionalHeader';
import { transformSourceToLink } from '../_common/utils';

function validate (values, { t }) {
  const validationErrors = {};
  const { text } = values.toJS();
  if (!text) { validationErrors.text = t('common.errors.required'); }

// Done
  return validationErrors;
}

// Decorators in this sequence!
@localized
@connect(selector, (dispatch) => ({
  closePopUpMessage: bindActionCreators(actions.closePopUpMessage, dispatch),
  deleteThumbImage: bindActionCreators(actions.deleteThumbImage, dispatch),
  deleteBackgroundImage: bindActionCreators(actions.deleteBackgroundImage, dispatch),
  loadTopic: bindActionCreators(actions.loadTopic, dispatch),
  routerPushWithReturnTo: bindActionCreators(routerPushWithReturnTo, dispatch),
  setPopUpMessage: bindActionCreators(actions.setPopUpMessage, dispatch),
  submit: bindActionCreators(actions.submit, dispatch),
  uploadThumbImage: bindActionCreators(actions.uploadThumbImage, dispatch),
  uploadBackgroundImage: bindActionCreators(actions.uploadBackgroundImage, dispatch)
}))
@reduxForm({
  form: 'topicEdit',
  validate
})
@ensureEntityIsSaved
@Radium
export default class EditTopic extends Component {

  static propTypes = {
    _activeLocale: PropTypes.string,
    change: PropTypes.func.isRequired,
    closePopUpMessage: PropTypes.func.isRequired,
    currentTopic: ImmutablePropTypes.map.isRequired,
    deleteBackgroundImage: PropTypes.func.isRequired,
    deleteThumbImage: PropTypes.func.isRequired,
    dispatch: PropTypes.func.isRequired,
    error: PropTypes.any,
    errors: PropTypes.object,
    handleSubmit: PropTypes.func.isRequired,
    initialize: PropTypes.func.isRequired,
    loadTopic: PropTypes.func.isRequired,
    location: PropTypes.object.isRequired,
    params: PropTypes.object.isRequired,
    popUpMessage: PropTypes.object,
    routerPushWithReturnTo: PropTypes.func.isRequired,
    setPopUpMessage: PropTypes.func.isRequired,
    submit: PropTypes.func.isRequired,
    t: PropTypes.func.isRequired,
    uploadBackgroundImage: PropTypes.func.isRequired,
    uploadThumbImage: PropTypes.func.isRequired,
    onBeforeChangeTab: PropTypes.func.isRequired,
    onChangeTab: PropTypes.func.isRequired
  };

  constructor (props) {
    super(props);
    this.submit = ::this.submit;
    this.redirect = ::this.redirect;
  }

  async componentWillMount () {
    const { params, setPopUpMessage } = this.props;
    if (params.topicId) {
      const editObj = await this.props.loadTopic(this.props.params.topicId);
      const type = editObj.sourceMedium ? editObj.sourceMedium.type : editObj.sourceType;
      editObj.readOnly && setPopUpMessage({
        link: { text: editObj.text, to: transformSourceToLink(editObj.sourceReference, type, 'edit') },
        message: `This is a generated topic. Edit the data on the corresponding ${editObj.sourceType.toLowerCase()} page here: `,
        type: 'info'
      });
      this.props.initialize({ ...editObj, icon: null, profileImage: null });
    }
  }

  redirect () {
    this.props.routerPushWithReturnTo('/content/topics', true);
  }

  async submit (form) {
    const { initialize, params: { topicId } } = this.props;

    try {
      await this.props.submit({
        ...form.toJS(),
        topicId
      });
      await initialize(form.toJS());
    } catch (error) {
      throw new SubmissionError({ _error: 'common.errors.unexpected' });
    }
  }

  static styles = {
    selectInput: {
      paddingTop: 0,
      width: '180px'
    },
    background: {
      backgroundColor: colors.lightGray4
    },
    paddingTop: {
      paddingTop: '1.25em'
    },
    row: {
      display: 'flex',
      flexDirection: 'row'
    },
    backgroundRoot: {
      backgroundColor: colors.lightGray4,
      paddingBottom: '50px'
    },
    paddingLeftUploadImage: {
      paddingLeft: '24px'
    },
    description: {
      marginBottom: '1.25em'
    },
    imageDropzone: {
      width: '100%',
      height: '100px'
    },
    faceImagesContainer: {
      display: 'flex',
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginTop: '20px'
    }
  };

  render () {
    const styles = this.constructor.styles;
    const { closePopUpMessage, currentTopic, deleteBackgroundImage, deleteThumbImage, handleSubmit,
      location, location: { query: { tab } }, popUpMessage, uploadThumbImage, uploadBackgroundImage,
      onChangeTab, onBeforeChangeTab } = this.props;
    // console.warn('readOnly', this.props.currentTopic.get('readOnly'));
    return (
      <SideMenu>
        <Root style={styles.backgroundRoot}>
          <Header hierarchy={[
            { title: 'Topics', url: '/content/topics' },
            { title: currentTopic.get('text'), url: location } ]}/>
          <EditTemplate disableSubmit={currentTopic.get('readOnly')} onCancel={this.redirect} onSubmit={handleSubmit(this.submit)}>
            <Tabs activeTab={tab} showPublishStatus onBeforeChange={onBeforeChangeTab} onChange={onChangeTab}>
              <Tab title='Details'>
                <Section clearPopUpMessage={closePopUpMessage} popUpObject={popUpMessage}>
                  <FormSubtitle first>General</FormSubtitle>
                  <Field
                    component={TextInput}
                    // disabled={currentTopic.get('readOnly')}
                    label='Topic title'
                    name='text'
                    placeholder='Topic title'
                    required/>
                <FormSubtitle>Images</FormSubtitle>
                <div style={[ styles.paddingTop, styles.row ]}>
                  <div>
                    <Label text='Thumb' />
                    <ImageDropzone
                      accept='image/*'
                      downloadUrl={currentTopic.getIn([ 'icon', 'url' ])}
                      imageUrl={currentTopic.getIn([ 'icon', 'url' ]) && `${currentTopic.getIn([ 'icon', 'url' ])}?height=203&width=360`}
                      onChange={currentTopic.get('readOnly') ? null : ({ callback, file }) => {
                        uploadThumbImage({ topicId: this.props.params.topicId, image: file, callback });
                      }}
                      onDelete={currentTopic.getIn([ 'icon', 'url' ]) && !currentTopic.get('readOnly') ? () => {
                        deleteThumbImage({ topicId: currentTopic.get('id') });
                      } : null} />
                  </div>
                  <div style={styles.paddingLeftUploadImage}>
                    <Label text='Topic background' />
                    <ImageDropzone
                      accept='image/*'
                      downloadUrl={currentTopic.getIn([ 'profileImage', 'url' ])}
                      imageUrl={currentTopic.getIn([ 'profileImage', 'url' ]) && `${currentTopic.getIn([ 'profileImage', 'url' ])}?height=203&width=360`}
                      type={PROFILE_IMAGE}
                      onChange={currentTopic.get('readOnly') ? null : ({ callback, file }) => {
                        uploadBackgroundImage({ topicId: this.props.params.topicId, image: file, callback });
                      }}
                      onDelete={currentTopic.getIn([ 'profileImage', 'url' ]) && !currentTopic.get('readOnly') ? () => {
                        deleteBackgroundImage({ topicId: currentTopic.get('id') });
                      } : null} />
                  </div>
                </div>
              </Section>
            </Tab>
          </Tabs>
        </EditTemplate>
      </Root>
    </SideMenu>
    );
  }

}
