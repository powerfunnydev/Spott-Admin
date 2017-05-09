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
import { generalStyles } from '../../../_common/components/table/index';
import TvGuideList from '../../_mediumTvGuide';
import { Tabs, Tab } from '../../../_common/components/formTabs';
import { SideMenu } from '../../../app/sideMenu';
import Header from '../../../app/multiFunctionalHeader';
import CropList from '../../_mediumCrops';

/* eslint-disable no-alert */

@connect(selector, (dispatch) => ({
  deleteEpisode: bindActionCreators(listActions.deleteEpisode, dispatch),
  loadEpisode: bindActionCreators(actions.loadEpisode, dispatch),
  routerPushWithReturnTo: bindActionCreators(routerPushWithReturnTo, dispatch)
}))
@Radium
export default class ReadEpisode extends Component {

  static propTypes = {
    children: PropTypes.node,
    currentEpisode: PropTypes.object.isRequired,
    deleteEpisode: PropTypes.func.isRequired,
    error: PropTypes.any,
    loadEpisode: PropTypes.func.isRequired,
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

  componentWillMount () {
    if (this.props.params.episodeId) {
      this.props.loadEpisode(this.props.params.episodeId);
    }
  }

  redirect () {
    this.props.routerPushWithReturnTo('/content/seasons', true);
  }

  onChangeTab (index) {
    this.props.routerPushWithReturnTo({ ...this.props.location, query: { ...this.props.location.query, tabIndex: index } });
  }

  onClickNewEntry (e) {
    e.preventDefault();
    const seasonId = this.props.params.seasonId;
    if (seasonId) {
      this.props.routerPushWithReturnTo(`/content/seasons/read/${seasonId}/create/season`);
    }
  }

  static styles= {
    table: {
      backgroundColor: colors.lightGray4,
      paddingTop: '20px'
    }
  }

  render () {
    const { params, children, currentEpisode, location: { query: { tabIndex } }, deleteEpisode } = this.props;
    const { styles } = this.constructor;
    const defaultLocale = currentEpisode.getIn([ 'defaultLocale' ]);
    return (
      <SideMenu>
        <Root>
          <Header hierarchy={[
            { title: 'Series', url: '/content/series' },
            { title: currentEpisode.getIn([ 'seriesEntry', 'title' ]), url: `/content/series/read/${this.props.params.seriesEntryId}` },
            { title: currentEpisode.getIn([ 'season', 'title' ]), url: `/content/series/read/${this.props.params.seriesEntryId}/seasons/read/${params.seasonId}` },
            { title: currentEpisode.getIn([ 'title', defaultLocale ]), url: `/content/series/read/${this.props.params.seriesEntryId}/seasons/read/${params.seasonId}/episodes/read/${params.episodeId}` }
          ]}/>
          <Container>
            {currentEpisode.get('_status') === 'loaded' && currentEpisode &&
              <EntityDetails
                imageUrl={currentEpisode.getIn([ 'profileImage', defaultLocale ]) && `${currentEpisode.getIn([ 'profileImage', defaultLocale, 'url' ])}?height=203&width=360`}
                title={currentEpisode.getIn([ 'title', defaultLocale ])}
                onEdit={() => { this.props.routerPushWithReturnTo(`/content/series/read/${params.seriesEntryId}/seasons/read/${params.seasonId}/episodes/edit/${currentEpisode.get('id')}`); }}
                onRemove={async () => { await deleteEpisode(currentEpisode.getIn([ 'id' ])); this.redirect(); }}/>}
          </Container>
          <Line/>
          <div style={[ generalStyles.fillPage, styles.table ]}>
            <Container>
              <Tabs activeTab={tabIndex} onChange={this.onChangeTab}>
                <Tab title='TV Guide'>
                  <TvGuideList {...this.props} mediumId={this.props.params.episodeId}/>
                </Tab>
                <Tab title='Spotts'>
                  <CropList {...this.props} mediumId={this.props.params.episodeId}/>
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
