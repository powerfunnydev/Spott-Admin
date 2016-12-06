import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import ImmutablePropTypes from 'react-immutable-proptypes';
import moment from 'moment';
import Header from '../../../app/header';
import { Root, Container } from '../../../_common/styles';
import { DropdownCel, Tile, UtilsBar, isQueryChanged, tableDecorator, generalStyles, TotalEntries, headerStyles, NONE, sortDirections, CheckBoxCel, Table, Headers, CustomCel, Rows, Row, Pagination } from '../../../_common/components/table/index';
import Line from '../../../_common/components/line';
import Radium from 'radium';
import * as actions from './actions';
import selector from './selector';
import SpecificHeader from '../../header';
import Dropdown, { styles as dropdownStyles } from '../../../_common/components/actionDropdown';
import { routerPushWithReturnTo } from '../../../../actions/global';
import { slowdown } from '../../../../utils';
import { confirmation } from '../../../_common/askConfirmation';

const numberOfRows = 25;

@tableDecorator()
@connect(selector, (dispatch) => ({
  deleteContentProducer: bindActionCreators(actions.deleteContentProducer, dispatch),
  deleteContentProducers: bindActionCreators(actions.deleteContentProducers, dispatch),
  load: bindActionCreators(actions.load, dispatch),
  routerPushWithReturnTo: bindActionCreators(routerPushWithReturnTo, dispatch),
  selectAllCheckboxes: bindActionCreators(actions.selectAllCheckboxes, dispatch),
  selectCheckbox: bindActionCreators(actions.selectCheckbox, dispatch)
}))
@Radium
export default class ContentProducers extends Component {

