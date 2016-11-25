import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { Tile, DropdownCel, UtilsBar, isQueryChanged, tableDecorator, generalStyles, TotalEntries, headerStyles, NONE, sortDirections, CheckBoxCel, Table, Headers, CustomCel, Rows, Row, Pagination } from '../../../../../_common/components/table/index';
import Line from '../../../../../_common/components/line';
import Radium from 'radium';
import * as actions from './actions';
import selector from './selector';
import Dropdown, { styles as dropdownStyles } from '../../../../../_common/components/actionDropdown';
import { slowdown } from '../../../../../../utils';

/* eslint-disable no-alert */

const numberOfRows = 25;

export const prefix = 'users';

@tableDecorator(prefix)
@connect(selector, (dispatch) => ({
  deleteLinkUser: bindActionCreators(actions.deleteLinkUser, dispatch),
  // deleteLinkUsers: bindActionCreators(actions.deleteLinkUsers, dispatch),
  load: bindActionCreators(actions.load, dispatch),
  selectAllCheckboxes: bindActionCreators(actions.selectAllCheckboxes, dispatch),
  selectCheckbox: bindActionCreators(actions.selectCheckbox, dispatch)
}))
@Radium
export default class Users extends Component {

  static propTypes = {
    deleteLinkUser: PropTypes.func.isRequired,
    // deleteLinkUsers: PropTypes.func.isRequired,
    isSelected: ImmutablePropTypes.map.isRequired,
    load: PropTypes.func.isRequired,
    location: PropTypes.shape({
      pathname: PropTypes.string.isRequired,
      query: PropTypes.object.isRequired
    }),
    pageCount: PropTypes.number,
    params: PropTypes.object.isRequired,
    routerPushWithReturnTo: PropTypes.func.isRequired,
    selectAllCheckboxes: PropTypes.func.isRequired,
    selectCheckbox: PropTypes.func.isRequired,
    totalResultCount: PropTypes.number.isRequired,
    users: ImmutablePropTypes.map.isRequired,
    onChangeDisplay: PropTypes.func.isRequired,
    onChangePage: PropTypes.func.isRequired,
    onChangeSearchString: PropTypes.func.isRequired,
    onSortField: PropTypes.func.isRequired
  };

  constructor (props) {
    super(props);
    // this.deleteLinkUser = ::this.deleteLinkUser;
    this.onClickNewEntry = ::this.onClickNewEntry;
    this.onClickDeleteSelected = ::this.onClickDeleteSelected;
    this.slowSearch = slowdown(props.load, 300);
  }

  async componentWillMount () {
    const contentProducerId = this.props.params.id;
    await this.props.load(this.props.location.query, contentProducerId);
  }

  async componentWillReceiveProps (nextProps) {
    const nextQuery = nextProps.location.query;
    const query = this.props.location.query;
    if (isQueryChanged(query, nextQuery, prefix)) {
      const contentProducerId = this.props.params.id;
      await this.slowSearch(nextProps.location.query, contentProducerId);
    }
  }

  getUserName (user) {
    return user.get('userName');
  }

  getEmail (user) {
    return user.get('email');
  }

  getFirstName (user) {
    return user.get('firstName');
  }

  getLastName (user) {
    return user.get('lastName');
  }

  async onDeleteLinkUser (userId) {
    await this.props.deleteLinkUser(this.props.params.id, userId);
    await this.props.load(this.props.location.query, this.props.params.id);
  }

  onClickNewEntry (e) {
    e.preventDefault();
    this.props.routerPushWithReturnTo(`content/content-producers/read/${this.props.params.id}/link/user`);
  }

  onEditEntry (userId) {
    this.props.routerPushWithReturnTo(`users/edit/${userId}`);
  }

  async onClickDeleteSelected (e) {
    e.preventDefault();
    const userIds = [];
    this.props.isSelected.forEach((selected, key) => {
      if (selected && key !== 'ALL') {
        userIds.push(key);
      }
    });
    // await this.props.deleteLinkUsers(userIds);
    await this.props.load(this.props.location.query, this.props.params.id);
  }

