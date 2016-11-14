import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import ImmutablePropTypes from 'react-immutable-proptypes';
import Radium from 'radium';
import Header from '../../app/header';
import { Root, Container } from '../../_common/styles';
import { DropdownCel, UtilsBar, isQueryChanged, tableDecorator, generalStyles, TotalEntries, headerStyles, NONE, sortDirections, CheckBoxCel, Table, Headers, CustomCel, Rows, Row, Pagination } from '../../_common/components/table/index';
import Line from '../../_common/components/line';
import Dropdown, { styles as dropdownStyles } from '../../_common/components/dropdown';
import * as actions from './actions';
import selector from './selector';
import { slowdown } from '../../../utils';

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
      pageCount, selectAllCheckboxes, selectCheckbox, totalResultCount, onChangeSearchString } = this.props;
    const numberSelected = isSelected.reduce((total, selected, key) => selected && key !== 'ALL' ? total + 1 : total, 0);
    return (
      <Root>
        <Header currentLocation={location} hideHomePageLinks />
        <div style={generalStyles.backgroundBar}>
          <Container >
            <UtilsBar
              display={display}
              isLoading={users.get('_status') !== 'loaded'}
              numberSelected={numberSelected}
              searchString={searchString}
              textCreateButton='New User'
              onChangeSearchString={(value) => { onChangeSearchString(value); this.slowSearch({ ...query, searchString: value }); }}
              onClickDeleteSelected={this.onClickDeleteSelected}
              onClickNewEntry={this.onClickNewEntry}/>
          </Container>
        </div>
        <Line/>
        <div style={[ generalStyles.backgroundTable, generalStyles.fillPage ]}>
          <Container style={generalStyles.paddingTable}>
            <TotalEntries totalResultCount={totalResultCount}/>
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
                          <CustomCel getValue={this.getUserName} objectToRender={user} style={{ flex: 2 }}/>
                          <CustomCel getValue={this.getEmail} objectToRender={user} style={{ flex: 2 }}/>
                          <CustomCel getValue={this.getFirstName} objectToRender={user} style={{ flex: 1 }} />
                          <CustomCel getValue={this.getLastName} objectToRender={user} style={{ flex: 1 }} />
                          <DropdownCel>
                            <Dropdown
                              elementShown={<div key={0} style={[ dropdownStyles.clickable, dropdownStyles.topElement ]} onClick={() => { this.props.routerPushWithReturnTo(`users/edit/${user.get('id')}`); }}>Edit</div>}>
                              <div key={1} style={[ dropdownStyles.option ]} onClick={async (e) => { e.preventDefault(); await this.deleteUser(user.get('id')); }}>Remove</div>
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
          </Container>
        </div>
        {children}
      </Root>
    );
  }
}
