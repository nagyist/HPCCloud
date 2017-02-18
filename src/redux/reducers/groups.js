import * as Actions from '../actions/groups';

export const initialState = {
  list: [],
  active: 0,
  pending: false,
  presets: {},
  mapById: {},
  usersByGroup: {},
};

export const groupTemplate = {
  name: '',
  description: '',
  public: true,
};

export default function groupReducer(state = initialState, action) {
  switch (action.type) {
    case GET_GROUPS: {
      const list = action.groups;
      const active = (state.active < list.length) ? state.active : (list.length - 1);
      const mapById = Object.assign({}, state.mapById);
      list.forEach((group) => {
        if (group._id && !mapById[group._id]) {
          mapById[group._id] = group;
        }
      });
      return Object.assign({}, state, { list, active, mapById });
      return initialState;
    }

    case ADD_GROUP: {
      const newGroup = Object.assign({}, groupTemplate);
      newGroup.name = `new group ${state.list.length}`;
      return Object.assign(
        {}, state,
        {
          list: [].concat(state.list, deepClone(groupTemplate)),
          active: state.list.filter(tradFilter).length,
        });
    }

    case SAVE_GROUP: {
      const { index, group } = action;

      const list = [].concat(
        state.list.slice(0, index),
        group,
        state.list.slice(index + 1));
      const active = (state.active < list.length) ? state.active : (list.length - 1);

      if (group._id) {
        const mapById = Object.assign({}, state.mapById, { [group._id]: group });
        return Object.assign({}, state, { list, active, mapById });
      }

      return Object.assign({}, state, { list, active });
    }

    case DELETE_GROUP: {
      const list = state.list.filter((item, idx) => idx !== action.index);
      const group = state.list.filter((item, idx) => idx === action.index)[0];
      const active = (state.active < list.length) ? state.active : (list.length - 1);
      const newState = Object.assign({}, state, { list, active });

      if (state.usersByGroup[group.id]) {
        const usersByGroup = Object.assign({}, state.usersByGroup);
        delete usersByGroup[group.id];
        newState.usersByGroup = usersByGroup;
      }

      if (group && group._id && state.mapById[group._id]) {
        const mapById = Object.assign({}, state.mapById);
        delete mapById[cluster._id];
        return Object.assign(newState, { mapById });
      }
      return newState;
    }

    case Actions.UPDATE_ACTIVE_GROUP: {
      return Object.assign({}, state, { active: action.index });
    }

    case Actions.LIST_USERS: {
      const newUsers = Object.assign({}, state.usersByGroup);
      newUsers[action.groupId] = action.users;
      return Object.assign({}, state, { usersByGroup: newUsers });
    }

    default:
      return state;
  }
}
