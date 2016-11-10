import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { routerPushWithReturnTo } from '../../../../actions/global';
import { concatCamelCase, determineSortDirection } from './index';

export function tableDecorator (prefix) {
  return function (WrappedComponent) {
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
          console.log('prefix', prefix);
          this.onChangePage = ::this.onChangePage;
          this.onSortField = ::this.onSortField;
          this.onChangeSearchString = ::this.onChangeSearchString;
          this.onChangeDisplay = ::this.onChangeDisplay;
        }

        onChangeDisplay (newDisplay) {
          const query = {
            ...this.props.location.query,
            [concatCamelCase('display', prefix)]: newDisplay
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
            [concatCamelCase('searchString', prefix)]: value
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
            [concatCamelCase('page', prefix)]: nextPage
          };
          // props will be updated -> componentWillReceiveProps
          this.props.routerPushWithReturnTo({
            ...this.props.location,
            query
          });
        }

        onSortField (sortField) {
          const querySortDirection = concatCamelCase('sortDirection', prefix);
          const querySortField = concatCamelCase('sortField', prefix);
          const query = {
            ...this.props.location.query,
            [concatCamelCase('page', prefix)]: 0,
            [querySortField]: sortField,
            [querySortDirection]: determineSortDirection(sortField, this.props.location.query[querySortField], this.props.location.query[querySortDirection])
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
  };
}