  static propTypes = {
    children: PropTypes.node,
    contentProducers: ImmutablePropTypes.map.isRequired,
    deleteContentProducer: PropTypes.func.isRequired,
    deleteContentProducers: PropTypes.func.isRequired,
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
      this.slowSearch(nextQuery);
    }
  }

  async deleteContentProducer (contentProducersId) {
    const result = await confirmation();
    if (result) {
      await this.props.deleteContentProducer(contentProducersId);
      await this.props.load(this.props.location.query);
    }
  }

  getLastUpdatedOn (cp) {
    const date = new Date(cp.get('lastUpdatedOn'));
    return moment(date).format('YYYY-MM-DD HH:mm');
  }

  onClickNewEntry (e) {
    e.preventDefault();
    this.props.routerPushWithReturnTo('content/content-producers/create');
  }

  async onClickDeleteSelected () {
    const contentProducersIds = [];
    this.props.isSelected.forEach((selected, key) => {
      if (selected && key !== 'ALL') {
        contentProducersIds.push(key);
      }
    });
    await this.props.deleteContentProducers(contentProducersIds);
    await this.props.load(this.props.location.query);
  }

  render () {
    const { contentProducers, children, isSelected, location, location: { query, query: { display, page, searchString, sortField, sortDirection } },
      pageCount, selectAllCheckboxes, selectCheckbox, totalResultCount, onChangeDisplay, onChangeSearchString } = this.props;
    const numberSelected = isSelected.reduce((total, selected, key) => selected && key !== 'ALL' ? total + 1 : total, 0);
    return (
      <Root>
        <Header currentLocation={location} hideHomePageLinks />
        <SpecificHeader/>
        <div style={generalStyles.backgroundBar}>
          <Container>
            <UtilsBar
              display={display}
              isLoading={contentProducers.get('_status') !== 'loaded'}
              numberSelected={numberSelected}
              searchString={searchString}
              textCreateButton='New Content Producer'
              onChangeDisplay={onChangeDisplay}
              onChangeSearchString={(value) => { onChangeSearchString(value); this.slowSearch({ ...query, searchString: value }); }}
              onClickNewEntry={this.onClickNewEntry}/>
          </Container>
        </div>
        <Line/>
        <div style={[ generalStyles.backgroundTable, generalStyles.fillPage ]}>
          <Container style={generalStyles.paddingTable}>
            <TotalEntries
              entityType='Content Producers'
              numberSelected={numberSelected}
              totalResultCount={totalResultCount}
              onDeleteSelected={this.onClickDeleteSelected}/>
            {(display === undefined || display === 'list') &&
              <div>
                <Table>
                  <Headers>
                    {/* Be aware that width or flex of each headerCel and the related rowCel must be the same! */}
                    <CheckBoxCel checked={isSelected.get('ALL')} name='header' style={[ headerStyles.header, headerStyles.firstHeader ]} onChange={selectAllCheckboxes}/>
                    <CustomCel sortColumn={this.props.onSortField.bind(this, 'NAME')} sortDirection = {sortField === 'NAME' ? sortDirections[sortDirection] : NONE} style={[ headerStyles.header, headerStyles.notFirstHeader, headerStyles.clickableHeader, { flex: 2 } ]}>NAME</CustomCel>
                    <CustomCel style={[ headerStyles.header, headerStyles.notFirstHeader, { flex: 2 } ]}>UPDATED BY</CustomCel>
                    <CustomCel sortColumn={this.props.onSortField.bind(this, 'LAST_MODIFIED')} sortDirection = {sortField === 'LAST_MODIFIED' ? sortDirections[sortDirection] : NONE} style={[ headerStyles.header, headerStyles.notFirstHeader, headerStyles.clickableHeader, { flex: 2 } ]}>LAST UPDATED ON</CustomCel>
                    <DropdownCel style={[ headerStyles.header, headerStyles.notFirstHeader ]}/>
                  </Headers>
                  <Rows isLoading={contentProducers.get('_status') !== 'loaded'}>
                    {contentProducers.get('data').map((cp, index) => {
                      return (
                        <Row index={index} isFirst={index % numberOfRows === 0} key={index} >
                          {/* Be aware that width or flex of each headerCel and the related rowCel must be the same! */}
                          <CheckBoxCel checked={isSelected.get(cp.get('id'))} onChange={selectCheckbox.bind(this, cp.get('id'))}/>
                          <CustomCel style={{ flex: 2 }} onClick={() => { this.props.routerPushWithReturnTo(`content/content-producers/read/${cp.get('id')}`); }}>{cp.get('name')}</CustomCel>
                          <CustomCel style={{ flex: 2 }}>{cp.get('lastUpdatedBy')}</CustomCel>
                          <CustomCel getValue={this.getLastUpdatedOn} objectToRender={cp} style={{ flex: 2 }}/>
                          <DropdownCel>
                            <Dropdown
                              elementShown={<div key={0} style={[ dropdownStyles.clickable, dropdownStyles.option, dropdownStyles.borderLeft ]} onClick={() => { this.props.routerPushWithReturnTo(`content/content-producers/edit/${cp.get('id')}`); }}>Edit</div>}>
                              <div key={1} style={dropdownStyles.floatOption} onClick={async (e) => { e.preventDefault(); await this.deleteContentProducer(cp.get('id')); }}>Remove</div>
                            </Dropdown>
                          </DropdownCel>
                        </Row>
                      );
                    })}
                  </Rows>
                </Table>
                <Pagination currentPage={(page && (parseInt(page, 10) + 1) || 1)} pageCount={pageCount} onLeftClick={() => { this.props.onChangePage(parseInt(page, 10), false); }} onRightClick={() => { this.props.onChangePage(parseInt(page, 10), true); }}/>
              </div>
            }
            {display === 'grid' &&
              <div>
                <div style={generalStyles.row}>
                  {contentProducers.get('data').map((contentProducer, index) => (
                    <Tile
                      imageUrl={contentProducer.get('logo') && `${contentProducer.getIn([ 'logo', 'url' ])}?height=310&width=310`}
                      key={`contentProducer${index}`}
                      text={contentProducer.get('name')}
                      onClick={() => { this.props.routerPushWithReturnTo(`content/content-producers/read/${contentProducer.get('id')}`); }}
                      onDelete={async (e) => {
                        e.preventDefault();
                        await this.deleteContentProducer(contentProducer.get('id'));
                      }}
                      onEdit={(e) => {
                        e.preventDefault();
                        this.props.routerPushWithReturnTo(`content/content-producers/edit/${contentProducer.get('id')}`);
                      }}/>
                  ))}
                  <Tile key={'createBroadcaster'} onCreate={() => { this.props.routerPushWithReturnTo('content/content-producers/create'); }}/>
                </div>
                <Pagination currentPage={(page && (parseInt(page, 10) + 1) || 1)} pageCount={pageCount} onLeftClick={() => { this.props.onChangePage(parseInt(page, 10), false); }} onRightClick={() => { this.props.onChangePage(parseInt(page, 10), true); }}/>
              </div>
            }
          </Container>
        </div>
        {children}
      </Root>

    );
  }

}