  render () {
    const { users, isSelected, location: { query: { usersDisplay, usersPage,
      usersSearchString, usersSortField, usersSortDirection } },
      pageCount, selectAllCheckboxes, selectCheckbox, totalResultCount,
      onChangeDisplay, onChangeSearchString } = this.props;
    const numberSelected = isSelected.reduce((total, selected, key) => selected && key !== 'ALL' ? total + 1 : total, 0);
    return (
      <div style={generalStyles.border}>
        <div style={generalStyles.backgroundBar}>
          <div style={generalStyles.paddingLeftAndRight}>
            <UtilsBar
              display={usersDisplay}
              isLoading={users.get('_status') !== 'loaded'}
              numberSelected={numberSelected}
              searchString={usersSearchString}
              textCreateButton='Link user'
              onChangeDisplay={onChangeDisplay}
              onChangeSearchString={onChangeSearchString}
              onClickNewEntry={this.onClickNewEntry}/>
          </div>
        </div>
        <Line/>
        <div style={[ generalStyles.backgroundTable, generalStyles.fillPage, generalStyles.whiteBackground ]}>
          <div style={[ generalStyles.paddingTable, generalStyles.paddingLeftAndRight ]}>
            <TotalEntries totalResultCount={totalResultCount}/>
            {(!usersDisplay || usersDisplay === 'list') &&
              <div>
                <Table style={generalStyles.lightGrayBorder}>
                  <Headers>
                    {/* Be aware that width or flex of each headerCel and the related rowCel must be the same! */}
                    <CheckBoxCel checked={isSelected.get('ALL')} name='header' style={[ headerStyles.header, headerStyles.firstHeader ]} onChange={selectAllCheckboxes}/>
                    <CustomCel sortColumn={this.props.onSortField.bind(this, 'USERNAME')} sortDirection = {usersSortField === 'USERNAME' ? sortDirections[usersSortDirection] : NONE} style={[ headerStyles.header, headerStyles.notFirstHeader, headerStyles.clickableHeader, { flex: 2 } ]}>Username</CustomCel>
                    <CustomCel style={[ headerStyles.header, headerStyles.notFirstHeader, { flex: 2 } ]}>Email</CustomCel>
                    <CustomCel style={[ headerStyles.header, headerStyles.notFirstHeader, { flex: 1 } ]}>First Name</CustomCel>
                    <CustomCel style={[ headerStyles.header, headerStyles.notFirstHeader, { flex: 1 } ]}>Last Name</CustomCel>
                    <DropdownCel style={[ headerStyles.header, headerStyles.notFirstHeader ]}/>
                  </Headers>
                  <Rows isLoading={users.get('_status') !== 'loaded'}>
                    {users.get('data').map((user, index) => {
                      return (
                        <Row index={index} isFirst={index % numberOfRows === 0} key={index} >
                          {/* Be aware that width or flex of each headerCel and the related rowCel must be the same! */}
                          <CheckBoxCel checked={isSelected.get(user.get('id'))} onChange={selectCheckbox.bind(this, user.get('id'))}/>
                          <CustomCel getValue={this.getUserName} objectToRender={user} style={{ flex: 2 }}/>
                          <CustomCel getValue={this.getEmail} objectToRender={user} style={{ flex: 2 }}/>
                          <CustomCel getValue={this.getFirstName} objectToRender={user} style={{ flex: 1 }} />
                          <CustomCel getValue={this.getLastName} objectToRender={user} style={{ flex: 1 }} />
                          <DropdownCel>
                            <Dropdown
                              elementShown={<div key={0} style={[ dropdownStyles.clickable, dropdownStyles.topElement ]} onClick={this.onEditEntry.bind(this, user.get('id'))}>Edit</div>}>
                              <div key={1} style={[ dropdownStyles.option ]} onClick={this.onDeleteLinkUser.bind(this, user.get('id'))}>Remove link</div>
                            </Dropdown>
                          </DropdownCel>
                        </Row>
                      );
                    })}
                  </Rows>
                </Table>
                <Pagination
                  currentPage={(usersPage && (parseInt(usersPage, 10) + 1) || 1)}
                  pageCount={pageCount}
                  onLeftClick={() => { this.props.onChangePage(parseInt(usersPage, 10), false); }}
                  onRightClick={() => { this.props.onChangePage(parseInt(usersPage, 10), true); }}/>
              </div>
            }
            {usersDisplay === 'grid' &&
              <div style={generalStyles.row}>
                { users.get('data').map((user, index) => (
                  <Tile
                    imageUrl={user.getIn([ 'avatar', 'url' ])}
                    key={`user${index}`}
                    text={this.getUserName(user)}
                    onDelete={this.onDeleteLinkUser.bind(this, user.get('id'))}
                    onEdit={this.onEditEntry.bind(this, user.get('id'))}/>
                ))}
                <Tile key={'createBroadcaster'} onCreate={this.onClickNewEntry}/>
              </div>
            }
          </div>
        </div>
      </div>
    );
  }
}
