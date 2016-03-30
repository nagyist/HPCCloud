import * as Actions from '../actions/fs';

const initialState = {
  folderMapById: {},
  itemMapById: {},
};

const folderInitialState = {
  folder: null,
  folderChildren: [],
  itemChildren: [],
};

export default function fsReducer(state = initialState, action) {
  switch (action.type) {
    case Actions.UPDATE_FOLDER: {
      const { id, folder } = action;
      const newFolderContainer = Object.assign({}, folderInitialState, state.folderMapById[id], { folder });
      const folderMapById = Object.assign({}, state.folderMapById, { [id]: newFolderContainer });
      return Object.assign({}, state, { folderMapById });
    }

    case Actions.CHILDREN_ITEMS: {
      const { id, children } = action;

      const itemMapById = Object.assign({}, state.itemMapById);
      children.forEach(item => {
        itemMapById[item._id] = item;
      });

      const itemChildren = children.map(item => item._id);

      const folderMapById = Object.assign({}, state.folderMapById);
      folderMapById[id] = Object.assign({}, folderInitialState, state.folderMapById[id], { itemChildren });
      return Object.assign({}, state, { itemMapById, folderMapById });
    }

    case Actions.CHILDREN_FOLDERS: {
      const { id, children } = action;
      const folderChildren = children.map(item => item._id);
      const folderMapById = Object.assign({}, state.folderMapById);
      folderMapById[id] = Object.assign({}, folderInitialState, state.folderMapById[id], { folderChildren });
      return Object.assign({}, state, { folderMapById });
    }

    default:
      return state;
  }
}
