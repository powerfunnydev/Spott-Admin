import React, { Component, PropTypes } from 'react';
import Radium from 'radium';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { reduxForm, Field } from 'redux-form/immutable';
import SelectInput from '../_common/inputs/selectInput';
import { colors, fontWeights, makeTextStyle, mediaQueries, Container } from '../_common/styles';
import { FETCHING, isLoading } from '../../constants/statusTypes';
import * as actions from './actions';
import { rankingsFilterSelector, rankingsSelector } from './selector';
import Widget from './widget';

@connect(rankingsFilterSelector, (dispatch) => ({
  initializeRankingsFilterForm: bindActionCreators(actions.initializeRankingsFilterForm, dispatch),
  loadAges: bindActionCreators(actions.loadAges, dispatch),
  loadGenders: bindActionCreators(actions.loadGenders, dispatch)
}))
@reduxForm({
  destroyOnUnmount: false,
  form: 'reportingRankingsFilter'
})
@Radium
class RankingsFilterForm extends Component {

  static propTypes = {
    ages: ImmutablePropTypes.map.isRequired,
    agesById: ImmutablePropTypes.map.isRequired,
    genders: ImmutablePropTypes.map.isRequired,
    gendersById: ImmutablePropTypes.map.isRequired,
    initializeRankingsFilterForm: PropTypes.func.isRequired,
    loadAges: PropTypes.func.isRequired,
    loadGenders: PropTypes.func.isRequired,
    loadRankings: PropTypes.func.isRequired,
    style: PropTypes.object,
    onChange: PropTypes.func.isRequired
  };

  async componentDidMount () {
    const ages = await this.props.loadAges();
    const genders = await this.props.loadGenders();
    // Initialize form and refresh rankings.
    await this.props.initializeRankingsFilterForm(ages, genders);
    await this.props.onChange();
  }

  static styles = {
    filters: {
      marginLeft: '-0.75em',
      marginRight: '-0.75em'
    },
    field: {
      display: 'inline-block',
      paddingLeft: '0.75em',
      paddingRight: '0.75em',
      paddingTop: 0,
      paddingBottom: '0.5em',
      width: '100%',
      [mediaQueries.small]: {
        width: '50%'
      },
      [mediaQueries.medium]: {
        width: '50%'
      }
    },
    title: {
      ...makeTextStyle(fontWeights.medium, '0.75em'),
      color: '#6d8791',
      paddingBottom: '1em'
    }
  };

  render () {
    const styles = this.constructor.styles;
    const { ages, agesById, genders, gendersById, style, onChange } = this.props;
    return (
      <form style={style}>
        <h2 style={styles.title}>Filter</h2>
        <div style={styles.filters}>
          <Field
            component={SelectInput}
            getItemText={(id) => agesById.getIn([ id, 'description' ])}
            isLoading={isLoading(ages)}
            multiselect
            name='ages'
            options={ages.get('data').map((e) => e.get('id')).toJS()}
            placeholder='Age'
            style={styles.field}
            onChange={onChange.bind(null, 'ages')} />
          <Field
            component={SelectInput}
            getItemText={(id) => gendersById.getIn([ id, 'description' ])}
            isLoading={genders.get('_status') === FETCHING}
            multiselect
            name='genders'
            options={genders.get('data').map((e) => e.get('id')).toJS()}
            placeholder='Gender'
            style={styles.field}
            onChange={onChange.bind(null, 'genders')} />
          {/* TODO: add location filter. */}
        </div>
      </form>
    );
  }
}

@Radium
class RankingItem extends Component {

  static propTypes = {
    count: PropTypes.number.isRequired,
    countLabel: PropTypes.string.isRequired,
    imageUrl: PropTypes.string,
    position: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired
  };

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
    const { imageUrl, position, count, countLabel, title } = this.props;
    return (
      <div style={styles.container}>
        <span style={styles.position}>{position}</span>
          <div>
            <div style={styles.image.wrapper} >
              {imageUrl && <img alt={title} src={imageUrl} style={styles.image.image} title={title} />}
            </div>
          </div>
        <span style={styles.title}>{title}</span>
        <span style={styles.count}><b>{count}</b> {countLabel}</span>
      </div>
    );
  }
}

