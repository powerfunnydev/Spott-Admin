import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { initialize, Field } from 'redux-form/immutable';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { filterStyles, Root, Container } from '../../../_common/styles';
import { Tile, UtilsBar, isQueryChanged, tableDecorator, generalStyles, TotalEntries, Pagination } from '../../../_common/components/table/index';
import { FilterContent } from '../../../_common/components/filterDropdown';
import SelectionDropdown from '../../../_common/components/selectionDropdown';
import Line from '../../../_common/components/line';
import ListView from '../../../_common/components/listView/index';
import SelectInput from '../../../_common/inputs/selectInput';
import Radium from 'radium';
import * as actions from './actions';
import selector from './selector';
import { routerPushWithReturnTo } from '../../../../actions/global';
import { slowdown } from '../../../../utils';
import { confirmation } from '../../../_common/askConfirmation';
import { SideMenu } from '../../../app/sideMenu';
import Header from '../../../app/multiFunctionalHeader';
import { transformSourceToLink } from '../_common/utils';

export const filterArray = [ 'sourceTypes' ];
@tableDecorator()
@connect(selector, (dispatch) => ({
  deleteTopic: bindActionCreators(actions.deleteTopic, dispatch),
  deleteTopics: bindActionCreators(actions.deleteTopics, dispatch),
  initializeForm: bindActionCreators(initialize, dispatch),
  load: bindActionCreators(actions.load, dispatch),
  routerPushWithReturnTo: bindActionCreators(routerPushWithReturnTo, dispatch),
  selectAllCheckboxes: bindActionCreators(actions.selectAllCheckboxes, dispatch),
  selectCheckbox: bindActionCreators(actions.selectCheckbox, dispatch)
}))
@Radium
export default class Topics extends Component {

  static propTypes = {
    children: PropTypes.node,
    deleteTopic: PropTypes.func.isRequired,
    deleteTopics: PropTypes.func.isRequired,
    getFilterObjectFromQuery: PropTypes.func.isRequired,
    initializeForm: PropTypes.func.isRequired,
    isSelected: ImmutablePropTypes.map.isRequired,
    listTopicsEntities: ImmutablePropTypes.map.isRequired,
    load: PropTypes.func.isRequired,
    location: PropTypes.shape({
      pathname: PropTypes.string.isRequired,
      query: PropTypes.object.isRequired
    }),
    pageCount: PropTypes.number,
    routerPushWithReturnTo: PropTypes.func.isRequired,
    selectAllCheckboxes: PropTypes.func.isRequired,
    selectCheckbox: PropTypes.func.isRequired,
    topics: ImmutablePropTypes.map.isRequired,
    totalResultCount: PropTypes.number.isRequired,
    onChangeDisplay: PropTypes.func.isRequired,
    onChangeFilter: PropTypes.func.isRequired,
    onChangePage: PropTypes.func.isRequired,
    onChangeSearchString: PropTypes.func.isRequired,
    onSortField: PropTypes.func.isRequired
  };

  constructor (props) {
    super(props);
    this.onCreateTopic = ::this.onCreateTopic;
    this.onClickDeleteSelected = ::this.onClickDeleteSelected;
    this.slowSearch = slowdown(props.load, 300);
    this.checkIfTopicIsUnremovable = ::this.checkIfTopicIsUnremovable;
  }

  componentWillMount () {
    const { getFilterObjectFromQuery, initializeForm, load } = this.props;
    load(this.props.location.query);
    initializeForm('topicList', getFilterObjectFromQuery(filterArray));
  }

  async componentWillReceiveProps (nextProps) {
    const nextQuery = nextProps.location.query;
    const query = this.props.location.query;
    if (isQueryChanged(query, nextQuery, null, filterArray)) {
      this.slowSearch(nextQuery);
    }
  }

  checkIfTopicIsUnremovable (topicId) {
    const { listTopicsEntities } = this.props;
    return listTopicsEntities.getIn([ topicId, 'readOnly' ]);
  }

  async deleteTopic (topicId) {
    const result = await confirmation();
    if (result) {
      await this.props.deleteTopic(topicId);
      await this.props.load(this.props.location.query);
    }
  }

  determineReadUrl (topic) {
    return `/content/topics/read/${topic.get('id')}`;
  }

  determineEditUrl (topic) {
    return `/content/topics/edit/${topic.get('id')}`;
  }

  determineSourceUrl (topic) {
    return transformSourceToLink(topic.get('sourceReference'), topic.get('sourceType'), 'read');
  }

