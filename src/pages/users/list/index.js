import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import ImmutablePropTypes from 'react-immutable-proptypes';
import Radium from 'radium';
import { Root, Container } from '../../_common/styles';
import { Tile, DropdownCel, UtilsBar, isQueryChanged, tableDecorator, generalStyles, TotalEntries, headerStyles, NONE, sortDirections, CheckBoxCel, Table, Headers, CustomCel, Rows, Row, Pagination } from '../../_common/components/table/index';
import Line from '../../_common/components/line';
import Dropdown, { styles as dropdownStyles } from '../../_common/components/actionDropdown';
import * as actions from './actions';
import selector from './selector';
import { slowdown } from '../../../utils';
import { SideMenu } from '../../app/sideMenu';

const numberOfRows = 25;

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
    const { users, children, isSelected, location, location: { query, query: { display, page, searchString, sortField, sortDirection } },
      pageCount, selectAllCheckboxes, selectCheckbox, totalResultCount, onChangeSearchString, onChangeDisplay } = this.props;
    const numberSelected = isSelected.reduce((total, selected, key) => selected && key !== 'ALL' ? total + 1 : total, 0);
    return (
      <SideMenu location={location}>
        <Root>
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
                  <Table>
                    <Headers>
                      {/* Be aware that width or flex of each headerCel and the related rowCel must be the same! */}
                      <CheckBoxCel checked={isSelected.get('ALL')} name='header' style={[ headerStyles.header, headerStyles.firstHeader ]} onChange={selectAllCheckboxes}/>
                      <CustomCel sortColumn={this.props.onSortField.bind(this, 'USERNAME')} sortDirection = {sortField === 'USERNAME' ? sortDirections[sortDirection] : NONE} style={[ headerStyles.header, headerStyles.notFirstHeader, headerStyles.clickableHeader, { flex: 2 } ]}>Username</CustomCel>
                      <CustomCel style={[ headerStyles.header, headerStyles.notFirstHeader, { flex: 2 } ]}>Email</CustomCel>
                      <CustomCel style={[ headerStyles.header, headerStyles.notFirstHeader, { flex: 1 } ]}>First Name</CustomCel>
                      <CustomCel style={[ headerStyles.header, headerStyles.notFirstHeader, { flex: 1 } ]}>Last Name</CustomCel>
                      <CustomCel style={[ headerStyles.header, headerStyles.notFirstHeader, { flex: '0 0 110px' } ]}/>
                    </Headers>
                    <Rows isLoading={users.get('_status') !== 'loaded'}>
                      {users.get('data').map((user, index) => {
                        return (
                          <Row index={index} isFirst={index % numberOfRows === 0} key={index} >
                            {/* Be aware that width or flex of each headerCel and the related rowCel must be the same! */}
                            <CheckBoxCel checked={isSelected.get(user.get('id'))} onChange={selectCheckbox.bind(this, user.get('id'))}/>
                            <CustomCel style={{ flex: 2 }} onClick={() => { this.props.routerPushWithReturnTo(`/users/read/${user.get('id')}`); }}>{user.get('userName')}</CustomCel>
                            <CustomCel style={{ flex: 2 }}>{user.get('email')}</CustomCel>
                            <CustomCel style={{ flex: 1 }}>{user.get('firstName')}</CustomCel>
                            <CustomCel style={{ flex: 1 }}>{user.get('lastName')}</CustomCel>
                            <DropdownCel>
                              <Dropdown
                                elementShown={<div key={0} style={[ dropdownStyles.clickable, dropdownStyles.option, dropdownStyles.borderLeft ]} onClick={this.onEditEntry.bind(this, user.get('id'))}>Edit</div>}>
                                <div key={1} style={dropdownStyles.floatOption} onClick={this.onDeleteUser.bind(this, user.get('id'))}>Remove</div>
                              </Dropdown>
                            </DropdownCel>
                          </Row>
                        );
                      })}
                    </Rows>
                  </Table>
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
