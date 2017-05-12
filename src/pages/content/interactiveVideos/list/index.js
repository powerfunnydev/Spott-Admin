/* eslint-disable react/no-set-state */
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { Root, Container, colors, fontWeights, makeTextStyle } from '../../../_common/styles';
import { isQueryChanged, tableDecorator, generalStyles, TotalEntries, Pagination } from '../../../_common/components/table/index';
import Line from '../../../_common/components/line';
import ListView from '../../../_common/components/listView/index';
import Radium from 'radium';
import * as actions from './actions';
import selector from './selector';
import { routerPushWithReturnTo } from '../../../../actions/global';
import { slowdown } from '../../../../utils';
import { SideMenu } from '../../../app/sideMenu';
import Header from '../../../app/multiFunctionalHeader';
import Modal from '../../../_common/components/modal';
import QuestionSVG from '../../../_common/images/question';

@tableDecorator()
@connect(selector, (dispatch) => ({
  fetchLog: bindActionCreators(actions.fetchLog, dispatch),
  load: bindActionCreators(actions.load, dispatch),
  routerPushWithReturnTo: bindActionCreators(routerPushWithReturnTo, dispatch),
  selectAllCheckboxes: bindActionCreators(actions.selectAllCheckboxes, dispatch),
  selectCheckbox: bindActionCreators(actions.selectCheckbox, dispatch)
}))
@Radium
export default class InteractiveVideos extends Component {

  static propTypes = {
    children: PropTypes.node,
    fetchLog: PropTypes.func.isRequired,
    interactiveVideos: ImmutablePropTypes.map,
    isSelected: ImmutablePropTypes.map.isRequired,
    load: PropTypes.func.isRequired,
    location: PropTypes.shape({
      pathname: PropTypes.string.isRequired,
      query: PropTypes.object.isRequired
    }),
    pageCount: PropTypes.number,
    routerPushWithReturnTo: PropTypes.func.isRequired,
    selectAllCheckboxes: PropTypes.func.isRequired,
    selectCheckbox: PropTypes.func.isRequired,
    totalResultCount: PropTypes.number.isRequired,
    onChangePage: PropTypes.func.isRequired,
    onChangeSearchString: PropTypes.func.isRequired,
    onSortField: PropTypes.func.isRequired
  };

  constructor (props) {
    super(props);
    this.slowSearch = slowdown(props.load, 300);
    this.showLog = ::this.showLog;
    this.getStatusMessageWithLog = ::this.getStatusMessageWithLog;
    this.onCloseModal = ::this.onCloseModal;
    this.state = {
      modal: null
    };
  }

  async componentWillMount () {
    await this.props.load(this.props.location.query);
  }

  async componentWillReceiveProps (nextProps) {
    const nextQuery = nextProps.location.query;
    const query = this.props.location.query;
    if (isQueryChanged(query, nextQuery)) {
      this.slowSearch(nextQuery);
    }
  }

  async showLog (id) {
    const { fetchLog } = this.props;
    let log = null;
    try {
      log = await fetchLog(id);
    } catch (e) {
      log = 'No Log available.';
    }
    this.setState({
      ...this.state,
      modal: 'log',
      log
    });
  }

  getStatusMessageWithLog (data) {
    const styles = {
      done: {
        color: colors.white,
        backgroundColor: colors.strongLimeGreen,
        ':hover': {
          backgroundColor: colors.darkLimeGreen
        }
      },
      error: {
        color: colors.white,
        backgroundColor: colors.vividRed,
        ':hover': {
          backgroundColor: colors.darkVividRed
        }
      },
      tooltipOverlay: {
        padding: '11px',
        backgroundColor: 'white',
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        maxWidth: '500px'
      },
      status: {
        marginRight: 4,
        paddingLeft: 4,
        paddingRight: 4,
        paddingTop: 2,
        paddingBottom: 2,
        borderRadius: 4,
        color: colors.white,
        backgroundColor: colors.vividOrange,
        ':hover': {
          backgroundColor: colors.lightGold
        }
      },
      statusContainer: {
        fontSize: '12px',
        lineHeight: '20px',
        display: 'flex',
        alignItems: 'center',
        cursor: 'pointer'
      },
      row: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        width: '100%'
      }
    };

