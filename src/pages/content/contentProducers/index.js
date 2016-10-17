import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import ImmutablePropTypes from 'react-immutable-proptypes';
import Header from '../../app/header';
import { Container, colors, makeTextStyle } from '../../_common/styles';
import { CheckBoxCel, Table, Headers, TextCel, Rows, Row, Pagination } from '../../_common/components/table';
import Radium from 'radium';
import * as actions from './actions';
import selector from './selector';
import moment from 'moment';

/* eslint-disable react/no-set-state*/
const numberOfRows = 25;

@connect((state, ownProps) => ({
  ...selector(state)
}), (dispatch) => ({
  loadContentProducers: bindActionCreators(actions.loadContentProducers, dispatch),
  selectAllCheckboxes: bindActionCreators(actions.selectAllCheckboxes, dispatch),
  selectCheckbox: bindActionCreators(actions.selectCheckbox, dispatch),
  sortColumn: bindActionCreators(actions.sortColumn, dispatch)
}))
@Radium
export default class ContentProducers extends Component {

  static propTypes = {
    contentProducers: ImmutablePropTypes.list.isRequired,
    isSelected: ImmutablePropTypes.map.isRequired,
    loadContentProducers: PropTypes.func.isRequired,
    location: PropTypes.shape({
      pathname: PropTypes.string.isRequired
    }),
    selectAllCheckboxes: PropTypes.func.isRequired,
    selectCheckbox: PropTypes.func.isRequired,
    sortColumn: PropTypes.func.isRequired,
    sortDirections: ImmutablePropTypes.map.isRequired
  };

  constructor (props) {
    super(props);
  }

  componentWillMount () {
    this.props.loadContentProducers();
  }

  getName (cp) {
    return cp.get('name');
  }

  getCreatedOn (cp) {
    const date = new Date(cp.get('auditInfo').get('createdOn'));
    return moment(date).format('YYYY-MM-DD HH:mm');
  }

  getLastUpdatedOn (cp) {
    const date = new Date(cp.get('auditInfo').get('lastUpdatedOn'));
    return moment(date).format('YYYY-MM-DD HH:mm');
  }

  static styles = {
    header: {
      height: '32px',
      color: colors.darkGray2,
      backgroundColor: colors.white,
      ...makeTextStyle(null, '11px', '0.50px')
    },
    firstHeader: {
      borderBottom: `1px solid ${colors.lightGray2}`
    },
    notFirstHeader: {
      borderLeft: `1px solid ${colors.lightGray2}`,
      borderBottom: `1px solid ${colors.lightGray2}`
    }
  }

  render () {
    const { contentProducers, isSelected, location, selectAllCheckboxes, selectCheckbox, sortColumn, sortDirections } = this.props;
    const { styles } = this.constructor;
    console.log('contentProducers', contentProducers.toJS());
    return (
      <div>
        <Header currentPath={location.pathname} hideHomePageLinks />
        <Container>
          <Table>
            <Headers>
              {/* Be aware that width or flex of each headerCel and the related rowCel must be the same! */}
              <CheckBoxCel checked={isSelected.get('ALL')} name='header' style={[ styles.header, styles.firstHeader, { flex: 0.25 } ]} onChange={selectAllCheckboxes}/>
              <TextCel sortColumn={sortColumn.bind(this, 'NAME')} sortDirection = {sortDirections.get('NAME')} style={[ styles.header, styles.notFirstHeader, { flex: 2 } ]}>NAME</TextCel>
              <TextCel style={[ styles.header, styles.notFirstHeader, { flex: 2 } ]}>CREATED ON</TextCel>
              <TextCel sortColumn={sortColumn.bind(this, 'LAST_MODIFIED')} sortDirection = {sortDirections.get('LAST_MODIFIED')} style={[ styles.header, styles.notFirstHeader, { flex: 2 } ]}>LAST UPDATED ON</TextCel>
            </Headers>
            <Rows>
              {contentProducers.map((cp, index) => {
                return (
                  <Row index={index} isFirst={index % numberOfRows === 0} key={index} >
                    {/* Be aware that width or flex of each headerCel and the related rowCel must be the same! */}
                    <CheckBoxCel checked={isSelected.get(cp.get('uuid'))} style={{ flex: 0.25 }} onChange={selectCheckbox.bind(this, cp.get('uuid'))}/>
                    <TextCel getValue={this.getName} objectToRender={cp} style={{ flex: 2 }} onClick={() => { console.log('test'); }} />
                    <TextCel getValue={this.getCreatedOn} objectToRender={cp} style={{ flex: 2 }}/>
                    <TextCel getValue={this.getLastUpdatedOn} objectToRender={cp} style={{ flex: 2 }}/>
                  </Row>
                );
              })}
            </Rows>
          </Table>
          <Pagination /* numberOfResults={} */ numberOfResultsShownOnPage={25} onLeftClick={() => { console.log('left'); }} onRightClick={() => { console.log('right'); }}/>
        </Container>
      </div>

    );
  }

}
