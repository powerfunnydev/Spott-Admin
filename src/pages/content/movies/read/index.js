import React, { Component, PropTypes } from 'react';
import Radium from 'radium';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Root, Container, colors } from '../../../_common/styles';
import * as actions from './actions';
import selector from './selector';
import EntityDetails from '../../../_common/entityDetails';
import * as listActions from '../list/actions';
import { routerPushWithReturnTo } from '../../../../actions/global';
import Line from '../../../_common/components/line';
import BreadCrumbs from '../../../_common/components/breadCrumbs';
import TvGuideList from '../../_mediumTvGuide';
import { generalStyles } from '../../../_common/components/table/index';
import { Tabs, Tab } from '../../../_common/components/formTabs';
import { SideMenu } from '../../../app/sideMenu';

/* eslint-disable no-alert */

@connect(selector, (dispatch) => ({
  deleteMovie: bindActionCreators(listActions.deleteMovie, dispatch),
  loadMovie: bindActionCreators(actions.loadMovie, dispatch),
  routerPushWithReturnTo: bindActionCreators(routerPushWithReturnTo, dispatch)
}))
@Radium
export default class ReadMovie extends Component {

  static propTypes = {
    children: PropTypes.node,
    currentMovie: PropTypes.object.isRequired,
    deleteMovie: PropTypes.func.isRequired,
    error: PropTypes.any,
    loadMovie: PropTypes.func.isRequired,
    location: PropTypes.object.isRequired,
    params: PropTypes.object.isRequired,
    routerPushWithReturnTo: PropTypes.func.isRequired
  };

  constructor (props) {
    super(props);
    this.redirect = ::this.redirect;
    this.onChangeTab = :: this.onChangeTab;
  }

  async componentWillMount () {
    if (this.props.params.movieId) {
      await this.props.loadMovie(this.props.params.movieId);
    }
  }

  redirect () {
    this.props.routerPushWithReturnTo('content/movies', true);
  }

  onChangeTab (index) {
    this.props.routerPushWithReturnTo({ ...this.props.location, query: { ...this.props.location.query, tabIndex: index } });
  }

  static styles= {
    table: {
      backgroundColor: colors.lightGray4,
      paddingTop: '20px'
    }
  }

  render () {
    const { styles } = this.constructor;
    const { params, children, currentMovie, location, location: { query: { tabIndex } }, deleteMovie } = this.props;
    const defaultLocale = currentMovie.getIn([ 'defaultLocale' ]);
    return (
      <SideMenu location={location}>
        <Root>
          <BreadCrumbs hierarchy={[
            { title: 'Movies', url: '/content/movies' },
            { title: currentMovie.getIn([ 'title', defaultLocale ]), url: location } ]}/>
          <Container>
            {currentMovie.get('_status') === 'loaded' && currentMovie &&
              <EntityDetails
                imageUrl={currentMovie.getIn([ 'profileImage', defaultLocale, 'url' ]) && `${currentMovie.getIn([ 'profileImage', defaultLocale, 'url' ])}?height=203&width=360`}
                title={currentMovie.getIn([ 'title', defaultLocale ])}
                onEdit={() => { this.props.routerPushWithReturnTo(`content/movies/edit/${params.movieId}`); }}
                onRemove={async () => { await deleteMovie(currentMovie.getIn([ 'id' ])); this.redirect(); }}/>}
          </Container>
          <Line/>
          <div style={[ generalStyles.fillPage, styles.table ]}>
            <Container>
              <Tabs activeTab={tabIndex} onChange={this.onChangeTab}>
                <Tab title='TV Guide'>
                  <TvGuideList {...this.props} mediumId={this.props.params.movieId}/>
                </Tab>
              </Tabs>
            </Container>
          </div>
          <Line/>
          {children}
        </Root>
      </SideMenu>
    );
  }

}
