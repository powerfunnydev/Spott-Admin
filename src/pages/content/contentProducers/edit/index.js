import React, { Component, PropTypes } from 'react';
import { reduxForm, Field, SubmissionError } from 'redux-form/immutable';
import Radium from 'radium';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import TextInput from '../../../_common/inputs/textInput';
import Header from '../../../app/header';
import { tabStyles, Root, FormSubtitle, colors, EditTemplate } from '../../../_common/styles';
import localized from '../../../_common/decorators/localized';
import * as actions from './actions';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import Section from '../../../_common/components/section';
import SpecificHeader from '../../header';
import { routerPushWithReturnTo } from '../../../../actions/global';
import Dropzone from '../../../_common/dropzone/imageDropzone';
import Label from '../../../_common/inputs/_label';
import ImmutablePropTypes from 'react-immutable-proptypes';
import selector from './selector';
import BreadCrumbs from '../../../_common/components/breadCrumbs';

function validate (values, { t }) {
  const validationErrors = {};
  const { name } = values.toJS();
  if (!name) { validationErrors.name = t('common.errors.required'); }
  // Done
  return validationErrors;
}

@localized
@connect(selector, (dispatch) => ({
  deleteLogo: bindActionCreators(actions.deleteLogo, dispatch),
  load: bindActionCreators(actions.load, dispatch),
  submit: bindActionCreators(actions.submit, dispatch),
  uploadImage: bindActionCreators(actions.uploadImage, dispatch),
  routerPushWithReturnTo: bindActionCreators(routerPushWithReturnTo, dispatch)
}))
@reduxForm({
  form: 'contentProducersEdit',
  validate
})
@Radium
export default class EditContentProducers extends Component {

  static propTypes = {
    currentContentProducer: ImmutablePropTypes.map.isRequired,
    deleteLogo: PropTypes.func.isRequired,
    error: PropTypes.any,
    handleSubmit: PropTypes.func.isRequired,
    initialize: PropTypes.func.isRequired,
    load: PropTypes.func.isRequired,
    location: PropTypes.object.isRequired,
    params: PropTypes.object.isRequired,
    routerPushWithReturnTo: PropTypes.func.isRequired,
    submit: PropTypes.func.isRequired,
    t: PropTypes.func.isRequired,
    uploadImage: PropTypes.func.isRequired
  };

  constructor (props) {
    super(props);
    this.submit = ::this.submit;
    this.redirect = ::this.redirect;
  }

  async componentWillMount () {
    if (this.props.params.id) {
      const editObj = await this.props.load(this.props.params.id);
      this.props.initialize({
        name: editObj.name
      });
    }
  }

  redirect () {
    this.props.routerPushWithReturnTo('content/content-producers', true);
  }

  async submit (form) {
    try {
      await this.props.submit({ id: this.props.params.id, ...form.toJS() });
      this.redirect();
    } catch (error) {
      throw new SubmissionError({ _error: 'common.errors.unexpected' });
    }
  }

  static styles = {
    background: {
      backgroundColor: colors.lightGray4,
      paddingBottom: '50px'
    },
    paddingTop: {
      paddingTop: '1.25em'
    }
  }

  render () {
    const { currentContentProducer, location, handleSubmit, deleteLogo } = this.props;
    const { styles } = this.constructor;
    return (
      <Root style={styles.background}>
        <Header currentLocation={location} hideHomePageLinks />
        <SpecificHeader/>
        <BreadCrumbs hierarchy={[
          { title: 'Content producers', url: '/content/content-producers' },
          { title: currentContentProducer.get('name'), url: location } ]}/>
        <EditTemplate onCancel={this.redirect} onSubmit={handleSubmit(this.submit)}>
          <Tabs>
            <TabList style={tabStyles.tabList}>
              <Tab style={tabStyles.tab}>Details</Tab>
            </TabList>
            <TabPanel>
              <Section first>
                <FormSubtitle first>Content</FormSubtitle>
                <Field
                  component={TextInput}
                  label='Name'
                  name='name'
                  placeholder='Name content producer'
                  required/>
                <div style={styles.paddingTop}>
                  <Label text='Upload image' />
                  <Dropzone
                    accept='image/*'
                    downloadUrl={currentContentProducer.get('logo') &&
                      currentContentProducer.getIn([ 'logo', 'url' ])}
                    imageUrl={currentContentProducer.get('logo') &&
                      `${currentContentProducer.getIn([ 'logo', 'url' ])}?height=310&width=310`}
                    onChange={({ callback, file }) => { this.props.uploadImage({ contentProducerId: this.props.params.id, image: file, callback }); }}
                    onDelete={() => { deleteLogo({ contentProducerId: currentContentProducer.get('id') }); }}/>
                </div>
              </Section>
            </TabPanel>
          </Tabs>
        </EditTemplate>
      </Root>
    );
  }

}