@connect(rankingsSelector, (dispatch) => ({
  loadRankings: bindActionCreators(actions.loadRankings, dispatch)
}))
export default class Rankings extends Component {

  static propTypes = {
    brandSubscriptions: ImmutablePropTypes.map.isRequired,
    characterSubscriptions: ImmutablePropTypes.map.isRequired,
    loadRankings: PropTypes.func.isRequired,
    mediumSubscriptions: ImmutablePropTypes.map.isRequired,
    mediumSyncs: ImmutablePropTypes.map.isRequired,
    productViews: ImmutablePropTypes.map.isRequired
  };

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
    const { brandSubscriptions, characterSubscriptions, mediumSubscriptions, mediumSyncs, productViews } = this.props;

    return (
      <div>
        <Container>
          <RankingsFilterForm
            style={styles.filter}
            onChange={() => this.props.loadRankings()}/>
        </Container>
        <div style={styles.rankings}>
          <Container>
            <div style={styles.widgets}>
              <Widget contentStyle={styles.rankingWidget} isLoading={isLoading(mediumSubscriptions)} title='Programs'>
                {mediumSubscriptions.get('data').map((ms, i) => (
                  <RankingItem
                    count={ms.count}
                    countLabel='Subscribers'
                    imageUrl={ms.medium.posterImage && ms.medium.posterImage.url}
                    key={ms.medium.id}
                    position={i + 1}
                    title={ms.medium.title} />
                ))}
              </Widget>
              <Widget contentStyle={styles.rankingWidget} isLoading={isLoading(mediumSubscriptions)} title='Program syncs'>
                {mediumSyncs.get('data').map((ms, i) => (
                  <RankingItem
                    count={ms.count}
                    countLabel='Syncs'
                    imageUrl={ms.medium.posterImage && ms.medium.posterImage.url}
                    key={ms.medium.id}
                    position={i + 1}
                    title={ms.medium.title} />
                ))}
              </Widget>
              {/* <Widget contentStyle={styles.rankingWidget} title='Interactive commercials'>{content}</Widget> */}
              <Widget contentStyle={styles.rankingWidget} isLoading={isLoading(characterSubscriptions)} title='Characters'>
                {characterSubscriptions.get('data').map((cs, i) => (
                  <RankingItem
                    count={cs.count}
                    countLabel='Subscribers'
                    imageUrl={cs.character.portraitImage && cs.character.portraitImage.url}
                    key={cs.character.id}
                    position={i + 1}
                    title={cs.character.name ? `${cs.character.name} - ${cs.medium.title}` : cs.medium.title} />
                ))}
              </Widget>
              <Widget contentStyle={styles.rankingWidget} isLoading={isLoading(productViews)} title='Products'>
                {productViews.get('data').map((pw, i) => (
                  <RankingItem
                    count={pw.count}
                    countLabel='Views'
                    imageUrl={pw.product.image && pw.product.image.url}
                    key={pw.product.id}
                    position={i + 1}
                    title={pw.product.shortName} />
                ))}
              </Widget>
              <Widget contentStyle={styles.rankingWidget} isLoading={isLoading(brandSubscriptions)} title='Brands'>
                {brandSubscriptions.get('data').map((bs, i) => (
                  <RankingItem
                    count={bs.count}
                    countLabel='Subscribers'
                    imageUrl={bs.brand.logo && bs.brand.logo.url}
                    key={bs.brand.id}
                    position={i + 1}
                    title={bs.brand.name} />
                ))}
              </Widget>
            </div>
          </Container>
        </div>
      </div>
    );
  }
}