    const status = data.get('status');
    return (
      <div style={styles.row}>
          <div style={styles.statusContainer} onClick={() => this.showLog(data.get('id'))}>
            <div style={[ styles.status, status === 'ERROR' && styles.error,
              status === 'DONE' && styles.done ]}>
              {status}
            </div>
            <div>
              <QuestionSVG color={colors.lightGray3} hoverColor={colors.darkGray2}/>
            </div>
          </div>
      </div>
    );
  }

  onCloseModal () {
    this.setState({
      ...this.state,
      modal: null
    });
  }

  styles = {
    header: {
      alignItems: 'center',
      backgroundColor: '#eaeced',
      display: 'flex',
      justifyContent: 'space-between',
      paddingBottom: '0.813em',
      paddingLeft: '1.5em',
      paddingRight: '1.5em',
      paddingTop: '0.938em',
      borderTopLeftRadius: 4,
      borderTopRightRadius: 4,
      border: 'solid 1px #ced6da'
    },
    content: {
      backgroundColor: '#ffffff',
      paddingBottom: '1.875em',
      paddingLeft: '1.5em',
      paddingRight: '1.5em',
      paddingTop: '1.875em',
      borderLeft: 'solid 1px #ced6da',
      borderRight: 'solid 1px #ced6da'
    },
    log: {
      width: '100%',
      height: 300,
      fontFamily: 'Arial'
    },
    modalContainer: {
      backgroundColor: colors.white
    },
    wrapper: {
      boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.25)',
      width: '100%'
    },
    title: {
      ...makeTextStyle(fontWeights.regular, '1.125em', 0.5),
      color: '#536970',
      fontWeight: 'normal'
    },
    modal: {
      overlay: {
        backgroundColor: 'rgba(0, 0, 0, 0.80)'
      },
      content: {
        backgroundColor: 'transparent',
        border: 'none',
        fontFamily: 'Rubik-Regular',
        fontWeight: 'normal',
        // Set width and center horizontally
        margin: 'auto',
        minWidth: 400,
        maxWidth: 800,
        // Internal padding
        padding: 0,
        // Fit height to content, centering vertically
        bottom: 'auto',
        top: '50%',
        transform: 'translateY(-50%)',
        overflow: 'visible'
      }
    }
  }

  render () {
    const { children, interactiveVideos, isSelected, location: { query: { display, page, sortField, sortDirection } },
      pageCount, selectAllCheckboxes, selectCheckbox, totalResultCount } = this.props;
    const numberSelected = isSelected.reduce((total, selected, key) => selected && key !== 'ALL' ? total + 1 : total, 0);
    const columns = [
      { type: 'custom', title: 'DESCRIPTION', name: 'description', colspan: 3 },
      { type: 'custom', title: 'FILENAME', name: 'fileName', colspan: 3 },
      { type: 'custom', title: 'UPLOADED BY', name: 'createdBy', colspan: 2 },
      { type: 'custom', title: 'CREATED ON', name: 'createdOn', dataType: 'date', colspan: 2 },
      { type: 'custom', title: 'STATUS', convert: (data) => this.getStatusMessageWithLog(data), colspan: 1 }
    ];
    const styles = this.styles;
    return (
      <SideMenu>
        <Root>
        <Header hierarchy={[
          { title: 'Interactive videos', url: '/content/interactive-video' } ]}/>
          <Line/>
          <div style={[ generalStyles.backgroundTable, generalStyles.fillPage ]}>
            <Container style={generalStyles.paddingTable}>
              <TotalEntries
                entityType='Interactive Videos'
                numberSelected={numberSelected}
                totalResultCount={totalResultCount}
                onDeleteSelected={this.onClickDeleteSelected}/>
              {(display === undefined || display === 'list') &&
                <div>
                  <ListView
                    columns={columns}
                    data={interactiveVideos}
                    isSelected={isSelected}
                    load={() => this.props.load(this.props.location.query)}
                    selectAllCheckboxes={selectAllCheckboxes}
                    sortDirection={sortDirection}
                    sortField={sortField}
                    onCheckboxChange={(id) => selectCheckbox.bind(this, id)}
                    onSortField={(name) => this.props.onSortField.bind(this, name)} />
                  <Pagination currentPage={(page && (parseInt(page, 10) + 1) || 1)} pageCount={pageCount} onLeftClick={() => { this.props.onChangePage(parseInt(page, 10), false); }} onRightClick={() => { this.props.onChangePage(parseInt(page, 10), true); }}/>
                </div>
              }
            </Container>
            {this.state.modal === 'log' &&
            <Modal isOpen style={styles.modal} onClose={this.onCloseModal}>
              <div style={styles.wrapper}>
                <div style={styles.header}>
                  <h1 style={styles.title}>Process Log</h1>
                </div>
                  <div style={styles.content}>
                    <textarea readOnly style={styles.log} value={this.state.log && this.state.log}/>
                  </div>
              </div>
            </Modal>}
          </div>
          {children}
        </Root>
      </SideMenu>
    );
  }
}
