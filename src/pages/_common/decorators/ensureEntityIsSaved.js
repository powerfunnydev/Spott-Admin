import React, { Component, PropTypes } from 'react';
import { alert } from '../components/alert';
import { withRouter } from 'react-router';

export default function ensureEntityIsSaved (WrappedComponent) {
  return withRouter(
    class EnsureEntityIsSaved extends Component {

      static propTypes = {
        closePopUpMessage: PropTypes.func,
        dirty: PropTypes.bool,
        location: PropTypes.object,
        popUpMessage: PropTypes.object,
        route: PropTypes.object.isRequired,
        router: PropTypes.shape({
          setRouteLeaveHook: PropTypes.func.isRequired
        }).isRequired,
        routerPushWithReturnTo: PropTypes.func.isRequired
      }

      constructor (props, context) {
        super(props, context);
        this.onChangeTab = ::this.onChangeTab;
        this.onBeforeChangeTab = ::this.onBeforeChangeTab;
      }

      componentWillReceiveProps (nextProps) {
        // When we edit the form after a save, we want to clear the popup.
        if (this.props.popUpMessage && nextProps.dirty) {
          this.props.closePopUpMessage && this.props.closePopUpMessage();
        }
      }

      componentDidMount () {
        this.props.router.setRouteLeaveHook(this.props.route, () => {
          if (this.props.dirty) {
            return 'Are you sure you want to leave this page? There are still unsaved fields on this page.';
          }
          this.props.closePopUpMessage && this.props.closePopUpMessage();
          return true;
        });
      }

      onBeforeChangeTab () {
        if (this.props.dirty) {
          alert('There are still unsaved fields. You need to save this entity before you can trigger this action.');
          return false;
        }
        return true;
      }

      onChangeTab (tab) {
        if (this.props.popUpMessage) {
          this.props.closePopUpMessage();
        }
        this.props.routerPushWithReturnTo({ ...this.props.location, query: { ...this.props.location.query, tab } });
      }

      render () {
        return <WrappedComponent {...this.props} onBeforeChangeTab={this.onBeforeChangeTab} onChangeTab={this.onChangeTab} />;
      }
    }
  );
}
