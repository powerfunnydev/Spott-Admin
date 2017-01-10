/* eslint-disable react/no-set-state */
import React, { Component, PropTypes } from 'react';
import Radium from 'radium';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Section from '../../../../_common/components/section';
import { Table, CustomCel, Rows, Row } from '../../../../_common/components/table/index';
import { colors, fontWeights, makeTextStyle, FormSubtitle, FormDescription } from '../../../../_common/styles';
import Plus from '../../../../_common/images/plus';
import RemoveButton from '../../../../_common/components/buttons/removeButton';
import PersistBrandModal from '../persist';
import * as actions from './actions';

@connect(null, (dispatch) => ({
  loadMediumBrands: bindActionCreators(actions.searchMediumBrands, dispatch),
  persistMediumBrand: bindActionCreators(actions.persistMediumBrand, dispatch),
  deleteMediumBrand: bindActionCreators(actions.deleteMediumBrand, dispatch)
}))
@Radium
export default class Brands extends Component {

  static propTypes = {
    brandsById: ImmutablePropTypes.map.isRequired,
    deleteMediumBrand: PropTypes.func.isRequired,
    loadMediumBrands: PropTypes.func.isRequired,
    mediumBrands: ImmutablePropTypes.map.isRequired,
    mediumId: PropTypes.string.isRequired,
    persistMediumBrand: PropTypes.func.isRequired,
    searchBrands: PropTypes.func.isRequired,
    searchedBrandIds: ImmutablePropTypes.map.isRequired
  };

  constructor (props) {
    super(props);
    this.onClickNewEntry = ::this.onClickNewEntry;
    this.onSubmit = :: this.onSubmit;
    this.state = {
      create: false,
      edit: false
    };
  }

  componentWillMount () {
    const { loadMediumBrands, mediumId } = this.props;
    loadMediumBrands(mediumId);
  }

  onClickNewEntry (e) {
    e.preventDefault();
    this.setState({ create: true });
  }

  async onClickDeleteMediumBrand (brandId) {
    const { mediumId, loadMediumBrands, deleteMediumBrand } = this.props;
    await deleteMediumBrand({ brandId, mediumId });
    await loadMediumBrands(mediumId);
  }

  async onSubmit (form) {
    const { brandId } = form;
    const { loadMediumBrands, persistMediumBrand, mediumId } = this.props;
    await persistMediumBrand({ brandId, mediumId });
    await loadMediumBrands(mediumId);
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
    image: {
      width: '2em',
      height: '2em',
      objectFit: 'scale-down'
    },
    adaptedCustomCel: {
      fontSize: '11px',
      paddingTop: '4px',
      paddingBottom: '4px',
      paddingLeft: '0px',
      minHeight: '30px'
    },
    paddingLeft: {
      paddingLeft: '11px'
    },
    adaptedRows: {
      minHeight: '3.75em'
    },
    floatRight: {
      marginLeft: 'auto'
    },
    customTable: {
      border: `1px solid ${colors.lightGray2}`
    }
  };

  render () {
    const styles = this.constructor.styles;
    const { mediumBrands, searchBrands, brandsById, searchedBrandIds } = this.props;
    return (
      <Section>
        <FormSubtitle first>Brands</FormSubtitle>
        <FormDescription style={styles.description}>Which brands are starring in this content? This way we’ll do a better job detecting their faces automagically!</FormDescription>
        <Table style={styles.customTable}>
          <Rows style={styles.adaptedRows}>
            {mediumBrands.get('data').map((brand, index) => {
              return (
                <Row isFirst={index === 0} key={index} >
                  <CustomCel style={[ styles.adaptedCustomCel, styles.paddingLeft ]}>
                    <img src={brand.get('logo') && `${brand.getIn([ 'logo', 'url' ])}?height=70&width=70`} style={styles.image}/>
                  </CustomCel>
                  <CustomCel style={styles.adaptedCustomCel}>{brand.get('name')}</CustomCel>
                  <CustomCel style={[ styles.adaptedCustomCel, styles.floatRight ]}>
                    <RemoveButton cross onClick={this.onClickDeleteMediumBrand.bind(this, brand.get('id'))}/>
                  </CustomCel>
                </Row>
              );
            })}
            <Row isFirst={mediumBrands.get('data') && mediumBrands.get('data').size === 0} >
              <CustomCel style={[ styles.add, styles.adaptedCustomCel ]} onClick={this.onClickNewEntry}>
                <Plus color={colors.primaryBlue} />&nbsp;&nbsp;&nbsp;Add Brand
              </CustomCel>
            </Row>
          </Rows>
          {this.state.create &&
            <PersistBrandModal
              brandsById={brandsById}
              searchBrands={searchBrands}
              searchedBrandIds={searchedBrandIds}
              onClose={() => this.setState({ create: false })}
              onSubmit={this.onSubmit} />}
        </Table>
      </Section>
    );
  }

}
