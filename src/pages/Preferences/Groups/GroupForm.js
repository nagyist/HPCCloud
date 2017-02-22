import React  from 'react';
import style  from 'HPCCloudStyle/ItemEditor.mcss';
import layout from 'HPCCloudStyle/Layout.mcss';

export default React.createClass({
  displayName: 'GroupForm',

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
            </select>
            <button className={style.shareButton}>Add</button>
          </div>
          <div className={style.splitViewItem}>
            <select className={ style.input } multiple>
            </select>
            <button className={style.shareButton}>Remove</button>
          </div>
        </section>
      </section>
    </div>);
  },
});
