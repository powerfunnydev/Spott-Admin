import React, { Component, PropTypes } from 'react';
import Radium from 'radium';
import { fromJS } from 'immutable';
import { colors, fontWeights, makeTextStyle, mediaQueries } from '../../_common/styles';
import * as globalActions from '../../../actions/global';
import ListView from '../../_common/components/listView/index';
import Button from '../../_common/components/buttons/button';
import ImageTitle from './imageTitle';
import Widget from './widget';
import OpportunitySection from './opportunitySection';

@Radium
export default class OpportunitiesWidget extends Component {

  static propTypes = {
    children: PropTypes.node,
    isLoading: PropTypes.bool,
    style: PropTypes.object,
    title: PropTypes.string
  };

  static styles = {
    title: {
      ...makeTextStyle(fontWeights.medium, '1.5em'),
      color: colors.veryDarkGray,
      textAlign: 'center'
    },
    description: {
      ...makeTextStyle(fontWeights.regular, '0.938em', 0.3),
      color: colors.darkGray3,
      textAlign: 'center',
      paddingBottom: 51,
      paddingLeft: 40,
      paddingRight: 40
    },
    arrow: {
      base: {
        flex: 1,
        paddingBottom: 21,
        paddingLeft: 40,
        paddingRight: 40,
        paddingTop: 21,
        textAlign: 'center'
      },
      right: {
        backgroundColor: colors.lightGreen2
      }
    },
    arrows: {
      alignItems: 'center',
      display: 'flex',
      justifyContent: 'center',
      border: `solid 1px ${colors.lightGray3}`,
      borderRadius: 2,
      height: 92,
      overflow: 'hidden',
      marginBottom: 48
    },
    arrowLine: {
      backgroundColor: colors.white,
      borderTop: `solid 1px ${colors.lightGray3}`,
      borderRight: `solid 1px ${colors.lightGray3}`,
      height: 66,
      transform: 'rotate(45deg)',
      borderRadius: 2,
      width: 66,
      marginLeft: -33,
      marginRight: -33
    },
    subscribersTitle: {
      ...makeTextStyle(fontWeights.medium, '1.063em'),
      color: colors.black2,
      paddingBottom: 4
    },
    subscribersCount: {
      base: {
        ...makeTextStyle(fontWeights.medium, '1.5em', 0.7),
        color: colors.lightGray3
      },
      positive: {
        color: colors.lightGreen
      }
    },
    container: {
      display: 'inline-block',
      width: '100%',
      maxWidth: 648
    },
    widget: {
      textAlign: 'center'
    },
    opportunitySection: {
      marginBottom: 24
    },
    sectionDescription: {
      ...makeTextStyle(fontWeights.regular, '0.813em', 0.2),
      color: colors.darkGray3,
      textAlign: 'center',
      paddingBottom: 24
    },
    sectionTitle: {
      ...makeTextStyle(fontWeights.medium, '0.813em', 0.2),
      color: colors.veryDarkGray,
      textAlign: 'center',
      paddingBottom: 20,
      textTransform: 'uppercase'
    },
    mailAccounts: {
      label: {
        ...makeTextStyle(fontWeights.medium, '1.5em'),
        color: colors.lightGreen,
        textAlign: 'center',
        paddingBottom: 7
      },
      title: {
        ...makeTextStyle(fontWeights.medium, '1.063em'),
        color: colors.black2,
        textAlign: 'center',
        paddingBottom: 40
      }
    }
  };

  getTitle (item) {
    return <ImageTitle imageUrl={item.get('url')} title={item.get('title')} />;
  }

