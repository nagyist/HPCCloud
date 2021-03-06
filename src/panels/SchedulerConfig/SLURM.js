import React from 'react';
import style from 'HPCCloudStyle/ItemEditor.mcss';

export default React.createClass({

  displayName: 'SchedulerConfig/SLURM',

  propTypes: {
    config: React.PropTypes.object,
    max: React.PropTypes.object,
    onChange: React.PropTypes.func,
    runtime: React.PropTypes.bool,
  },

  updateConfig(event) {
    if (this.props.onChange) {
      this.props.onChange(event);
    }
  },

  render() {
    return (
      <div>
        <section className={style.group}>
          <label className={style.label}>Number of nodes</label>
          <input
            className={style.input}
            type="number"
            min="1"
            max={ this.props.runtime && this.props.max && this.props.max.slurm ? this.props.max.slurm.numberOfNodes : null }
            value={this.props.config.slurm.numberOfNodes}
            data-key="slurm.numberOfNodes"
            onChange={this.updateConfig}
          />
        </section>
        <section className={style.group}>
          <label className={style.label}>Cores/Node</label>
          <input
            className={style.input}
            type="number"
            min="1"
            max={ this.props.runtime && this.props.max && this.props.max.slurm ? this.props.max.slurm.numberOfCoresPerNode : null }
            value={this.props.config.slurm.numberOfCoresPerNode}
            data-key="slurm.numberOfCoresPerNode"
            onChange={this.updateConfig}
          />
        </section>
        <section className={style.group}>
          <label className={style.label}>GPUs/Node</label>
          <input
            className={style.input}
            type="number"
            min="0"
            max={ this.props.runtime && this.props.max && this.props.max.slurm ? this.props.max.slurm.numberOfGpusPerNode : null }
            value={this.props.config.slurm.numberOfGpusPerNode}
            data-key="slurm.numberOfGpusPerNode"
            onChange={this.updateConfig}
          />
        </section>
      </div>);
  },
});
