import React, { Component, PropTypes } from 'react';
import Radium from 'radium';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Root, colors, EditTemplate } from '../../../_common/styles';
import { routerPushWithReturnTo } from '../../../../actions/global';
import { SideMenu } from '../../../app/sideMenu';
import Header from '../../../app/multiFunctionalHeader';
import MediumCategories from './mediumCategories/list';
import Section from '../../../_common/components/section';
import ProductCategories from './productCategories/list';

@connect(null, (dispatch) => ({
  routerPushWithReturnTo: bindActionCreators(routerPushWithReturnTo, dispatch)
}))
@Radium
export default class EditProduct extends Component {

  static propTypes = {
    params: PropTypes.object.isRequired,
    routerPushWithReturnTo: PropTypes.func.isRequired
  };

  constructor (props) {
    super(props);
    this.redirect = ::this.redirect;
  }

  redirect () {
    this.props.routerPushWithReturnTo('/settings/categories', true);
  }

  static styles = {
    backgroundRoot: {
      backgroundColor: colors.lightGray4,
      paddingBottom: '50px'
    }
  };

  render () {
    const styles = this.constructor.styles;
    return (
      <SideMenu>
        <Root style={styles.backgroundRoot}>
          <Header hierarchy={[ { title: 'Categories', url: '/settings/categories' } ]}/>
          <EditTemplate onCancel={this.redirect}>
            <Section>
              <MediumCategories />
              <ProductCategories/>
            </Section>
        </EditTemplate>
      </Root>
    </SideMenu>
    );
  }

}
