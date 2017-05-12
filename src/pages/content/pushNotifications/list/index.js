import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Field } from 'redux-form/immutable';
import ImmutablePropTypes from 'react-immutable-proptypes';
import moment from 'moment';
import Radium from 'radium';
import * as actions from './actions';
import selector from './selector';
import SelectionDropdown from '../../../_common/components/selectionDropdown';
import { Root, Container, filterStyles } from '../../../_common/styles';
import { Tile, UtilsBar, getInformationFromQuery, isQueryChanged, tableDecorator, generalStyles, TotalEntries, Pagination } from '../../../_common/components/table/index';
import ListView from '../../../_common/components/listView/index';
import Line from '../../../_common/components/line';
import pushNotificationTypes from '../../../../constants/pushNotificationTypes';
import { routerPushWithReturnTo } from '../../../../actions/global';
import { slowdown } from '../../../../utils';
import { confirmation } from '../../../_common/askConfirmation';
import { SideMenu } from '../../../app/sideMenu';
import Header from '../../../app/multiFunctionalHeader';
import { SERIE } from '../../../../constants/mediumTypes'; // change-required
import { FilterContent } from '../../../_common/components/filterDropdown';

export const prefix = 'pushNotifications';
export const filterArray = [ 'affiliate', 'type', 'used' ];

@tableDecorator(prefix)
@connect(selector, (dispatch) => ({
  deletePushNotification: bindActionCreators(actions.deletePushNotification, dispatch),
  load: bindActionCreators(actions.load, dispatch),
  routerPushWithReturnTo: bindActionCreators(routerPushWithReturnTo, dispatch),
  selectAllCheckboxes: bindActionCreators(actions.selectAllCheckboxes, dispatch),
  selectCheckbox: bindActionCreators(actions.selectCheckbox, dispatch)
}))
@Radium
export default class PushNotifications extends Component {

  static propTypes = {
    children: PropTypes.node,
    deletePushNotification: PropTypes.func.isRequired,
    isSelected: ImmutablePropTypes.map.isRequired,
    load: PropTypes.func.isRequired,
    location: PropTypes.shape({
      pathname: PropTypes.string.isRequired,
      query: PropTypes.object.isRequired
    }),
    pageCount: PropTypes.number,
    pushNotifications: ImmutablePropTypes.map.isRequired,
    routerPushWithReturnTo: PropTypes.func.isRequired,
    selectAllCheckboxes: PropTypes.func.isRequired,
    selectCheckbox: PropTypes.func.isRequired,
    totalResultCount: PropTypes.number.isRequired,
    onChangeDisplay: PropTypes.func.isRequired,
    onChangeFilter: PropTypes.func.isRequired,
    onChangePage: PropTypes.func.isRequired,
    onChangeSearchString: PropTypes.func.isRequired,
    onSortField: PropTypes.func.isRequired
  };

  constructor (props) {
    super(props);
    this.onCreatePushNotification = ::this.onCreatePushNotification;
    this.onClickDeleteSelected = ::this.onClickDeleteSelected;
    this.slowSearch = slowdown(props.load, 300);
  }

  componentWillMount () {
    this.props.load(this.props.location.query);
  }

  async componentWillReceiveProps (nextProps) {
    // routeUrl is the url that corresponds with this route.
    const routeUrl = '/content/push-notifications';
    const nextQuery = nextProps.location.query;
    const query = this.props.location.query;
    const nextPathname = nextProps.location.pathname;
    const pathname = this.props.location.pathname;
    // If we opened a modal, like a create modal and we have created a entity, we come back
    // to the previous page. If this page is the same as routeUrl, we do a load.
    // If the query changed (e.g. searchString changed), we do also a load.

    if ((pathname !== routeUrl && nextPathname === routeUrl) || isQueryChanged(query, nextQuery, prefix, filterArray)) {
      // this.slowSearch(nextQuery);
      // console.log('getInformationFromQuery(nextQuery, prefix, filterArray)', getInformationFromQuery(nextQuery, prefix, filterArray));
      this.slowSearch(getInformationFromQuery(nextQuery, prefix, filterArray));
    }
  }

  async deletePushNotification (pushNotificationId, type) {
    const result = await confirmation();
    if (result) {
      await this.props.deletePushNotification(pushNotificationId, type);
      await this.props.load(this.props.location.query);
    }
  }

  determineReadUrl (pushNotification) {
    return `/content/push-notifications/read/${pushNotification.get('id')}`;
  }

  determineEditUrl (pushNotification) {
    return `/content/push-notifications/edit/${pushNotification.get('id')}`;
  }

  getLastUpdatedOn (medium) {
    const date = new Date(medium.get('lastUpdatedOn'));
    return moment(date).format('YYYY-MM-DD HH:mm');
  }

  onCreatePushNotification (e) {
    e.preventDefault();
    this.props.routerPushWithReturnTo('/content/push-notifications/create');
  }

  async onClickDeleteSelected (type) {
    const isSelectedJS = this.props.isSelected.toJS();
    for (const key of Object.keys(isSelectedJS)) {
      const selected = isSelectedJS[key];
      if (selected && key !== 'ALL') {
        await this.props.deletePushNotification(key, this.props.pushNotifications.getIn([ key, 'type' ]));
      }
    }
    await this.props.load(this.props.location.query);
  }

