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
import { generalStyles } from '../../../_common/components/table/index';

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

  async componentWillMount () {
    if (this.props.params.seasonId) {
      await this.props.loadEpisode(this.props.params.episodeId);
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
    const { params, children, currentEpisode, location, deleteEpisode } = this.props;
    const { styles } = this.constructor;
    const defaultLocale = currentEpisode.getIn([ 'defaultLocale' ]);
    return (
      <Root>
        <Header currentLocation={location} hideHomePageLinks />
        <SpecificHeader/>
        <Container>
          {currentEpisode.get('_status') === 'loaded' && currentEpisode &&
            <EntityDetails image={currentEpisode.getIn([ 'profileImage', defaultLocale, 'url' ])} title={currentEpisode.getIn([ 'title', defaultLocale ])}
              onEdit={() => { this.props.routerPushWithReturnTo(`content/series/read/${params.seriesEntryId}/seasons/read/${params.seasonId}/episodes/edit/${currentEpisode.get('id')}`); }}
              onRemove={async () => { await deleteEpisode(currentEpisode.getIn([ 'id' ])); this.redirect(); }}/>}
        </Container>
        <Line/>
        <div style={[ generalStyles.fillPage, styles.table ]} />
        <Line/>
        {children}
      </Root>
    );
  }

}
