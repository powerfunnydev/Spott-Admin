import moment from 'moment';
import React, { Component, PropTypes } from 'react';
import Masonry from 'react-masonry-component';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { routerPushWithReturnTo } from '../../../actions/global';
import ListView from '../../_common/components/listView/index';
import { isQueryChanged, tableDecorator, generalStyles, TotalEntries, Pagination } from '../../_common/components/table/index';
import Line from '../../_common/components/line';
import Radium from 'radium';
import * as actions from './actions';
import selector from './selector';
import UtilsBar from '../../_common/components/table/utilsBar';
import ToolTip from '../../_common/components/toolTip';
import { confirmation } from '../../_common/askConfirmation';
import Spott from '../spotts/list/spott';
import { slowdown } from '../../../utils';

/* eslint-disable react/no-set-state */
export const prefix = 'crops';
@tableDecorator(prefix)
@connect(selector, (dispatch) => ({
  deleteCrops: bindActionCreators(actions.deleteCrops, dispatch),
  deleteCrop: bindActionCreators(actions.deleteCrop, dispatch),
  load: bindActionCreators(actions.load, dispatch),
  routerPushWithReturnTo: bindActionCreators(routerPushWithReturnTo, dispatch),
  selectAllCheckboxes: bindActionCreators(actions.selectAllCheckboxes, dispatch),
  selectCheckbox: bindActionCreators(actions.selectCheckbox, dispatch)
}))
@Radium
export default class CropsList extends Component {

  static propTypes = {
    children: PropTypes.node,
    crops: ImmutablePropTypes.map.isRequired,
    deleteCrop: PropTypes.func.isRequired,
    deleteCrops: PropTypes.func.isRequired,
    isSelected: ImmutablePropTypes.map.isRequired,
    load: PropTypes.func.isRequired,
    location: PropTypes.shape({
      pathname: PropTypes.string.isRequired,
      query: PropTypes.object.isRequired
    }),
    // used in selectors
    mediumId: PropTypes.string.isRequired,
    pageCount: PropTypes.number,
    params: PropTypes.object.isRequired,
    routerPushWithReturnTo: PropTypes.func.isRequired,
    selectAllCheckboxes: PropTypes.func.isRequired,
    selectCheckbox: PropTypes.func.isRequired,
    totalResultCount: PropTypes.number.isRequired,
    onChangeDisplay: PropTypes.func.isRequired,
    onChangePage: PropTypes.func.isRequired,
    onChangeSearchString: PropTypes.func.isRequired,
    onSortField: PropTypes.func.isRequired
  }

  constructor (props) {
    super(props);
    this.onClickDeleteSelected = ::this.onClickDeleteSelected;
    this.slowSearch = slowdown(props.load, 300);
  }

  async componentWillMount () {
    const { load, location, mediumId } = this.props;
    await load(location.query, mediumId);
  }

  async componentWillReceiveProps (nextProps) {
    const nextQuery = nextProps.location.query;
    const query = this.props.location.query;
    if (isQueryChanged(query, nextQuery, prefix)) {
      await this.slowSearch(nextProps.location.query, this.props.mediumId);
    }
  }

  determineEditUrl (crop) {
    return `/content/spotts/edit/${crop.get('postId')}`;
  }
  determineReadUrl (crop) {
    return `/content/spotts/read/${crop.get('postId')}`;
  }

  getLastUpdatedOn (crop) {
    const date = new Date(crop.get('postLastUpdatedOn'));
    return moment(date).format('YYYY-MM-DD HH:mm');
  }

  getNameItem (crop) {
    const styles = {
      logo: {
        width: '22px',
        height: '22px',
        borderRadius: '2px'
      },
      logoContainer: {
        paddingRight: '10px',
        display: 'inline-flex'
      },
      logoPlaceholder: {
        paddingRight: '32px'
      },
      overlay: {
        height: '200px',
        objectFit: 'cover',
        width: '150px'
      }
    };
    return (
      <div style={{ alignItems: 'center', display: 'inline-flex' }}>
        {crop.get('image') && <div style={styles.logoContainer}>
          <ToolTip
            overlay={<img src={`${crop.getIn([ 'image', 'url' ])}?height=150&width=150`} style={styles.overlay}/>}
            placement='top'
            prefixCls='no-arrow'>
            <img src={`${crop.getIn([ 'image', 'url' ])}?height=150&width=150`} style={styles.logo} />
          </ToolTip>
        </div> || <div style={styles.logoPlaceholder}/>} {crop.get('title')}
      </div>
    );
  }

  async deleteCrop (cropId) {
    const result = await confirmation();
    if (result) {
      await this.props.deleteCrop(cropId);
      await this.props.load(this.props.location.query, this.props.mediumId);
    }
  }

