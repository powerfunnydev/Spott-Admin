/* eslint-disable react/no-set-state */
import React, { Component, PropTypes } from 'react';
import Infinite from 'react-infinite';

export default class InfiniteScroll extends Component {

  static propTypes = {
    children: PropTypes.node,
    containerHeight: PropTypes.number.isRequired,
    elementHeight: PropTypes.number.isRequired,
    isLoading: PropTypes.bool.isRequired,
    loadMore: PropTypes.func.isRequired,
    // The distance between the bottom of the page and the current scroll location,
    // which triggers the loadMore function.
    offset: PropTypes.number.isRequired,
    // Optional current page.
    page: PropTypes.number
  };

  constructor (props) {
    super(props);
    this.loadMore = ::this.loadMore;
    this.skipFirst = true;
  }

  loadMore () {
    if (!this.skipFirst) {
      this.props.loadMore(this.props.page + 1);
    }
    this.skipFirst = false;
  }

  render () {
    const { children, containerHeight, elementHeight, isLoading, offset } = this.props;

    return (
      <Infinite
        containerHeight={containerHeight}
        elementHeight={elementHeight}
        infiniteLoadBeginEdgeOffset={offset}
        isInfiniteLoading={isLoading}
        onInfiniteLoad={this.loadMore}>
        {children}
      </Infinite>
      );
  }

}
