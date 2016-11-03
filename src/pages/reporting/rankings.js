import React, { Component, PropTypes } from 'react';
import Radium from 'radium';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { routerPushWithReturnTo } from '../../actions/global';
import { colors, fontWeights, makeTextStyle, Container } from '../_common/styles';
import InfiniteScroll from '../_common/components/infiniteScroll';
import { isLoading } from '../../constants/statusTypes';
import { arraysEqual, slowdown } from '../../utils';
import * as actions from './actions';
import { rankingsSelector } from './selector';
import Widget from './widget';
import RankingsFilterForm from './forms/rankingsFilterForm';

@Radium
class RankingItem extends Component {

  static propTypes = {
    count: PropTypes.number.isRequired,
    countLabel: PropTypes.string.isRequired,
    imageUrl: PropTypes.string,
    position: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired
  };

  constructor (props) {
    super(props);
    this.onMouseEnter = ::this.onMouseEnter;
    this.onMouseLeave = ::this.onMouseLeave;
    this.state = { tooltip: false };
  }

  /* eslint-disable react/no-set-state */
  onMouseEnter (e) {
    e.preventDefault();
    const { left, top } = this._container.getClientRects()[0];
    this.setState({ tooltip: { x: left, y: top - 200 } });
  }
  onMouseLeave (e) {
    e.preventDefault();
    this.setState({ tooltip: false });
  }

  static styles = {
    container: {
      borderBottomColor: '#eaeced',
      borderBottomStyle: 'solid',
      borderBottomWidth: 1,
      display: 'flex',
      alignItems: 'center',
      paddingBottom: '0.313em',
      paddingLeft: '0.313em',
      paddingRight: '0.625em',
      paddingTop: '0.313em'
    },
    image: {
      wrapper: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '1.813em',
        height: '1.813em',
        marginRight: '0.625em'
      },
      image: {
        maxWidth: '100%',
        maxHeight: '100%',
        borderRadius: '0.25em'
      },
      tooltip: {
        border: `solid 1px ${colors.lightGray2}`,
        boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.25)',
        height: 200,
        position: 'fixed'
      }
    },
    position: {
      ...makeTextStyle(fontWeights.medium, '0.75em'),
      color: '#6d8791',
      textAlign: 'right',
      width: '10%',
      marginRight: '1.25em'
    },
    title: {
      ...makeTextStyle(fontWeights.regular, '0.75em'),
      color: '#17262b',
      marginRight: '0.625em',
      width: '55%',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap'
    },
    count: {
      ...makeTextStyle(fontWeights.regular, '0.625em'),
      color: '#6d8791',
      textAlign: 'right',
      width: '35%',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap'
    }
  };

  render () {
    const styles = this.constructor.styles;
    const { tooltip } = this.state;
    const { imageUrl, position, count, countLabel, title } = this.props;

    /* eslint-disable no-return-assign */
    return (
      <div ref={(c) => this._container = c} style={styles.container}>
        {tooltip && imageUrl &&
          <img alt={title} src={`${imageUrl}?height=250&width=250`} style={[ styles.image.image, styles.image.tooltip, { top: tooltip.y } ]} title={title} />}
        <span style={styles.position}>{position}</span>
        <div onMouseEnter={this.onMouseEnter} onMouseLeave={this.onMouseLeave}>
          <div style={styles.image.wrapper} >
            {imageUrl && <img alt={title} src={`${imageUrl}?height=70&width=70`} style={styles.image.image} title={title} />}
          </div>
        </div>
        <span style={styles.title}>{title}</span>
        <span style={styles.count}><b>{count}</b> {countLabel}</span>
      </div>
    );
  }
}