  async onClickDeleteSelected () {
    const cropIds = [];
    this.props.isSelected.forEach((selected, key) => {
      if (selected && key !== 'ALL') {
        cropIds.push(key);
      }
    });
    await this.props.deleteCrops(cropIds);
    await this.props.load(this.props.location.query, this.props.mediumId);
  }

  render () {
    const { deleteCrop, mediumId, isSelected, pageCount, selectAllCheckboxes,
      selectCheckbox, totalResultCount, crops, location: { query: { cropsPage,
      cropsSearchString, cropsSortField, cropsSortDirection, cropsDisplay } }, onChangeDisplay,
      onChangePage, onChangeSearchString, onSortField } = this.props;
    const numberSelected = isSelected.reduce((total, selected, key) => selected && key !== 'ALL' ? total + 1 : total, 0);
    const columns = [
      { type: 'checkBox' },
      { type: 'custom', sort: true, sortField: 'POST_TITLE', title: 'TITLE', clickable: true, getUrl: this.determineReadUrl, convert: this.getNameItem, colspan: 2 },
      { type: 'custom', title: 'UPDATED BY', name: 'postLastUpdatedBy' },
      { type: 'custom', sort: true, sortField: 'LAST_UPDATED', title: 'LAST UPDATED ON', convert: this.getLastUpdatedOn },
      { type: 'custom', title: 'PUBLISH STATUS', name: 'publishStatus' },
      { type: 'dropdown' }
    ];
    return (
      <div style={generalStyles.border}>
        <div style={generalStyles.backgroundBar}>
          <div style={generalStyles.paddingLeftAndRight}>
            <UtilsBar
              display={cropsDisplay}
              isLoading={crops.get('_status') !== 'loaded'}
              numberSelected={numberSelected}
              searchString={cropsSearchString}
              topElement={<div onClick={this.onClickNewEntry}>Add Crop</div>}
              onChangeDisplay={onChangeDisplay}
              onChangeSearchString={onChangeSearchString}
              onClickNewEntry={this.onClickNewEntry}/>
          </div>
        </div>
        <Line/>
        <div style={[ generalStyles.backgroundTable, generalStyles.fillPage ]}>
          <div style={[ generalStyles.paddingTable, generalStyles.paddingLeftAndRight ]}>
            <TotalEntries
              entityType='Crops'
              numberSelected={numberSelected}
              totalResultCount={totalResultCount}
              onDeleteSelected={this.onClickDeleteSelected}/>
            {(cropsDisplay === undefined || cropsDisplay === 'list') &&
              <div>
                <ListView
                  columns={columns}
                  data={crops}
                  deleteItem={deleteCrop}
                  getEditUrl={this.determineEditUrl}
                  isSelected={isSelected}
                  load={() => this.props.load(this.props.location.query, mediumId)}
                  routerPushWithReturnTo={this.props.routerPushWithReturnTo}
                  selectAllCheckboxes={selectAllCheckboxes.bind(this, mediumId)}
                  sortDirection={cropsSortDirection}
                  sortField={cropsSortField}
                  onCheckboxChange={(id) => selectCheckbox.bind(this, id, mediumId)}
                  onSortField={(name) => onSortField.bind(this, name)} />
                <Pagination
                  currentPage={(cropsPage && (parseInt(cropsPage, 10) + 1) || 1)}
                  pageCount={pageCount}
                  onLeftClick={() => { onChangePage(parseInt(cropsPage, 10), false); }}
                  onRightClick={() => { onChangePage(parseInt(cropsPage, 10), true); }}/>
              </div>
            }
            {cropsDisplay === 'grid' &&
              <div>
                <Masonry>
                  {crops.get('data').map((crop, index) => (
                    <Spott
                      checked={isSelected.get(crop.get('id'))}
                      key={`crop${index}`}
                      spott={crop}
                      onCheckboxChange={selectCheckbox.bind(this, crop.get('id'), mediumId)}
                      onClick={() => { this.props.routerPushWithReturnTo(`/content/spotts/read/${crop.get('postId')}`); }}
                      onDelete={async (e) => { e.preventDefault(); await this.deleteCrop(crop.get('id')); }}
                      onEdit={(e) => { e.preventDefault(); this.props.routerPushWithReturnTo(`/content/spotts/edit/${crop.get('postId')}`); }}/>))}
                </Masonry>
                <Pagination currentPage={(cropsPage && (parseInt(cropsPage, 10) + 1) || 1)} pageCount={pageCount} onLeftClick={() => { onChangePage(parseInt(cropsPage, 10), false); }} onRightClick={() => { onChangePage(parseInt(cropsPage, 10), true); }}/>
              </div>
            }
        </div>
      </div>
    </div>

    );
  }

}