  render () {
    const styles = this.constructor.styles;
    const { style, title } = this.props;
    const subscribersCount = 3580;

    const columns = [
      { colspan: 3, convert: this.getTitle, title: 'TITLE', type: 'custom' },
      { colspan: 1, name: 'type', title: 'TYPE', type: 'custom' },
      { colspan: 1, name: 'subscriptions', title: 'SUBSCRIPTIONS', type: 'custom' }
    ];

    const productPlacementData = fromJS({
      _status: 'loaded',
      data: [
        { convert: this.getTitle, title: 'Familie', type: 'TV-Series', subscriptions: 468, url: 'https://spott-cms-rest-tst.appiness.mobi:443/apptvate/rest/v004/image/images/51305c9e-8db8-4f2f-8afe-6b21eef92711' },
        { title: 'Louise Van den Bossche', type: 'Character', subscriptions: 234, url: 'https://spott-cms-rest-tst.appiness.mobi:443/apptvate/rest/v004/image/images/51305c9e-8db8-4f2f-8afe-6b21eef92711' },
        { title: 'Modern Family', type: 'TV-Series', subscriptions: 542, url: 'https://spott-cms-rest-tst.appiness.mobi:443/apptvate/rest/v004/image/images/51305c9e-8db8-4f2f-8afe-6b21eef92711' }
      ]
    });

    return (
      <Widget style={[ style, styles.widget ]} title={title}>
        <div style={styles.container}>
          <div style={[ styles.title, { paddingBottom: 48 } ]}>Your Opportunities</div>
          <div style={styles.arrows}>
            <div style={styles.arrow.base}>
              <div>
                <div style={styles.subscribersTitle}>Current subscriber base</div>
                <div style={styles.subscribersCount.base}>{subscribersCount} users</div>
              </div>
            </div>
            <div style={styles.arrowLine} />
            <div style={[ styles.arrow.base, styles.arrow.right ]}>
              <div>
                <div style={styles.subscribersTitle}>Potential subscribtions</div>
                <div style={[ styles.subscribersCount.base, styles.subscribersCount.positive ]}>+{subscribersCount} users</div>
              </div>
            </div>
          </div>
          <div style={[ styles.title, { paddingBottom: 13 } ]}>How?</div>
          <div style={styles.description}>
            We offer several solutions for promoting your brand which will impact your subscribers base directly. Click on a plan to see how.
          </div>
          <OpportunitySection style={styles.opportunitySection} title='Targeted campaign'>
            Targeted campaign
          </OpportunitySection>
          <OpportunitySection style={styles.opportunitySection} title='Interactive TV commercial'>
            Interactive TV commercial
          </OpportunitySection>
          <OpportunitySection style={styles.opportunitySection} title='Product placement'>
            <div style={styles.sectionDescription}>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas nisl dolor, aliquam ac commodo quis, rutrum at tortor. Aenean semper, eros ut facilisis ultrices, lorem lectus ultrices ipsum dolor amet.</div>
            <div style={styles.sectionTitle}>Our product placement suggestions</div>
            <ListView
              columns={columns}
              data={productPlacementData}/>
            <Button style={{ marginLeft: 0, marginTop: 24, width: '100%' }} text='Contact us and start a product placement deal' onClick={() => null}/>
          </OpportunitySection>
          <OpportunitySection style={styles.opportunitySection} title='Quarterly newsletter'>
            Quarterly newsletter
          </OpportunitySection>
          <OpportunitySection style={styles.opportunitySection} title='Mail accounts'>
            <div style={[ styles.sectionDescription, { paddingBottom: 32 } ]}>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas nisl dolor, aliquam ac commodo quis, rutrum at tortor. Aenean semper, eros ut facilisis ultrices, lorem lectus ultrices ipsum dolor amet.</div>
            <div style={styles.mailAccounts.label}>3580 users</div>
            <div style={styles.mailAccounts.title}>Subscribed to your brand</div>
            <Button style={{ marginLeft: 0, width: '100%' }} text='Contact us and start a product placement deal' onClick={() => null}/>
          </OpportunitySection>
          <div>
            <div style={[ styles.description, { fontSize: '0.813em', paddingBottom: 18, paddingTop: 26 } ]}>
              Feel free to contact us for more information on our offerings.
            </div>
            <Button style={{ marginBottom: 20, marginLeft: 0 }} text='Get in touch' onClick={() => null}/>
          </div>
        </div>
      </Widget>
    );
  }
}