  render () {
    const { pushNotifications, children, isSelected, location: { /* query,*/ query: { display, pushNotificationsPage, searchString, sortField, sortDirection } },
      pageCount, selectAllCheckboxes, selectCheckbox, totalResultCount, /* onChangeDisplay, onChangeSearchString,*/ onChangeFilter, deletePushNotification } = this.props;
    const columns = [
      { type: 'checkBox' },
      { type: 'custom', title: 'TYPE', clickable: true, getUrl: this.determineReadUrl, name: 'type' },
      { type: 'custom', title: 'DATA', name: 'payloadData' },
      { type: 'custom', title: 'UPDATED BY', name: 'lastUpdatedBy' },
      { type: 'custom', title: 'LAST UPDATED ON', name: 'lastUpdatedOn', dataType: 'date' },
      { type: 'custom', title: 'PUSHED ON', name: 'pushedOn', dataType: 'date' },
      { type: 'dropdown' }
    ];
    const page = pushNotificationsPage;
    const numberSelected = isSelected.reduce((total, selected, key) => selected && key !== 'ALL' ? total + 1 : total, 0);
    return (
      <SideMenu>
        <Root>
          <Header hierarchy={[
            { title: 'Push Notifications', url: '/content/push-notifications' } ]}/>
          <div style={generalStyles.backgroundBar}>
            <Container>
              <UtilsBar
                display={display}
                filterContent={
                  <FilterContent
                    form='pushNotificationList'
                    initialValues={{ type: null }}
                    style={filterStyles.filterContent}
                    onApplyFilter={onChangeFilter}>
                    <div style={[ filterStyles.row, filterStyles.firstRow ]}>
                      <div style={filterStyles.title}>Type</div>
                      <Field
                        component={SelectionDropdown}
                        getItemText={(key) => pushNotificationTypes[key]}
                        name='type'
                        options={Object.keys(pushNotificationTypes)}
                        placeholder='Type'
                        style={filterStyles.fullWidth}/>
                    </div>
                  </FilterContent>
                }
                isLoading={pushNotifications.get('_status') !== 'loaded'}
                numberSelected={numberSelected}
                searchString={searchString}
                textCreateButton='New Push Notification'
                onChangeDisplay={null/* onChangeDisplay*/}
                onChangeSearchString={null /* (value) => { onChangeSearchString(value); this.slowSearch({ ...query, searchString: value }); }*/}
                onClickNewEntry={this.onCreatePushNotification}/>
            </Container>
          </div>
          <Line/>
          <div style={[ generalStyles.backgroundTable, generalStyles.fillPage ]}>
            <Container style={generalStyles.paddingTable}>
              <TotalEntries
                entityType='All Push Notifications'
                numberSelected={numberSelected}
                totalResultCount={totalResultCount}
                onDeleteSelected={this.onClickDeleteSelected}/>
              {(display === undefined || display === 'list') &&
                <div>
                  <ListView
                    columns={columns}
                    data={pushNotifications}
                    deleteItem={deletePushNotification}
                    getEditUrl={this.determineEditUrl}
                    isSelected={isSelected}
                    load={() => this.props.load(this.props.location.query)}
                    selectAllCheckboxes={selectAllCheckboxes}
                    sortDirection={sortDirection}
                    sortField={sortField}
                    onCheckboxChange={(id) => selectCheckbox.bind(this, id)}
                    onSortField={(name) => this.props.onSortField.bind(this, name)} />
                  <Pagination currentPage={(page && (parseInt(page, 10) + 1) || 1)} pageCount={pageCount} onLeftClick={() => { this.props.onChangePage(parseInt(page, 10), false); }} onRightClick={() => { this.props.onChangePage(parseInt(page, 10), true); }}/>
                </div>
              }
              {display === 'grid' &&
                <div>
                  <div style={generalStyles.row}>
                    {pushNotifications.get('data').map((item, index) => (
                      <Tile
                        checked={isSelected.get(item.get('id'))}
                        imageUrl={item.get('profileImage') && `${item.getIn([ 'profileImage', 'url' ])}?height=203&width=360`}
                        key={`item${index}`}
                        text={item.get('title')}
                        onCheckboxChange={selectCheckbox.bind(this, item.get('id'))}
                        onClick={() => { const readUrl = this.determineReadUrl(item); readUrl && this.props.routerPushWithReturnTo(readUrl); }}
                        onDelete={async (e) => { await this.deleteMedium(item.get('id'), item.get('type')); }}
                        onEdit={(e) => { const editUrl = this.determineEditUrl(item); editUrl && this.props.routerPushWithReturnTo(editUrl); }}/>
                    ))}
                    <Tile key={'createMedium'} onCreate={this.onCreateEntity.bind(this, SERIE)}/>
                  </div>
                  <Pagination currentPage={(page && (parseInt(page, 10) + 1) || 1)} pageCount={pageCount} onLeftClick={() => { this.props.onChangePage(parseInt(page, 10), false); }} onRightClick={() => { this.props.onChangePage(parseInt(page, 10), true); }}/>
                </div>
              }
            </Container>
          </div>
          {children}
        </Root>
      </SideMenu>
    );
  }

}
