import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import ImmutablePropTypes from 'react-immutable-proptypes';
import moment from 'moment';
import { Root, Container } from '../../../_common/styles';
import { Tile, UtilsBar, isQueryChanged, tableDecorator, generalStyles, TotalEntries, Pagination } from '../../../_common/components/table/index';
import Line from '../../../_common/components/line';
import ListView from '../../../_common/components/listView/index';
import Radium from 'radium';
import * as actions from './actions';
import selector from './selector';
import { routerPushWithReturnTo } from '../../../../actions/global';
import { slowdown } from '../../../../utils';
import { confirmation } from '../../../_common/askConfirmation';
import { SideMenu } from '../../../app/sideMenu';
import Header from '../../../app/multiFunctionalHeader';

@tableDecorator()
@connect(selector, (dispatch) => ({
  deleteMovie: bindActionCreators(actions.deleteMovie, dispatch),
  deleteMovies: bindActionCreators(actions.deleteMovies, dispatch),
  load: bindActionCreators(actions.load, dispatch),
  routerPushWithReturnTo: bindActionCreators(routerPushWithReturnTo, dispatch),
  selectAllCheckboxes: bindActionCreators(actions.selectAllCheckboxes, dispatch),
  selectCheckbox: bindActionCreators(actions.selectCheckbox, dispatch)
}))
@Radium
export default class Movies extends Component {

  static propTypes = {
    children: PropTypes.node,
    deleteMovie: PropTypes.func.isRequired,
    deleteMovies: PropTypes.func.isRequired,
    isSelected: ImmutablePropTypes.map.isRequired,
    load: PropTypes.func.isRequired,
    location: PropTypes.shape({
      pathname: PropTypes.string.isRequired,
      query: PropTypes.object.isRequired
    }),
    movies: ImmutablePropTypes.map.isRequired,
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
    this.onCreateMovie = ::this.onCreateMovie;
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

  async deleteMovie (moviesId) {
    const result = await confirmation();
    if (result) {
      await this.props.deleteMovie(moviesId);
      await this.props.load(this.props.location.query);
    }
  }

  determineReadUrl (movie) {
    return `/content/movies/read/${movie.get('id')}`;
  }

  determineEditUrl (movie) {
    return `/content/movies/edit/${movie.get('id')}`;
  }

  getLastUpdatedOn (movie) {
    const date = new Date(movie.get('lastUpdatedOn'));
    return moment(date).format('YYYY-MM-DD HH:mm');
  }

  onCreateMovie (e) {
    e.preventDefault();
    this.props.routerPushWithReturnTo('/content/movies/create');
  }

  async onClickDeleteSelected () {
    const movieIds = [];
    this.props.isSelected.forEach((selected, key) => {
      if (selected && key !== 'ALL') {
        movieIds.push(key);
      }
    });
    await this.props.deleteMovies(movieIds);
    await this.props.load(this.props.location.query);
  }

  render () {
    const { movies, children, deleteMovie, isSelected, location: { query, query: { display, page, searchString, sortField, sortDirection } },
      pageCount, selectAllCheckboxes, selectCheckbox, totalResultCount, onChangeDisplay, onChangeSearchString } = this.props;
    const numberSelected = isSelected.reduce((total, selected, key) => selected && key !== 'ALL' ? total + 1 : total, 0);
    const columns = [
      { type: 'checkBox' },
      { type: 'custom', sort: true, title: 'TITLE', clickable: true, getUrl: this.determineReadUrl, name: 'title' },
      { type: 'custom', title: 'UPDATED BY', name: 'lastUpdatedBy' },
      { type: 'custom', title: 'LAST UPDATED ON', name: 'lastUpdatedOn', dataType: 'date' },
      { type: 'dropdown' }
    ];
    return (
      <SideMenu>
        <Root>
          <Header hierarchy={[
            { title: 'Movies', url: '/content/movies' } ]}/>
          <div style={generalStyles.backgroundBar}>
            <Container>
              <UtilsBar
                display={display}
                isLoading={movies.get('_status') !== 'loaded'}
                numberSelected={numberSelected}
                searchString={searchString}
                textCreateButton='New Movie'
                onChangeDisplay={onChangeDisplay}
                onChangeSearchString={(value) => { onChangeSearchString(value); this.slowSearch({ ...query, searchString: value }); }}
                onClickNewEntry={this.onCreateMovie}/>
            </Container>
          </div>
          <Line/>
          <div style={[ generalStyles.backgroundTable, generalStyles.fillPage ]}>
            <Container style={generalStyles.paddingTable}>
              <TotalEntries
                entityType='Movies'
                numberSelected={numberSelected}
                totalResultCount={totalResultCount}
                onDeleteSelected={this.onClickDeleteSelected}/>
              {(display === undefined || display === 'list') &&
                <div>
                  <ListView
                    columns={columns}
                    data={movies}
                    deleteItem={deleteMovie}
                    getEditUrl={this.determineEditUrl}
                    isSelected={isSelected}
                    load={() => this.props.load(this.props.location.query)}
                    routerPushWithReturnTo={this.props.routerPushWithReturnTo}
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
                    {movies.get('data').map((movie, index) => (
                      <Tile
                        checked={isSelected.get(movie.get('id'))}
                        imageUrl={movie.get('profileImage') && `${movie.getIn([ 'profileImage', 'url' ])}?height=203&width=360`}
                        key={`movie${index}`}
                        text={movie.get('name')}
                        onCheckboxChange={selectCheckbox.bind(this, movie.get('id'))}
                        onClick={() => { this.props.routerPushWithReturnTo(`/content/movies/read/${movie.get('id')}`); }}
                        onDelete={async (e) => { e.preventDefault(); await this.deleteMovie(movie.get('id')); }}
                        onEdit={(e) => { e.preventDefault(); this.props.routerPushWithReturnTo(`/content/movies/edit/${movie.get('id')}`); }}/>
                    ))}
                    <Tile key={'createMovie'} onCreate={() => { this.props.routerPushWithReturnTo('/content/movies/create'); }}/>
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
