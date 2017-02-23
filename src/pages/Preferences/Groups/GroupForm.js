import React  from 'react';
import style  from 'HPCCloudStyle/ItemEditor.mcss';

export default React.createClass({
  displayName: 'GroupForm',

  propTypes: {
    users: React.PropTypes.object,
    groupUsers: React.PropTypes.array,
    data: React.PropTypes.object,
  },

  getDefaultProps() {
    return { users: {}, data: {}, groupUsers: [] };
  },

  formChange(event) {
    const propName = event.target.dataset.key;
    const value = event.target.value;
    console.log(propName, value);
    // if (this.props.onChange) {
    //   const data = deepClone(this.props.data);
    //   set(data, propName, value);
    //   this.props.onChange(data);
    // }
  },

  render() {
    const groupUsersArray = this.props.groupUsers.map((el) => el.id);
    return (<div>
      <section className={style.group}>
        <label className={style.label}>Name</label>
        <input
          className={style.input}
          type="text"
          value={this.props.data.name}
          data-key="name"
          onChange={this.formChange}
          required
        />
      </section>
      <section className={style.group}>
        <label className={style.label}>Description</label>
        <textarea
          className={ style.input }
          data-name="description"
          rows="5"
          onChange={ this.formChange }
          value={this.props.data.description}
        />
      </section>
      <section className={style.group}>
        <label className={style.label}>Users</label>
        <section className={style.splitView}>
          <div className={style.splitViewItem}>
            <select className={ style.input } multiple>
              { Object.keys(this.props.users).filter((id) => groupUsersArray.indexOf(id) === -1)
                .map((id, ind) => <option
                  key={id} value={id}>
                  { this.props.users[id].login }
                </option>) }
            </select>
            <button className={style.shareButton}>Add</button>
          </div>
          <div className={style.splitViewItem}>
            <select className={ style.input } multiple>
              { this.props.groupUsers.map((el, ind) => <option
                key={`${el._id}_${ind}`} value={el._id}>
                { el.login }
              </option>) }
            </select>
            <button className={style.shareButton}>Remove</button>
          </div>
        </section>
      </section>
    </div>);
  },
});