  onCreateTopic (e) {
    e.preventDefault();
    this.props.routerPushWithReturnTo('/content/topics/create');
  }

  async onClickDeleteSelected () {
    const topicIds = [];
    this.props.isSelected.forEach((selected, key) => {
      if (selected && key !== 'ALL' && !this.checkIfTopicIsUnremovable(key)) {
        topicIds.push(key);
      }
    });
    await this.props.deleteTopics(topicIds);
    await this.props.load(this.props.location.query);
  }

  render () {
    const { topics, children, deleteTopic, isSelected, location: { query, query: { display, page, searchString, sortField, sortDirection } },
      pageCount, selectAllCheckboxes, selectCheckbox, totalResultCount, onChangeDisplay, onChangeFilter, onChangeSearchString } = this.props;
    const numberSelected = isSelected.reduce((total, selected, key) => selected && key !== 'ALL' ? total + 1 : total, 0);
    const columns = [
      { type: 'checkBox' },
      { type: 'custom', title: 'TITLE', clickable: true, getUrl: this.determineReadUrl, name: 'text' },
      { type: 'custom', title: 'SOURCE', clickable: true, getUrl: this.determineSourceUrl, sort: true, sortField: 'TEXT', name: 'text' },
      { type: 'custom', title: 'TYPE', name: 'sourceType' },
      { type: 'dropdown' }
    ];
    const sourceTypes = {
      BRAND: 'Brand',
      CHARACTER: 'Character',
      MANUAL: 'Manuel',
      MEDIUM: 'Medium',
      PERSON: 'Person'
    };
    return (
      <SideMenu>
        <Root>
          <Header hierarchy= {[ { title: 'Topics', url: '/content/topics' } ]}/>
          <div style={generalStyles.backgroundBar}>
            <Container>
              <UtilsBar
                display={display}
                filterContent={
                  <FilterContent
                    form='topicList'
                    initialValues={{ sourceTypes: null }}
                    style={[ filterStyles.filterContent, { minWidth: '400px', right: '-150px' } ]}
                    onApplyFilter={onChangeFilter}>
                    <div style={[ filterStyles.row, filterStyles.firstRow ]}>
                      <div style={filterStyles.title}>Source types</div>
                      <Field
                        component={SelectInput}
                        first
                        getItemText={(key) => sourceTypes[key]}
                        getOptions={() => Object.keys(sourceTypes)}
                        multiselect
                        name='sourceTypes'
                        options={Object.keys(sourceTypes)}
                        placeholder='Source types'
                        style={filterStyles.fullWidth}/>
                    </div>
                  </FilterContent>
                }
                isLoading={topics.get('_status') !== 'loaded'}
                numberSelected={numberSelected}
                searchString={searchString}
                textCreateButton='New Topic'
                onChangeDisplay={onChangeDisplay}
                onChangeSearchString={(value) => { onChangeSearchString(value); this.slowSearch({ ...query, searchString: value }); }}
                onClickNewEntry={this.onCreateTopic}/>
            </Container>
          </div>
          <Line/>
          <div style={[ generalStyles.backgroundTable, generalStyles.fillPage ]}>
            <Container style={generalStyles.paddingTable}>
              <TotalEntries
                entityType='Topics'
                numberSelected={numberSelected}
                totalResultCount={totalResultCount}
                onDeleteSelected={this.onClickDeleteSelected}/>
              {(display === undefined || display === 'list') &&
                <div>
                  <ListView
                    checkIfItemIsUnremovable={this.checkIfTopicIsUnremovable}
                    columns={columns}
                    data={topics}
                    deleteItem={deleteTopic}
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
                    {topics.get('data').map((topic, index) => (
                      <Tile
                        checked={isSelected.get(topic.get('id'))}
                        imageUrl={topic.get('icon') && `${topic.getIn([ 'icon', 'url' ])}?height=203&width=360`}
                        key={`topic${index}`}
                        text={topic.get('text')}
                        onCheckboxChange={selectCheckbox.bind(this, topic.get('id'))}
                        onClick={() => { this.props.routerPushWithReturnTo(`/content/topics/read/${topic.get('id')}`); }}
                        onDelete={topic.get('readOnly') ? null : async (e) => { e.preventDefault(); await this.deleteTopic(topic.get('id')); }}
                        onEdit={(e) => { e.preventDefault(); this.props.routerPushWithReturnTo(`/content/topics/edit/${topic.get('id')}`); }}/>
                    ))}
                    <Tile key={'createTopic'} onCreate={() => { this.props.routerPushWithReturnTo('/content/topics/create'); }}/>
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
