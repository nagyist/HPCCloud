import ActiveList       from '../../../panels/ActiveList';
import Toolbar          from '../../../panels/Toolbar';
import GroupForm      from './GroupForm';
import EmptyPlaceholder from '../../../panels/EmptyPlaceholder';
import ButtonBar        from '../../../panels/ButtonBar';
import React            from 'react';
import { breadcrumb }   from '..';
import getNetworkError  from '../../../utils/getNetworkError';

import theme from 'HPCCloudStyle/Theme.mcss';
import style from 'HPCCloudStyle/PageWithMenu.mcss';

import { connect }      from 'react-redux';
import * as Actions     from '../../../redux/actions/groups';
import * as UserActions from '../../../redux/actions/user';
import * as NetActions  from '../../../redux/actions/network';
import { dispatch }     from '../../../redux';

const GroupPrefs = React.createClass({
  displayName: 'Preferences/Groups',

  propTypes: {
    active: React.PropTypes.number,
    list: React.PropTypes.array,
    groups: React.PropTypes.object,
    usersByGroup: React.PropTypes.object,
    users: React.PropTypes.object,
    user: React.PropTypes.object,
    error: React.PropTypes.string,
    onAddItem: React.PropTypes.func,
    onRemoveItem: React.PropTypes.func,
    onActiveChange: React.PropTypes.func,
    getGroups: React.PropTypes.func,
    getUsers: React.PropTypes.func,
  },

  componentDidMount() {
    this.props.getGroups();
    this.props.getUsers();
  },

  formAction(action) {
    this[action]();
  },

  removeItem() {
    const { list, active, onRemoveItem } = this.props;
    const groupToDelete = list[active];
    if (groupToDelete._id && confirm('Are you sure you want to delete this group?')) {
      onRemoveItem(active, groupToDelete);
    } else if (!groupToDelete._id) {
      onRemoveItem(active, groupToDelete);
    }

    this.setState({ _error: null });
  },

  activeChange(active) {
    this.props.onActiveChange(active);
  },

  render() {
    const { active, list } = this.props;
    const activeData = active < list.length ? list[active] : null;
    let groupUsers = [];
    if (activeData && activeData._id) {
      groupUsers = this.props.usersByGroup[activeData._id];
    }

    const actions = [{ name: 'removeItem', label: 'Delete Group', icon: style.deleteIcon, disabled: false }];
    const clusterBreadCrumb = breadcrumb(this.props.user, 'Groups');

    let content = null;
    if (list && list.length) {
      content = (<div className={ style.content }>
        <GroupForm data={activeData}
          onChange={ this.changeItem }
          users={this.props.users}
          groupUsers={groupUsers}
        />
        <hr />
        <ButtonBar
          visible={!!activeData}
          onAction={ this.formAction }
          error={ this.props.error }
          actions={actions}
        />
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
      usersByGroup: localState.usersByGroup,
      users: state.auth.userMap,
      user: state.auth.user,
      error: getNetworkError(state, ['save_group', 'remove_group']),
    };
  },
  () => ({
    getGroups: () => dispatch(Actions.getGroups()),
    getUsers: () => dispatch(UserActions.getUsers()),
    onAddItem: () => dispatch(Actions.addGroup()),
    onActiveChange: (index) => dispatch(Actions.updateActiveGroup(index)),
    onUpdateItem: (index, group) => dispatch(Actions.saveGroup(index, group)),
    onRemoveItem: (index, group) => dispatch(Actions.deleteGroup(index, group)),
    invalidateErrors: () => dispatch(NetActions.invalidateErrors(['save_group', 'remove_group'])),
  })
)(GroupPrefs);
