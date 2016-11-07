import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { routerPushWithReturnTo } from '../../../../actions/global';
import { determineSortDirection } from './index';

export function tableDecorator (WrappedComponent) {
  return (
    @connect(null, (dispatch) => ({
      routerPushWithReturnTo: bindActionCreators(routerPushWithReturnTo, dispatch)
    }))
    class TableDecorator extends Component {

      static propTypes = {
        location: PropTypes.shape({
          pathname: PropTypes.string.isRequired,
          query: PropTypes.object.isRequired
        }),
        routerPushWithReturnTo: PropTypes.func.isRequired
      };

      constructor (props, context) {
        super(props, context);
        this.onChangePage = ::this.onChangePage;
        this.onSortField = ::this.onSortField;
        this.onChangeSearchString = ::this.onChangeSearchString;
        this.onChangeDisplay = ::this.onChangeDisplay;
      }

      onChangeDisplay (newDisplay) {
        const query = {
          ...this.props.location.query,
          display: newDisplay
        };
        // props will be updated -> componentWillReceiveProps
        this.props.routerPushWithReturnTo({
          ...this.props.location,
          query
        });
      }

      onChangeSearchString (value) {
        const query = {
          ...this.props.location.query,
          searchString: value
        };
        // props will be updated -> componentWillReceiveProps
        this.props.routerPushWithReturnTo({
          ...this.props.location,
          query
        });
      }

      onChangePage (page, next = true) {
        let currentPage = 0;
        if (!isNaN(page) && typeof page === 'number') {
          currentPage = page;
        }
        const nextPage = next ? currentPage + 1 : currentPage - 1;
        const query = {
          ...this.props.location.query,
          page: nextPage
        };
        // props will be updated -> componentWillReceiveProps
        this.props.routerPushWithReturnTo({
          ...this.props.location,
          query
        });
      }

      onSortField (sortField) {
        const query = {
          ...this.props.location.query,
          page: 0,
          sortField,
          sortDirection: determineSortDirection(sortField, this.props.location.query)
        };
        // props will be updated -> componentWillReceiveProps
        this.props.routerPushWithReturnTo({
          ...this.props.location,
          query
        });
      }

      render () {
        return <WrappedComponent {...this.props} onChangeDisplay={this.onChangeDisplay} onChangePage={this.onChangePage} onChangeSearchString={this.onChangeSearchString} onSortField={this.onSortField} />;
      }
    }
  );
}
