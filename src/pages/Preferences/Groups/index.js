import ActiveList       from '../../../panels/ActiveList';
import Toolbar          from '../../../panels/Toolbar';
import ButtonBar        from '../../../panels/ButtonBar';
import EmptyPlaceholder from '../../../panels/EmptyPlaceholder';
import React            from 'react';
import { breadcrumb }   from '..';
import getNetworkError  from '../../../utils/getNetworkError';

import theme from 'HPCCloudStyle/Theme.mcss';
import style from 'HPCCloudStyle/PageWithMenu.mcss';

import get          from 'mout/src/object/get';
import { connect }  from 'react-redux';
import * as Actions from '../../../redux/actions/clusters';
import * as NetActions from '../../../redux/actions/network';
import { dispatch } from '../../../redux';

const GroupPrefs = React.createClass({
  displayName: 'Preferences/Groups',

  render() {
    const clusterBreadCrumb = breadcrumb(this.props.user, 'Groups');
    return (
      <div className={ style.rootContainer }>
        <Toolbar breadcrumb={ clusterBreadCrumb } title="Clusters"
          actions={[{ name: 'add', icon: style.addIcon }]} onAction={this.addItem}
          hasTabs
        />
        <div className={ style.container }>
          <ActiveList
            className={ style.menu }
            onActiveChange={this.activeChange}
            active={this.props.active}
            list={this.props.list}
          />
          { 'some content' }
        </div>
      </div>);
  },
});

export default connect(
  (state) => {
    const localState = state.auth;

    return {
      active: localState.groupActive,
      list: localState.groupList,
      groups: state.auth.groupMap,
      user: state.auth.user,
      // buttonsDisabled: localState.pending,
      // error: getNetworkError(state, ['save_cluster', 'remove_cluster']),
    };
  },
  () => ({
    onUpdateItem: (index, cluster, server) => dispatch(Actions.saveCluster(index, cluster, server)),
    onActiveChange: (index) => dispatch(Actions.updateActiveCluster(index)),
    onAddItem: () => dispatch(Actions.addCluster()),
    onRemoveItem: (index, cluster) => dispatch(Actions.removeCluster(index, cluster)),
    invalidateErrors: () => dispatch(NetActions.invalidateErrors(['save_cluster', 'remove_cluster'])),
  })
)(GroupPrefs);
