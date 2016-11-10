import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { UtilsBar, isQueryChanged, tableDecorator, generalStyles, TotalEntries, headerStyles, NONE, sortDirections, CheckBoxCel, Table, Headers, CustomCel, Rows, Row, Pagination } from '../../../../_common/components/table/index';
import Line from '../../../../_common/components/line';
import Radium from 'radium';
import * as actions from './actions';
import selector from './selector';
import Dropdown, { styles as dropdownStyles } from '../../../../_common/components/dropdown';
import { slowdown } from '../../../../../utils';

/* eslint-disable no-alert */

const numberOfRows = 25;

export const prefix = 'users';

@tableDecorator(prefix)
@connect(selector, (dispatch) => ({
  deleteUser: bindActionCreators(actions.deleteUser, dispatch),
  deleteUsers: bindActionCreators(actions.deleteUsers, dispatch),
  load: bindActionCreators(actions.load, dispatch),
  selectAllCheckboxes: bindActionCreators(actions.selectAllCheckboxes, dispatch),
  selectCheckbox: bindActionCreators(actions.selectCheckbox, dispatch)
}))
@Radium
export default class Users extends Component {

  static propTypes = {
    deleteUser: PropTypes.func.isRequired,
    deleteUsers: PropTypes.func.isRequired,
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
    this.onClickNewEntry = ::this.onClickNewEntry;
    this.onClickDeleteSelected = ::this.onClickDeleteSelected;
    this.slowSearch = slowdown(props.load, 300);
  }

  async componentWillMount () {
    const broadcasterId = this.props.params.id;
    await this.props.load(this.props.location.query, broadcasterId);
  }

  async componentWillReceiveProps (nextProps) {
    const nextQuery = nextProps.location.query;
    const query = this.props.location.query;
    if (isQueryChanged(query, nextQuery, prefix)) {
      const broadcasterId = this.props.params.id;
      await this.slowSearch(nextProps.location.query, broadcasterId);
    }
  }

  async deleteUser (usersEntryId) {
    await this.props.deleteUser(usersEntryId);
    await this.props.load(this.props.location.query);
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

  onClickNewEntry (e) {
    e.preventDefault();
    this.props.routerPushWithReturnTo('users/create');
  }

  async onClickDeleteSelected (e) {
    e.preventDefault();
    const userIds = [];
    this.props.isSelected.forEach((selected, key) => {
      if (selected && key !== 'ALL') {
        userIds.push(key);
      }
    });
    await this.props.deleteUsers(userIds);
    await this.props.load(this.props.location.query, this.props.params.id);
  }

  render () {
    const { users, isSelected, location: { query: { usersDisplay, usersPage,
      usersSearchString, usersSortField, usersSortDirection } },
      pageCount, selectAllCheckboxes, selectCheckbox, totalResultCount,
      onChangeSearchString } = this.props;
    const numberSelected = isSelected.reduce((total, selected, key) => selected && key !== 'ALL' ? total + 1 : total, 0);
    return (
      <div style={generalStyles.border}>
        <div style={generalStyles.backgroundBar}>
          <div style={generalStyles.paddingLeftAndRight}>
            <UtilsBar
              isLoading={users.get('_status') !== 'loaded'}
              numberSelected={numberSelected}
              searchString={usersSearchString}
              textCreateButton='New User'
              onChangeSearchString={onChangeSearchString}
              onClickDeleteSelected={this.onClickDeleteSelected}
              onClickNewEntry={this.onClickNewEntry}/>
          </div>
        </div>
        <Line/>
        <div style={[ generalStyles.backgroundTable, generalStyles.fillPage ]}>
          <div style={[ generalStyles.paddingTable, generalStyles.paddingLeftAndRight ]}>
            <TotalEntries totalResultCount={totalResultCount}/>
            {(!usersDisplay || usersDisplay === 'list') &&
              <div>
                <Table>
                  <Headers>
                    {/* Be aware that width or flex of each headerCel and the related rowCel must be the same! */}
                    <CheckBoxCel checked={isSelected.get('ALL')} name='header' style={[ headerStyles.header, headerStyles.firstHeader, { flex: 0.25 } ]} onChange={selectAllCheckboxes}/>
                    <CustomCel sortColumn={this.props.onSortField.bind(this, 'USERNAME')} sortDirection = {usersSortField === 'USERNAME' ? sortDirections[usersSortDirection] : NONE} style={[ headerStyles.header, headerStyles.notFirstHeader, headerStyles.clickableHeader, { flex: 2 } ]}>Username</CustomCel>
                    <CustomCel style={[ headerStyles.header, headerStyles.notFirstHeader, { flex: 2 } ]}>Email</CustomCel>
                    <CustomCel style={[ headerStyles.header, headerStyles.notFirstHeader, { flex: 1 } ]}>First Name</CustomCel>
                    <CustomCel style={[ headerStyles.header, headerStyles.notFirstHeader, { flex: 1 } ]}>Last Name</CustomCel>
                    <CustomCel style={[ headerStyles.header, headerStyles.notFirstHeader, { flex: 1 } ]}/>
                  </Headers>
                  <Rows isLoading={users.get('_status') !== 'loaded'}>
                    {users.get('data').map((user, index) => {
                      return (
                        <Row index={index} isFirst={index % numberOfRows === 0} key={index} >
                          {/* Be aware that width or flex of each headerCel and the related rowCel must be the same! */}
                          <CheckBoxCel checked={isSelected.get(user.get('id'))} style={{ flex: 0.25 }} onChange={selectCheckbox.bind(this, user.get('id'))}/>
                          <CustomCel getValue={this.getUserName} objectToRender={user} style={{ flex: 2 }}/>
                          <CustomCel getValue={this.getEmail} objectToRender={user} style={{ flex: 2 }}/>
                          <CustomCel getValue={this.getFirstName} objectToRender={user} style={{ flex: 1 }} />
                          <CustomCel getValue={this.getLastName} objectToRender={user} style={{ flex: 1 }} />
                          <CustomCel style={{ flex: 1 }}>
                            <Dropdown
                              elementShown={<div key={0} style={[ dropdownStyles.clickable, dropdownStyles.topElement ]} onClick={() => { this.props.routerPushWithReturnTo(`users/edit/${user.get('id')}`); }}>Edit</div>}>
                              <div key={1} style={[ dropdownStyles.option ]} onClick={async (e) => { e.preventDefault(); await this.deleteUser(user.get('id')); }}>Remove</div>
                            </Dropdown>
                          </CustomCel>
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
          </div>
        </div>
      </div>
    );
  }
}
