import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import ImmutablePropTypes from 'react-immutable-proptypes';
import Radium from 'radium';
import { Root, Container } from '../../_common/styles';
import { Tile, UtilsBar, isQueryChanged, tableDecorator, generalStyles, TotalEntries, Pagination } from '../../_common/components/table/index';
import Line from '../../_common/components/line';
import ListView from '../../_common/components/listView/index';
import * as actions from './actions';
import selector from './selector';
import { slowdown } from '../../../utils';
import { SideMenu } from '../../app/sideMenu';
import Header from '../../app/multiFunctionalHeader';

@tableDecorator()
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
    children: PropTypes.node,
    deleteUser: PropTypes.func.isRequired,
    deleteUsers: PropTypes.func.isRequired,
    isSelected: ImmutablePropTypes.map.isRequired,
    load: PropTypes.func.isRequired,
    location: PropTypes.shape({
      pathname: PropTypes.string.isRequired,
      query: PropTypes.object.isRequired
    }),
    pageCount: PropTypes.number,
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
    await this.props.load(this.props.location.query);
  }

  async componentWillReceiveProps (nextProps) {
    const nextQuery = nextProps.location.query;
    const query = this.props.location.query;
    if (isQueryChanged(query, nextQuery)) {
      await this.slowSearch(nextQuery);
    }
  }

  determineReadUrl (user) {
    return `/users/read/${user.get('id')}`;
  }

  determineEditUrl (user) {
    return `/users/edit/${user.get('id')}`;
  }

  async onDeleteUser (userId) {
    await this.props.deleteUser(userId);
    await this.props.load(this.props.location.query);
  }

  onEditEntry (userId) {
    this.props.routerPushWithReturnTo(`/users/edit/${userId}`);
  }

  onClickNewEntry (e) {
    e.preventDefault();
    this.props.routerPushWithReturnTo('users/create');
  }

  async onClickDeleteSelected () {
    const usersEntryIds = [];
    this.props.isSelected.forEach((selected, key) => {
      if (selected && key !== 'ALL') {
        usersEntryIds.push(key);
      }
    });
    await this.props.deleteUsers(usersEntryIds);
    await this.props.load(this.props.location.query);
  }

  render () {
    const { users, children, deleteUser, isSelected, location, location: { query, query: { display, page, searchString, sortField, sortDirection } },
      pageCount, selectAllCheckboxes, selectCheckbox, totalResultCount, onChangeSearchString, onChangeDisplay } = this.props;
    const numberSelected = isSelected.reduce((total, selected, key) => selected && key !== 'ALL' ? total + 1 : total, 0);
    const columns = [
      { type: 'checkBox' },
      { type: 'custom', sort: true, sortField: 'USERNAME', title: 'USERNAME', clickable: true, getUrl: this.determineReadUrl, name: 'userName', colspan: 2 },
      { type: 'custom', title: 'EMAIL', name: 'email', colspan: 2 },
      { type: 'custom', title: 'FIRST NAME', name: 'firstName', colspan: 1 },
      { type: 'custom', title: 'LAST NAME', name: 'lastName', colspan: 1 },
      { type: 'dropdown' }
    ];
    return (
      <SideMenu location={location}>
        <Root>
          <Header hierarchy={[ { title: 'Users', url: '/users' } ]}/>
          <div style={generalStyles.backgroundBar}>
            <Container >
              <UtilsBar
                display={display}
                isLoading={users.get('_status') !== 'loaded'}
                searchString={searchString}
                textCreateButton='New User'
                onChangeDisplay={onChangeDisplay}
                onChangeSearchString={(value) => { onChangeSearchString(value); this.slowSearch({ ...query, searchString: value }); }}
                onClickNewEntry={this.onClickNewEntry}/>
            </Container>
          </div>
          <Line/>
          <div style={[ generalStyles.backgroundTable, generalStyles.fillPage ]}>
            <Container style={generalStyles.paddingTable}>
              <TotalEntries
                entityType='Users'
                numberSelected={numberSelected}
                totalResultCount={totalResultCount}
                onDeleteSelected={this.onClickDeleteSelected}/>
              {(!display || display === 'list') &&
                <div>
                  <ListView
                    columns={columns}
                    data={users}
                    deleteItem={deleteUser}
                    getEditUrl={this.determineEditUrl}
                    isSelected={isSelected}
                    load={() => this.props.load(this.props.location.query)}
                    routerPushWithReturnTo={this.props.routerPushWithReturnTo}
                    selectAllCheckboxes={selectAllCheckboxes}
                    sortDirection={sortDirection}
                    sortField={sortField}
                    onCheckboxChange={(id) => selectCheckbox.bind(this, id)}
                    onSortField={(name) => this.props.onSortField.bind(this, name)} />

                  <Pagination
                    currentPage={(page && (parseInt(page, 10) + 1) || 1)}
                    pageCount={pageCount}
                    onLeftClick={() => { this.props.onChangePage(parseInt(page, 10), false); }}
                    onRightClick={() => { this.props.onChangePage(parseInt(page, 10), true); }}/>
                </div>
              }
              {display === 'grid' &&
                <div>
                  <div style={generalStyles.row}>
                    { users.get('data').map((user, index) => (
                      <Tile
                        checked={isSelected.get(user.get('id'))}
                        deleteText='Remove'
                        imageUrl={user.get('avatar') && `${user.getIn([ 'avatar', 'url' ])}?height=310&width=310`}
                        key={`user${index}`}
                        text={user.get('name')}
                        onCheckboxChange={selectCheckbox.bind(this, user.get('id'))}
                        onClick={() => { this.props.routerPushWithReturnTo(`/users/read/${user.get('id')}`); }}
                        onDelete={this.onDeleteUser.bind(this, user.get('id'))}
                        onEdit={this.onEditEntry.bind(this, user.get('id'))}/>
                    ))}
                    <Tile key={'createBroadcaster'} onCreate={this.onClickNewEntry}/>
                  </div>
                  <Pagination
                    currentPage={(page && (parseInt(page, 10) + 1) || 1)}
                    pageCount={pageCount}
                    onLeftClick={() => { this.props.onChangePage(parseInt(page, 10), false); }}
                    onRightClick={() => { this.props.onChangePage(parseInt(page, 10), true); }}/>
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