@connect(rankingsSelector, (dispatch) => ({
  loadBrandSubscriptions: bindActionCreators(actions.loadBrandSubscriptions, dispatch),
  loadCharacterSubscriptions: bindActionCreators(actions.loadCharacterSubscriptions, dispatch),
  loadMediumSubscriptions: bindActionCreators(actions.loadMediumSubscriptions, dispatch),
  loadMediumSyncs: bindActionCreators(actions.loadMediumSyncs, dispatch),
  loadProductViews: bindActionCreators(actions.loadProductViews, dispatch),
  loadRankings: bindActionCreators(actions.loadRankings, dispatch),
  routerPushWithReturnTo: bindActionCreators(routerPushWithReturnTo, dispatch)
}))
export default class Rankings extends Component {

  static propTypes = {
    brandSubscriptions: ImmutablePropTypes.map.isRequired,
    characterSubscriptions: ImmutablePropTypes.map.isRequired,
    loadBrandSubscriptions: PropTypes.func.isRequired,
    loadCharacterSubscriptions: PropTypes.func.isRequired,
    loadMediumSubscriptions: PropTypes.func.isRequired,
    loadMediumSyncs: PropTypes.func.isRequired,
    loadProductViews: PropTypes.func.isRequired,
    loadRankings: PropTypes.func.isRequired,
    location: PropTypes.object.isRequired,
    mediumSubscriptions: ImmutablePropTypes.map.isRequired,
    mediumSyncs: ImmutablePropTypes.map.isRequired,
    productViews: ImmutablePropTypes.map.isRequired,
    routerPushWithReturnTo: PropTypes.func.isRequired
  };

  constructor (props) {
    super(props);
    this.onChangeRankingsFilter = ::this.onChangeRankingsFilter;
    this.loadRankings = slowdown(props.loadRankings, 300);
  }

  componentWillMount () {
    this.loadRankings(this.props.location.query);
  }

  componentWillReceiveProps (nextProps) {
    const nextQuery = nextProps.location.query;
    const query = this.props.location.query;

    if (!arraysEqual(query.ages, nextQuery.ages) ||
      !arraysEqual(query.genders, nextQuery.genders) ||
      !arraysEqual(query.media, nextQuery.media)) {
      this.loadRankings(nextProps.location.query);
    }
  }

  onChangeRankingsFilter (field, type, value) {
    this.props.routerPushWithReturnTo({
      ...this.props.location,
      query: {
        ...this.props.location.query,
        [field]: value
      }
    });
  }

  static styles = {
    rankings: {
      backgroundColor: colors.lightGray,
      paddingBottom: '1.5em',
      paddingTop: '1.5em',
      borderTopWidth: 1,
      borderTopStyle: 'solid',
      borderTopColor: '#ced6da'
    },
    header: {
      backgroundColor: colors.black
    },
    filter: {
      paddingTop: '1.5em',
      paddingBottom: '1em'
    },
    tab: {
      base: {
        ...makeTextStyle(fontWeights.bold, '0.75em', '0.237em'),
        color: 'white',
        opacity: 0.5,
        paddingBottom: '1em',
        paddingTop: '1em',
        textDecoration: 'none',
        textAlign: 'center',
        minWidth: '12.5em',
        display: 'inline-block',
        borderBottomWidth: 4,
        borderBottomStyle: 'solid',
        borderBottomColor: colors.dark
      },
      active: {
        borderBottomColor: colors.darkPink,
        opacity: 1
      }
    },
    widgets: {
      display: 'flex',
      flexWrap: 'wrap',
      marginLeft: '-0.75em',
      marginRight: '-0.75em'
    },
    rankingWidget: {
      height: 260,
      overflowY: 'scroll',
      paddingBottom: 0,
      paddingLeft: 0,
      paddingRight: 0,
      paddingTop: 0
    }
  };

