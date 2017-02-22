import ActiveList       from '../../../panels/ActiveList';
import Toolbar          from '../../../panels/Toolbar';
import GroupForm      from './GroupForm';
import EmptyPlaceholder from '../../../panels/EmptyPlaceholder';
// import ButtonBar        from '../../../panels/ButtonBar';
import React            from 'react';
import { breadcrumb }   from '..';
// import getNetworkError  from '../../../utils/getNetworkError';

import theme from 'HPCCloudStyle/Theme.mcss';
import style from 'HPCCloudStyle/PageWithMenu.mcss';

// import get          from 'mout/src/object/get';
import { connect }  from 'react-redux';
import * as Actions from '../../../redux/actions/groups';
import * as NetActions from '../../../redux/actions/network';
import { dispatch } from '../../../redux';

const GroupPrefs = React.createClass({
  displayName: 'Preferences/Groups',

  propTypes: {
    active: React.PropTypes.number,
    list: React.PropTypes.array,
    groups: React.PropTypes.object,
    user: React.PropTypes.object,
    onAddItem: React.PropTypes.func,
    onActiveChange: React.PropTypes.func,
    getGroups: React.PropTypes.func,
  },

  componentDidMount() {
    this.props.getGroups();
  },

  activeChange(active) {
    this.props.onActiveChange(active);
  },

  render() {
    const { active, list } = this.props;
    const activeData = active < list.length ? list[active] : null;

    const clusterBreadCrumb = breadcrumb(this.props.user, 'Groups');

    let content = null;
    if (list && list.length) {
      content = (<div className={ style.content }>
        <GroupForm data={activeData} onChange={ this.changeItem } />
      </div>);
    } else {
      content = (<EmptyPlaceholder phrase={
        <span>
          There are no Groups available <br />
          You can create some with the <i className={theme.addIcon} /> above
        </span> }
      />);
    }

    return (
      <div className={ style.rootContainer }>
        <Toolbar breadcrumb={ clusterBreadCrumb } title="Groups"
          actions={[{ name: 'add', icon: style.addIcon }]} onAction={this.props.onAddItem}
          hasTabs
        />
        <div className={ style.container }>
          <ActiveList
            className={ style.menu }
            onActiveChange={this.activeChange}
            active={active}
            list={list}
          />
          { content }
        </div>
      </div>);
  },
});

export default connect(
  (state) => {
    const localState = state.groups;

    return {
      active: localState.active,
      list: localState.list,
      groups: localState.mapById,
      user: state.auth.user,
      // buttonsDisabled: localState.pending,
      // error: getNetworkError(state, ['save_cluster', 'remove_cluster']),
    };
  },
  () => ({
    getGroups: () => dispatch(Actions.getGroups()),
    getUsers: () => dispatch(Actions.getUsers()),
    onAddItem: () => dispatch(Actions.addGroup()),
    onActiveChange: (index) => dispatch(Actions.updateActiveGroup(index)),
    onUpdateItem: (index, group) => dispatch(Actions.saveCluster(index, group)),
    onRemoveItem: (index, group) => dispatch(Actions.removeCluster(index, group)),
    invalidateErrors: () => dispatch(NetActions.invalidateErrors(['save_group', 'remove_group'])),
  })
)(GroupPrefs);
