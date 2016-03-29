import { combineReducers } from 'redux';

import auth     from './auth';
import network  from './network';
import projects  from './projects';
import taskflows  from './taskflows';
import preferences  from './preferences';
import { routerReducer }  from 'react-router-redux';

export default combineReducers({
  auth,
  network,
  preferences,
  projects,
  taskflows,
  routing: routerReducer,
});