  render () {
    const styles = this.constructor.styles;
    const {
      brandSubscriptions, characterSubscriptions, loadBrandSubscriptions,
      loadCharacterSubscriptions, loadMediumSubscriptions, loadMediumSyncs, loadProductViews,
      location: { query: { ages, genders } }, mediumSubscriptions, mediumSyncs, productViews } = this.props;

    return (
      <div>
        <Container>
          <RankingsFilterForm
            fields={{
              ages: typeof ages === 'string' ? [ ages ] : ages,
              genders: typeof genders === 'string' ? [ genders ] : genders
            }}
            style={styles.filter}
            onChange={this.onChangeRankingsFilter}/>
        </Container>
        <div style={styles.rankings}>
          <Container>
            <div style={styles.widgets}>
              <Widget contentStyle={styles.rankingWidget} isLoading={isLoading(mediumSubscriptions)} title='Programs'>
                <InfiniteScroll
                  containerHeight={260}
                  elementHeight={40}
                  loadMore={loadMediumSubscriptions}
                  offset={160}
                  page={mediumSubscriptions.get('page')}>
                   {mediumSubscriptions.get('data') && mediumSubscriptions.get('data').map((ms, i) => (
                     <RankingItem
                       count={ms.count}
                       countLabel='Subscribers'
                       imageUrl={ms.medium.posterImage && ms.medium.posterImage.url}
                       key={i}
                       position={i + 1}
                       title={ms.medium.title} />
                   ))}
                </InfiniteScroll>
              </Widget>
              <Widget contentStyle={styles.rankingWidget} isLoading={isLoading(mediumSyncs)} title='Program syncs'>
                <InfiniteScroll
                  containerHeight={260}
                  elementHeight={40}
                  loadMore={loadMediumSyncs}
                  offset={160}
                  page={mediumSyncs.get('page')}>
                  {mediumSyncs.get('data') && mediumSyncs.get('data').map((ms, i) => (
                    <RankingItem
                      count={ms.count}
                      countLabel='Syncs'
                      imageUrl={ms.medium.posterImage && ms.medium.posterImage.url}
                      key={i}
                      position={i + 1}
                      title={ms.medium.title} />
                  ))}
                </InfiniteScroll>
              </Widget>
              {/* <Widget contentStyle={styles.rankingWidget} title='Interactive commercials'>{content}</Widget> */}
              <Widget contentStyle={styles.rankingWidget} isLoading={isLoading(characterSubscriptions)} title='Characters'>
                <InfiniteScroll
                  containerHeight={260}
                  elementHeight={40}
                  loadMore={loadCharacterSubscriptions}
                  offset={160}
                  page={characterSubscriptions.get('page')}>
                  {characterSubscriptions.get('data') && characterSubscriptions.get('data').map((cs, i) => (
                    <RankingItem
                      count={cs.count}
                      countLabel='Subscribers'
                      imageUrl={cs.character.portraitImage && cs.character.portraitImage.url}
                      key={i}
                      position={i + 1}
                      title={cs.character.name ? `${cs.character.name} - ${cs.medium.title}` : cs.medium.title} />
                  ))}
                </InfiniteScroll>
              </Widget>
              <Widget contentStyle={styles.rankingWidget} isLoading={isLoading(productViews)} title='Products'>
                <InfiniteScroll
                  containerHeight={260}
                  elementHeight={40}
                  loadMore={loadProductViews}
                  offset={160}
                  page={productViews.get('page')}>
                {productViews.get('data') && productViews.get('data').map((pw, i) => (
                  <RankingItem
                    count={pw.count}
                    countLabel={pw.product.id}
                    imageUrl={pw.product.image && pw.product.image.url}
                    key={i} // TODO use product id
                    position={i + 1}
                    title={pw.product.shortName} />
                ))}
                </InfiniteScroll>
              </Widget>
              <Widget contentStyle={styles.rankingWidget} isLoading={isLoading(brandSubscriptions)} title='Brands'>
                <InfiniteScroll
                  containerHeight={260}
                  elementHeight={40}
                  loadMore={loadBrandSubscriptions}
                  offset={160}
                  page={brandSubscriptions.get('page')}>
                  {brandSubscriptions.get('data') && brandSubscriptions.get('data').map((bs, i) => (
                    <RankingItem
                      count={bs.count}
                      countLabel='Subscribers'
                      imageUrl={bs.brand.logo && bs.brand.logo.url}
                      key={i}
                      position={i + 1}
                      title={bs.brand.name} />
                  ))}
                </InfiniteScroll>
              </Widget>
            </div>
          </Container>
        </div>
      </div>
    );
  }
}
