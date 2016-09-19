import React, { Component, PropTypes } from 'react';
import Radium from 'radium';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
// import { Link } from 'react-router';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { reduxForm, Field } from 'redux-form/immutable';
// import Header from '../app/header';
import SelectInput from '../_common/inputs/selectInput';
import { colors, fontWeights, makeTextStyle, mediaQueries, Container } from '../_common/styles';
import { FETCHING } from '../../constants/statusTypes';
import * as actions from './actions';
import { filterSelector } from './selector';
import Widget from './widget';

@connect(filterSelector, (dispatch) => ({
  searchMedia: bindActionCreators(actions.searchMedia, dispatch)
}))
@reduxForm({
  destroyOnUnmount: false,
  form: 'reportingFilter'
})
@Radium
class FilterForm extends Component {

  static propTypes = {
    searchMedia: PropTypes.func.isRequired,
    searchedMediumIds: ImmutablePropTypes.map.isRequired,
    seriesById: ImmutablePropTypes.map,
    style: PropTypes.object
  };

  static styles = {
    filters: {
      marginLeft: '-0.75em',
      marginRight: '-0.75em'
    },
    filter: {
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
        width: '25%'
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
    const { searchMedia, seriesById, searchedMediumIds, style } = this.props;
    return (
      <form style={style}>
        <h2 style={styles.title}>Filter</h2>
        <div style={styles.filters}>
          <Field
            component={SelectInput}
            getItemText={(id) => seriesById.getIn([ id, 'title' ])}
            getOptions={searchMedia}
            isLoading={searchedMediumIds.get('_status') === FETCHING}
            multiselect
            name='ages'
            options={searchedMediumIds.get('data').toJS()}
            placeholder='Ages'
            style={styles.filter}
            onChange={(e) => console.warn('UPDATE', e)} />
          <Field
            component={SelectInput}
            getItemText={(id) => seriesById.getIn([ id, 'title', seriesById.getIn([ id, 'defaultLocale' ]) ])}
            getOptions={searchMedia}
            isLoading={searchedMediumIds.get('_status') === FETCHING}
            multiselect
            name='genders'
            options={searchedMediumIds.get('data').toJS()}
            placeholder='Genders'
            style={styles.filter}
            onChange={(e) => console.warn('UPDATE', e)} />
          {/* TODO: add location filter. */}
        </div>
      </form>
    );
  }
}

@Radium
class RankingItem extends Component {

  static propTypes = {
    imageUrl: PropTypes.string,
    position: PropTypes.number.isRequired,
    subscribers: PropTypes.number.isRequired,
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
      width: '4em',
      marginRight: '1.25em'
    },
    title: {
      ...makeTextStyle(fontWeights.regular, '0.75em'),
      color: '#17262b',
      marginRight: '0.625em',
      width: '100%',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap'
    },
    subscribers: {
      ...makeTextStyle(fontWeights.regular, '0.625em'),
      color: '#6d8791',
      textAlign: 'right',
      width: '100%',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap'
    }
  };

  render () {
    const styles = this.constructor.styles;
    const { imageUrl, position, subscribers, title } = this.props;
    return (
      <div style={styles.container}>
        <span style={styles.position}>{position}</span>
        {imageUrl &&
          <div>
            <div style={styles.image.wrapper} >
              <img alt={title} src={imageUrl} style={styles.image.image} title={title} />
            </div>
          </div>}
        <span style={styles.title}>{title}</span>
        <span style={styles.subscribers}><b>{subscribers}</b> subscribers</span>
      </div>
    );
  }
}

// @connect(selector, (dispatch) => ({
//   searchMedia: bindActionCreators(actions.searchMedia, dispatch)
// }))
export default class Rankings extends Component {

  static propTypes = {
    // searchMedia: PropTypes.func.isRequired,
    // searchedMediumIds: ImmutablePropTypes.map.isRequired,
    // seriesById: ImmutablePropTypes.map
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
      marginLeft: '-0.75em',
      marginRight: '-0.75em'
    },
    rankingWidget: {
      paddingBottom: 0,
      paddingLeft: 0,
      paddingRight: 0,
      paddingTop: 0
    }
  };

  render () {
    const styles = this.constructor.styles;
    const imageUrl = 'https://media.licdn.com/mpr/mpr/shrink_200_200/AAEAAQAAAAAAAAjwAAAAJGMzMDNiZDE5LTEyOGMtNDU2OS05MGMyLTM2ZTdmYjYzNTRlNg.png';
    // const { searchMedia, seriesById, searchedMediumIds } = this.props;
    const content = [ 1, 2, 3, 4, 5, 6 ].map((i) => <RankingItem imageUrl={imageUrl} key={i} position={i} subscribers={Math.round(Math.random() * 100000)} title='Dagelijkse Kost' />);
    return (
      <div>
        <Container>
          <FilterForm style={styles.filter}/>
        </Container>
        <div style={styles.rankings}>
          <Container>
            <div style={styles.widgets}>
              <Widget contentStyle={styles.rankingWidget} title='Programs'>{content}</Widget>
              <Widget contentStyle={styles.rankingWidget} title='Interactive commercials'>{content}</Widget>
              <Widget contentStyle={styles.rankingWidget} title='Characters'>{content}</Widget>
              <Widget contentStyle={styles.rankingWidget} title='Products'>{content}</Widget>
              <Widget contentStyle={styles.rankingWidget} title='Brands'>{content}</Widget>
            </div>
          </Container>
        </div>
      </div>
    );
  }
}
