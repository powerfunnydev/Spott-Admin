import React, { Component, PropTypes } from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import moment from 'moment';
import { DropdownCel, headerStyles, NONE, sortDirections, CheckBoxCel, Table, Headers, CustomCel, Rows, Row } from '../table/index';
import Dropdown, { styles as dropdownStyles } from '../actionDropdown';
import { confirmation } from '../../askConfirmation';

const numberOfRows = 25;
class ListView extends Component {

  getFormatedDate = (dateString) => {
    const date = new Date(dateString);
    return moment(date).format('YYYY-MM-DD HH:mm');
  }

  async deleteItem (id, type, props) {
    if (props.deleteItem) {
      const result = await confirmation();
      if (result) {
        await props.deleteItem(id, type);
        await props.load();
      }
    }
  }

  render () {
    const { data, columns, isSelected, selectAllCheckboxes, onSortField, sortField, sortDirection, routerPushWithReturnTo,
      onCheckboxChange, getEditUrl } = this.props;
    const { deleteItem } = this;
    return (
      <Table>
        <Headers>
          {/* Be aware that width or flex of each headerCel and the related rowCel must be the same! */}
          {
            columns.map((column, index) => {
              switch (column.type) {
                case 'checkBox':
                  return <CheckBoxCel checked={isSelected && isSelected.get('ALL')} key={index} name='header' style={[ headerStyles.header, headerStyles.firstHeader ]} onChange={selectAllCheckboxes}/>;
                case 'custom':
                  return (
                    column.sort ? (
                      <CustomCel
                        key={index} sortColumn={onSortField(column.sortField)}
                        sortDirection = {sortField === column.sortField ? sortDirections[sortDirection] : NONE}
                        style={[ headerStyles.header, headerStyles.notFirstHeader, headerStyles.clickableHeader, { flex: column.colspan || 1 } ]}>
                        {column.title}
                      </CustomCel>) : (
                      <CustomCel
                        key={index} style={[ headerStyles.header, headerStyles.notFirstHeader, { flex: column.colspan || 1 } ]}>
                        {column.title}
                      </CustomCel>)
                  );
                case 'dropdown':
                  return <DropdownCel key={index} style={[ headerStyles.header, headerStyles.notFirstHeader ]}/>;
                default:
                  return (
                    <CustomCel
                      key={index} style={[ headerStyles.header, headerStyles.notFirstHeader, { flex: column.colspan || 1 } ]}>
                      {column.title}
                    </CustomCel>
                  );
              }
            })
          }
        </Headers>
        <Rows isLoading={data.get('_status') !== 'loaded'}>
          {data.get('data').map((item, index) => {
            return (
              <Row index={index} isFirst={index % numberOfRows === 0} key={index} >
                {/* Be aware that width or flex of each headerCel and the related rowCel must be the same! */}
                {
                  columns.map((column, subindex) => {
                    switch (column.type) {
                      case 'checkBox':
                        return <CheckBoxCel checked={isSelected && isSelected.get(item.get('id'))} key={subindex} onChange={onCheckboxChange(item.get('id'))}/>;
                      case 'custom':
                        return (
                          <CustomCel key={subindex} objectToRender={item} style={{ flex: column.colspan || 1 }} onClick={column.clickable
                            ? () => { column.getUrl(item) && routerPushWithReturnTo(column.getUrl(item)); }
                            : null
                            }>
                            {column.dataType === 'date' ? this.getFormatedDate(item.get(column.name)) : (column.convert || ((text) => text))(column.name ? item.get(column.name) : item)}
                          </CustomCel>
                        );
                      case 'dropdown':
                        return (
                          <DropdownCel key={subindex} >
                            <Dropdown
                              elementShown={<div key={0} style={[ dropdownStyles.clickable, dropdownStyles.option, dropdownStyles.borderLeft ]} onClick={() => { getEditUrl(item) && routerPushWithReturnTo(getEditUrl(item)); }}>Edit</div>}>
                              <div key={1} style={dropdownStyles.floatOption} onClick={(e) => { e.preventDefault(); deleteItem(item.get('id'), item.get('type'), this.props); }}>Remove</div>
                            </Dropdown>
                          </DropdownCel>
                        );
                      default:
                        return (
                          <CustomCel key={subindex} objectToRender={item} style={{ flex: column.colspan || 1 }} onClick={() => { column.clickable && column.getUrl(item) && routerPushWithReturnTo(column.getUrl(item)); }}>
                            {column.dataType === 'date' ? this.getFormatedDate(item.get(column.name)) : item.get(column.name)}
                          </CustomCel>
                        );
                    }
                  })}
              </Row>
            );
          })}
        </Rows>
      </Table>
    );
  }
}

ListView.propTypes = {
  columns: PropTypes.array.isRequired,
  data: ImmutablePropTypes.map.isRequired,
  deleteItem: PropTypes.func,
  getEditUrl: PropTypes.func,
  isSelected: ImmutablePropTypes.map,
  load: PropTypes.func.isRequired,
  routerPushWithReturnTo: PropTypes.func.isRequired,
  selectAllCheckboxes: PropTypes.func,
  sortDirection: PropTypes.string,
  sortField: PropTypes.string,
  onCheckboxChange: PropTypes.func,
  onSortField: PropTypes.func.isRequired
};

export default ListView;
