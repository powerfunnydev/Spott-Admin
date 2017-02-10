import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { routerPushWithReturnTo } from '../../../../actions/global';
import { concatCamelCase, determineSortDirection, convertString } from './index';

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
          this.getFilterObjectFromQuery = :: this.getFilterObjectFromQuery;
          this.onChangePage = ::this.onChangePage;
          this.onSortField = ::this.onSortField;
          this.onChangeSearchString = ::this.onChangeSearchString;
          this.onChangeDisplay = ::this.onChangeDisplay;
          this.onChangeFilter = ::this.onChangeFilter;
        }

        getFilterObjectFromQuery (filterArray) {
          const query = this.props.location.query;
          const filterObj = {};
          for (const filter of filterArray) {
            const prefixFilter = concatCamelCase(filter.concat('Filter'), prefix);
            if (query[prefixFilter]) {
              // query[prefixFilter] is a string,  so we need to convert this string to a boolean if necassary.
              filterObj[filter] = convertString(query[prefixFilter]);
            }
          }
          return filterObj;
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

        // filterObj contains the fields and values of filters.
        // E.g.: { published: true, drafted: true }
        onChangeFilter (filterObj) {
          const queryObj = { ...this.props.location.query };
          console.log('prefix', prefix);
          for (const filter in filterObj) {
            queryObj[concatCamelCase(filter.concat('Filter'), prefix)] = filterObj[filter];
          }
          // props will be updated -> componentWillReceiveProps
          this.props.routerPushWithReturnTo({
            ...this.props.location,
            query: queryObj
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
          return (
            <WrappedComponent
              {...this.props}
              getFilterObjectFromQuery={this.getFilterObjectFromQuery}
              onChangeDisplay={this.onChangeDisplay}
              onChangeFilter={this.onChangeFilter}
              onChangePage={this.onChangePage}
              onChangeSearchString={this.onChangeSearchString}
              onClearFilters={this.onClearFilters}
              onSortField={this.onSortField} />);
        }
      }
    );
  };
}
