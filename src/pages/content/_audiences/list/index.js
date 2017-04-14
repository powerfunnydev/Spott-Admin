/* eslint-disable react/no-set-state */
import React, { Component, PropTypes } from 'react';
import Radium from 'radium';
import { connect } from 'react-redux';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { bindActionCreators } from 'redux';
import Section from '../../../_common/components/section';
import { headerStyles, Table, Headers, CustomCel, Rows, Row } from '../../../_common/components/table/index';
import { colors, fontWeights, makeTextStyle, FormSubtitle, FormDescription } from '../../../_common/styles';
import Plus from '../../../_common/images/plus';
import EditButton from '../../../_common/components/buttons/editButton';
import RemoveButton from '../../../_common/components/buttons/removeButton';
import PersistAudienceModal from '../persist';
import selector from './selector';
import * as actions from './actions';

@connect(selector, (dispatch) => ({
  deleteAudience: bindActionCreators(actions.deleteAudience, dispatch),
  loadAudience: bindActionCreators(actions.loadAudience, dispatch),
  loadAudiences: bindActionCreators(actions.loadAudiences, dispatch),
  persistAudience: bindActionCreators(actions.persistAudience, dispatch)
}))
@Radium
export default class Audiences extends Component {

  static propTypes = {
    audiences: ImmutablePropTypes.map.isRequired,
    deleteAudience: PropTypes.func.isRequired,
    loadAudience: PropTypes.func.isRequired,
    loadAudiences: PropTypes.func.isRequired,
    mediumId: PropTypes.string.isRequired,
    persistAudience: PropTypes.func.isRequired,
    searchCountries: PropTypes.func.isRequired,
    searchLanguages: PropTypes.func.isRequired,
    searchedCountryIds: ImmutablePropTypes.map.isRequired,
    searchedLanguageIds: ImmutablePropTypes.map.isRequired
  };

  constructor (props) {
    super(props);
    this.getAudience = ::this.getAudience;
    this.onClickCreateAudience = ::this.onClickCreateAudience;
    this.onSubmit = ::this.onSubmit;
    this.state = {
      create: false,
      edit: false
    };
  }

  componentWillMount () {
    const { loadAudiences, mediumId, mediumType } = this.props;
    loadAudiences({ mediumId, mediumType });
  }

  getAudience (index) {
    const mediumId = this.props.mediumId;
    const { countries, id, languages, mediumType, name } = this.props.audiences.getIn([ 'data', index ]).toJS();
    return {
      countryIds: countries && countries.map((c) => c.id),
      id,
      languageIds: languages && languages.map((l) => l.id),
      name,
      mediumId,
      mediumType
    };
  }

  onClickCreateAudience (e) {
    e.preventDefault();
    this.setState({ create: true });
  }

  async onClickDeleteAudience (audienceId) {
    const { deleteAudience, loadAudiences, mediumId, mediumType } = this.props;
    await deleteAudience({ audienceId, mediumId, mediumType });
    await loadAudiences({ mediumId, mediumType });
  }

  async onSubmit (form) {
    const { loadAudiences, mediumId, mediumType, persistAudience } = this.props;
    await persistAudience(form);
    await loadAudiences({ mediumId, mediumType });
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
    },
    adaptedCustomCel: {
      fontSize: '11px',
      paddingTop: '5px',
      paddingBottom: '5px',
      minHeight: '30px'
    },
    adaptedRows: {
      minHeight: '3.75em'
    },
    customTable: {
      border: `1px solid ${colors.lightGray2}`
    }
  };

  render () {
    const styles = this.constructor.styles;
    const {
      audiences, loadAudience, mediumId, mediumType, searchCountries, searchLanguages,
      searchedCountryIds, searchedLanguageIds
    } = this.props;

    return (
      <Section>
        <FormSubtitle first>Target audience</FormSubtitle>
        <FormDescription style={styles.description}>Target one more types of audiences for this content.</FormDescription>
        <Table style={styles.customTable}>
          <Headers>
            {/* Be aware that width or flex of each headerCel and the related rowCel must be the same! */}
            <CustomCel style={[ headerStyles.base, headerStyles.first, styles.adaptedCustomCel, { flex: 2 } ]}>
              Name
            </CustomCel>
            <CustomCel style={[ headerStyles.base, styles.adaptedCustomCel, { flex: 2 } ]}>
              Locations
            </CustomCel>
            <CustomCel style={[ headerStyles.base, styles.adaptedCustomCel, { flex: 2 } ]}>
              Languages
            </CustomCel>
            <CustomCel style={[ headerStyles.base, styles.adaptedCustomCel, { flex: 1 } ]} />
          </Headers>
          <Rows style={styles.adaptedRows}>
            {audiences.get('data').map((audience, index) => {
              return (
                <Row isFirst={index === 0} key={index} >
                  <CustomCel style={[ styles.adaptedCustomCel, { flex: 2 } ]}>
                    {audience.get('name')}
                  </CustomCel>
                  <CustomCel style={[ styles.adaptedCustomCel, { flex: 2 } ]}>
                    {!audience.get('countries') || audience.get('countries').size === 0
                      ? 'All'
                      : audience.get('countries').map((country) => country.get('name')).join(', ')}
                  </CustomCel>
                  <CustomCel style={[ styles.adaptedCustomCel, { flex: 2 } ]}>
                    {!audience.get('languages') || audience.get('languages').size === 0
                      ? 'All'
                      : audience.get('languages').map((language) => language.get('name')).join(', ')}
                  </CustomCel>
                  <CustomCel style={[ styles.adaptedCustomCel, { flex: 1 } ]}>
                    <EditButton style={styles.editButton} onClick={async () => {
                      await loadAudience({ audienceId: audience.get('id'), mediumId, mediumType });
                      this.setState({ edit: index });
                    }} />
                    <RemoveButton onClick={this.onClickDeleteAudience.bind(this, audience.get('id'))} />
                  </CustomCel>
                </Row>
              );
            })}
            <Row isFirst={audiences.get('data').size === 0} >
              <CustomCel style={[ styles.add, styles.adaptedCustomCel ]} onClick={this.onClickCreateAudience}>
                <Plus color={colors.primaryBlue} />&nbsp;&nbsp;&nbsp;Add audience
              </CustomCel>
            </Row>
          </Rows>
          {this.state.create &&
            <PersistAudienceModal
              initialValues={{
                mediumId,
                mediumType
              }}
              searchCountries={searchCountries}
              searchLanguages={searchLanguages}
              searchedCountryIds={searchedCountryIds}
              searchedLanguageIds={searchedLanguageIds}
              onClose={() => this.setState({ create: false })}
              onSubmit={this.onSubmit} />}
          {typeof this.state.edit === 'number' &&
            <PersistAudienceModal
              edit
              initialValues={this.getAudience(this.state.edit)}
              searchCountries={searchCountries}
              searchLanguages={searchLanguages}
              searchedCountryIds={searchedCountryIds}
              searchedLanguageIds={searchedLanguageIds}
              onClose={() => this.setState({ edit: false })}
              onSubmit={this.onSubmit} />}
        </Table>
      </Section>
    );
  }

}
