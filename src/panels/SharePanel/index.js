import React from 'react';

import * as ProjActions from '../../redux/actions/projects';
import * as AuthActions from '../../redux/actions/user';

import { connect }  from 'react-redux';
import { dispatch } from '../../redux';

import style    from 'HPCCloudStyle/ItemEditor.mcss';

const SharePanel = React.createClass({
  displayName: 'SharePanel',

  propTypes: {
    currentUser: React.PropTypes.object,
    userMap: React.PropTypes.object,
    project: React.PropTypes.object,
    onMount: React.PropTypes.func,
    shareProject: React.PropTypes.func,
  },

  getDefaultProps() {
    return { userMap: {} };
  },

  getInitialState() {
    return { shareUsers: [], unShareUsers: [] };
  },

  componentDidMount() {
    this.props.onMount();
  },

  handleChange(e) {
    const which = e.target.dataset.which;
    const options = e.target.options;
    const values = [];
    for (let i = 0, l = options.length; i < l; i++) {
      if (options[i].selected) {
        values.push(options[i].value);
      }
    }
    this.setState({ [which]: values });
  },

  shareProject(e) {
    console.log('share unimplemented', this.state.shareUsers);
  },

  unShareProject(e) {
    if (this.state.unShareUsers.indexOf(this.props.project.userId) !== -1) {
      console.log('Cannot remove the owner from their own project.');
      return;
    }

    if (this.state.unShareUsers.indexOf(this.props.currentUser._id) !== -1) {
      console.log('You cannot remove yourself from this project');
      return;
    }

    console.log('unshare unimplemented', this.unShareUsers);
  },

  render() {
    const hasUsers = Object.keys(this.props.userMap).length;
    const projectUsers = this.props.project.access.users.reduce((prev, cur) => prev.concat([cur.id]), []);
    return (<div>
        <div className={style.group}>
          <label className={style.label}>User Access</label>
          <select multiple data-which="unShareUsers" className={style.input}
            onChange={this.handleChange} value={this.state.unShareUsers}>
            { projectUsers.map((_id, i) => {
              const name = hasUsers ? this.props.userMap[_id].login : '';
              return <option key={`${_id}_${i}`} value={_id}>{ name }</option>;
            }) }
          </select>
          <button onClick={this.unShareProject}>Remove</button>
        </div>
        <div className={style.group}>
          <label className={style.label}>Share with Users</label>
          <select multiple data-which="shareUsers" className={style.input}
            onChange={this.handleChange} value={this.state.shareUsers}>
            { Object.keys(this.props.userMap).filter((userId) => projectUsers.indexOf(userId) === -1)
              .map((userId, i) => <option key={`${userId}_${i}`} value={userId}>{ hasUsers ? this.props.userMap[userId].login : '' }</option>)
            }
          </select>
          <button onClick={this.shareProject}>Add</button>
        </div>
      </div>);
  },
});


export default connect(
  (state, props) => ({
    currentUser: state.auth.user,
    userMap: state.auth.userMap,
  }),
  () => ({
    onMount: () => dispatch(AuthActions.getUsers()),
    shareProject: (userId) => dispatch(ProjActions.shareProject(userId)),
  })
)(SharePanel);
