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
import PersistShopModal from '../persist';
import * as actions from './actions';

@connect(null, (dispatch) => ({
  deleteMediumShop: bindActionCreators(actions.deleteMediumShop, dispatch),
  loadMediumShops: bindActionCreators(actions.searchMediumShops, dispatch),
  persistMediumShop: bindActionCreators(actions.persistMediumShop, dispatch)
}))
@Radium
export default class Shops extends Component {

  static propTypes = {
    deleteMediumShop: PropTypes.func.isRequired,
    loadMediumShops: PropTypes.func.isRequired,
    mediumId: PropTypes.string.isRequired,
    mediumShops: ImmutablePropTypes.map.isRequired,
    persistMediumShop: PropTypes.func.isRequired,
    searchShops: PropTypes.func.isRequired,
    searchedShopIds: ImmutablePropTypes.map.isRequired,
    shopsById: ImmutablePropTypes.map.isRequired
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
    const { loadMediumShops, mediumId } = this.props;
    loadMediumShops(mediumId);
  }

  onClickNewEntry (e) {
    e.preventDefault();
    this.setState({ create: true });
  }

  async onClickDeleteMediumShop (shopId) {
    const { mediumId, loadMediumShops, deleteMediumShop } = this.props;
    await deleteMediumShop({ mediumId, shopId });
    await loadMediumShops(mediumId);
  }

  async onSubmit (form) {
    const { shopId } = form;
    const { loadMediumShops, mediumId, persistMediumShop } = this.props;
    await persistMediumShop({ mediumId, shopId });
    await loadMediumShops(mediumId);
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
    const { mediumShops, searchShops, shopsById, searchedShopIds } = this.props;
    return (
      <Section>
        <FormSubtitle first>Shops</FormSubtitle>
        <FormDescription style={styles.description}>Which shops are starring in this content? This way we’ll do a better job suggesting the right products.</FormDescription>
        <Table style={styles.customTable}>
          <Rows style={styles.adaptedRows}>
            {mediumShops.get('data').map((shop, index) => {
              return (
                <Row isFirst={index === 0} key={index} >
                  <CustomCel style={[ styles.adaptedCustomCel, styles.paddingLeft ]}>
                    <img src={shop.get('logo') && `${shop.getIn([ 'logo', 'url' ])}?height=70&width=70`} style={styles.image}/>
                  </CustomCel>
                  <CustomCel style={styles.adaptedCustomCel}>{shop.get('name')}</CustomCel>
                  <CustomCel style={[ styles.adaptedCustomCel, styles.floatRight ]}>
                    <RemoveButton cross onClick={this.onClickDeleteMediumShop.bind(this, shop.get('id'))}/>
                  </CustomCel>
                </Row>
              );
            })}
            <Row isFirst={mediumShops.get('data') && mediumShops.get('data').size === 0} >
              <CustomCel style={[ styles.add, styles.adaptedCustomCel ]} onClick={this.onClickNewEntry}>
                <Plus color={colors.primaryBlue} />&nbsp;&nbsp;&nbsp;Add Shop
              </CustomCel>
            </Row>
          </Rows>
          {this.state.create &&
            <PersistShopModal
              searchShops={searchShops}
              searchedShopIds={searchedShopIds}
              shopsById={shopsById}
              onClose={() => this.setState({ create: false })}
              onSubmit={this.onSubmit} />}
        </Table>
      </Section>
    );
  }

}
