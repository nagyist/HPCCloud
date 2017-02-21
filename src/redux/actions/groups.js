import client from '../../network';
import * as netActions from './network';
import { dispatch } from '..';

export const PENDING_GROUP_NETWORK = 'PENDING_GROUP_NETWORK';
export const GET_GROUPS = 'GET_GROUPS';
export const ADD_GROUP = 'ADD_GROUP';
export const SAVE_GROUP = 'SAVE_GROUP';
export const DELETE_GROUP = 'DELETE_GROUP';
export const UPDATE_ACTIVE_GROUP = 'UPDATE_ACTIVE_GROUP';
export const LIST_USERS = 'LIST_USERS';

/* eslint-disable no-shadow */

export function updateActiveGroup(index) {
  return { type: UPDATE_ACTIVE_GROUP, index };
}

export function listUsers(groupId, users) {
  return { type: LIST_USERS, groupId, users };
}

export function pendingNetworkCall(pending = true) {
  return { type: PENDING_GROUP_NETWORK, pending };
}

export function getGroups() {
  return dispatch => {
    const action = netActions.addNetworkCall('get_groups', 'get groups');
    dispatch(pendingNetworkCall(true));
    client.getGroups()
      .then(
        (resp) => {
          dispatch(netActions.successNetworkCall(action.id, resp));
          dispatch({ type: GET_GROUPS, groups: resp.data });
          dispatch(pendingNetworkCall(false));
        },
        (err) => {
          dispatch(netActions.errorNetworkCall(action.id, err));
          dispatch(pendingNetworkCall(false));
        });

    return action;
  };
}

export function addGroup() {
  return { type: ADD_GROUP };
}

export function saveGroup(index, group, pushToServer = false) {
  const saveAction = { type: SAVE_GROUP, index, group };
  if (pushToServer) {
    const action = netActions.addNetworkCall('save_group', 'Save group');
    client.createGroup(group)
      .then(
        (resp) => {
          dispatch(netActions.successNetworkCall(action.id, resp));
        },
        (err) => {
          dispatch(netActions.errorNetworkCall(action.id, err, 'form'));
        });
  }
  return saveAction;
}

export function updateGroup(group) {
  return dispatch => {
    const action = netActions.addNetworkCall('edit_group', 'Edit group');
    client.editGroup(group)
      .then((resp) => {
        dispatch(netActions.successNetworkCall(action.id, resp));
      })
      .catch((err) => {
        dispatch(netActions.errorNetworkCall(action.id, err, 'form'));
      });
    return action;
  };
}

export function deleteGroup(id) {
  return dispatch => {
    const action = netActions.addNetworkCall('delete_group', 'Delete group');
    client.deleteGroup(id)
      .then((resp) => {
        dispatch(netActions.successNetworkCall(action.id, resp));
        dispatch({ type: DELETE_GROUP, id });
      })
      .catch((err) => {
        dispatch(netActions.errorNetworkCall(action.id, err, 'form'));
      });
    return action;
  };
}

export function getGroupUsers(id) {
  const action = netActions.addNetworkCall('group_access', `List group access ${id}`);
  return dispatch => {
    client.getGroupAccess(id)
      .then((resp) => {
        dispatch(netActions.successNetworkCall(action.id, resp));
        dispatch(listUsers(id, resp.data.access.users));
      })
      .catch((err) => {
        dispatch(netActions.errorNetworkCall(action.id, err));
      });
  };
}

export function addToGroup(groupId, userId) {
  return dispatch => {
    const action = netActions.addNetworkCall('add_to_group', 'Add user(s) to group');
    const addPromises = [];
    if (Array.isArray(userId) && userId.length) {
      userId.forEach((id) => {
        addPromises.push(client.addGroupInvitation(groupId, { userId: id, force: true, quiet: false }));
      });
    } else {
      addPromises.push(client.removeUserFromGroup(groupId, { userId, force: true, quiet: false }));
    }
    Promise.all(addPromises)
      .then((resp) => {
        dispatch(netActions.successNetworkCall(action.id, resp));
        dispatch(getGroupUsers(groupId));
      })
      .catch((err) => {
        dispatch(netActions.errorNetworkCall(action.id, err, 'form'));
      });
    return action;
  };
}

export function removeFromGroup(groupId, userId) {
  return dispatch => {
    const action = netActions.addNetworkCall('remove_from_group', 'Remove user(s) from group');
    const removePromises = [];
    if (Array.isArray(userId) && userId.length) {
      userId.forEach((id) => {
        removePromises.push(client.removeUserFromGroup(groupId, id));
      });
    } else {
      removePromises.push(client.removeUserFromGroup(groupId, userId));
    }
    Promise.all(removePromises)
      .then((resp) => {
        dispatch(netActions.successNetworkCall(action.id, resp));
      })
      .catch((err) => {
        dispatch(netActions.errorNetworkCall(action.id, err, 'form'));
      });
    return action;
  };
}
