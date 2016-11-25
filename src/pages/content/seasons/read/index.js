import React, { Component, PropTypes } from 'react';
import Radium from 'radium';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Header from '../../../app/header';
import { Root, Container, colors } from '../../../_common/styles';
import * as actions from './actions';
import SpecificHeader from '../../header';
import selector from './selector';
import EntityDetails from '../../../_common/entityDetails';
import * as listActions from '../list/actions';
import { routerPushWithReturnTo } from '../../../../actions/global';
import Line from '../../../_common/components/line';
import SeasonEpisodesList from './episodes';
import { Tabs, Tab } from '../../../_common/components/formTabs';
import { generalStyles } from '../../../_common/components/table/index';

/* eslint-disable no-alert */

@connect(selector, (dispatch) => ({
  deleteSeason: bindActionCreators(listActions.deleteSeason, dispatch),
  loadSeason: bindActionCreators(actions.loadSeason, dispatch),
  routerPushWithReturnTo: bindActionCreators(routerPushWithReturnTo, dispatch)
}))
@Radium
export default class ReadSeason extends Component {

  static propTypes = {
    children: PropTypes.node,
    currentSeason: PropTypes.object.isRequired,
    deleteSeason: PropTypes.func.isRequired,
    error: PropTypes.any,
    loadSeason: PropTypes.func.isRequired,
    location: PropTypes.object.isRequired,
    params: PropTypes.object.isRequired,
    routerPushWithReturnTo: PropTypes.func.isRequired
  };

  constructor (props) {
    super(props);
    this.redirect = ::this.redirect;
    this.onClickNewEntry = :: this.onClickNewEntry;
    this.onChangeTab = :: this.onChangeTab;
  }

  async componentWillMount () {
    if (this.props.params.seasonId) {
      await this.props.loadSeason(this.props.params.seasonId);
    }
  }

  getTitle (season) {
    return season.get('name');
  }

  redirect () {
    this.props.routerPushWithReturnTo('content/seasons', true);
  }

  onChangeTab (index) {
    this.props.routerPushWithReturnTo({ ...this.props.location, query: { ...this.props.location.query, tabIndex: index } });
  }

  onClickNewEntry (e) {
    e.preventDefault();
    const seasonId = this.props.params.seasonId;
    if (seasonId) {
      this.props.routerPushWithReturnTo(`content/seasons/read/${seasonId}/create/season`);
    }
  }

  static styles= {
    table: {
      backgroundColor: colors.lightGray4,
      paddingTop: '20px'
    }
  }

  render () {
    const { children, currentSeason,
       location, deleteSeason, location: { query: { tabIndex } } } = this.props;
    const { styles } = this.constructor;
    const defaultLocale = currentSeason.getIn([ 'defaultLocale' ]);
    return (
      <Root>
        <Header currentLocation={location} hideHomePageLinks />
        <SpecificHeader/>
        <Container>
          {currentSeason.get('_status') === 'loaded' && currentSeason &&
            <EntityDetails image={currentSeason.getIn([ 'profileImage', defaultLocale, 'url' ])} title={currentSeason.getIn([ 'title', defaultLocale ])}
              onEdit={() => { this.props.routerPushWithReturnTo(`content/series/read/${this.props.params.seriesEntryId}/seasons/edit/${currentSeason.getIn([ 'id' ])}`); }}
              onRemove={async () => { await deleteSeason(currentSeason.getIn([ 'id' ])); this.redirect(); }}/>}
        </Container>
        <Line/>
        <div style={[ generalStyles.fillPage, styles.table ]}>
          <Container>
            <Tabs activeTab={tabIndex} onChange={this.onChangeTab}>
              <Tab title='Episodes'>
                <SeasonEpisodesList {...this.props}/>
              </Tab>
            </Tabs>
          </Container>
        </div>
        <Line/>
        {children}
      </Root>
    );
  }

}
