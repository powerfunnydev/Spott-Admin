/* eslint-disable react/no-set-state */
import React, { Component, PropTypes } from 'react';
import Radium from 'radium';
import { connect } from 'react-redux';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { bindActionCreators } from 'redux';
import { headerStyles, Table, Headers, CustomCel, Rows, Row } from '../../../../../_common/components/table/index';
import { colors, fontWeights, makeTextStyle, FormSubtitle } from '../../../../../_common/styles';
import Plus from '../../../../../_common/images/plus';
import EditButton from '../../../../../_common/components/buttons/editButton';
import RemoveButton from '../../../../../_common/components/buttons/removeButton';
import PersistMediumCategoryModal from '../persist';
import { routerPushWithReturnTo } from '../../../../../../actions/global';
import selector from './selector';
import * as actions from './actions';

@connect(selector, (dispatch) => ({
  deleteMediumCategory: bindActionCreators(actions.deleteMediumCategory, dispatch),
  loadMediumCategories: bindActionCreators(actions.loadMediumCategories, dispatch),
  persistMediumCategory: bindActionCreators(actions.persistMediumCategory, dispatch),
  routerPushWithReturnTo: bindActionCreators(routerPushWithReturnTo, dispatch)
}))
@Radium
export default class MediumCategories extends Component {

  static propTypes = {
    deleteMediumCategory: PropTypes.func.isRequired,
    loadMediumCategories: PropTypes.func.isRequired,
    mediumCategories: ImmutablePropTypes.map.isRequired,
    persistMediumCategory: PropTypes.func.isRequired,
    routerPushWithReturnTo: PropTypes.func.isRequired
  };

  constructor (props) {
    super(props);
    this.onClickCreateMediumCategory = ::this.onClickCreateMediumCategory;
    this.onSubmit = ::this.onSubmit;
    this.state = {
      create: false,
      edit: false
    };
  }

  componentWillMount () {
    const { loadMediumCategories } = this.props;
    loadMediumCategories({});
  }

  onClickCreateMediumCategory (e) {
    e.preventDefault();
    this.setState({ create: true });
  }

  async onClickDeleteMediumCategory (mediumCategoryId) {
    const { deleteMediumCategory, loadMediumCategories } = this.props;
    await deleteMediumCategory({ mediumCategoryId });
    await loadMediumCategories({});
  }

  async onSubmit (form) {
    const { loadMediumCategories, persistMediumCategory } = this.props;
    const locales = [ 'en' ];
    const { nameCopy } = form;
    // nameCopy contains local data.
    Object.keys(nameCopy).map((locale) => {
      if (!nameCopy[locale]) { // true or false. False when there is a custom value for a particular language.
        locales.push(locale);
      }
    });
    await persistMediumCategory({
      defaultLocale: 'en',
      locales,
      ...form }
    );
    await loadMediumCategories({});
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
    },
    whiteSpace: {
      paddingTop: '20px'
    }
  };

  render () {
    const styles = this.constructor.styles;
    const { mediumCategories } = this.props;
    return (
      <div>
        <FormSubtitle first>Medium Categories</FormSubtitle>
        <div style={styles.whiteSpace}/>
        <Table style={styles.customTable}>
          <Headers>
            {/* Be aware that width or flex of each headerCel and the related rowCel must be the same! */}
            <CustomCel style={[ headerStyles.base, headerStyles.first, styles.adaptedCustomCel, { flex: 2 } ]}>
              Medium Category
            </CustomCel>
            <CustomCel style={[ headerStyles.base, styles.adaptedCustomCel, { width: 60 } ]} />
          </Headers>
          <Rows style={styles.adaptedRows}>
            {mediumCategories.get('data').map((mediumCategory, index) => {
              return (
                <Row isFirst={index === 0} key={index} >
                  <CustomCel
                    style={[ styles.adaptedCustomCel, { flex: 2 } ]}>
                    {mediumCategory.get('name')}
                  </CustomCel>
                  <CustomCel style={[ styles.adaptedCustomCel, { width: 60 } ]}>
                    <EditButton style={styles.editButton} onClick={() => this.setState({ edit: mediumCategory.get('id') })} />
                    <RemoveButton onClick={this.onClickDeleteMediumCategory.bind(this, mediumCategory.get('id'))} />
                  </CustomCel>
                </Row>
              );
            })}
            <Row isFirst={mediumCategories.get('data').size === 0} >
              <CustomCel style={[ styles.add, styles.adaptedCustomCel ]} onClick={this.onClickCreateMediumCategory}>
                <Plus color={colors.primaryBlue} />&nbsp;&nbsp;&nbsp;Add Medium Category
              </CustomCel>
            </Row>
          </Rows>
          {this.state.create &&
            <PersistMediumCategoryModal
              onClose={() => this.setState({ create: false })}
              onSubmit={this.onSubmit} />}
          {typeof this.state.edit === 'string' &&
            <PersistMediumCategoryModal
              edit
              mediumCategoryId={this.state.edit}
              onClose={() => this.setState({ edit: false })}
              onSubmit={this.onSubmit} />}
        </Table>
      </div>
    );
  }

}
