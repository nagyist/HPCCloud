import React      from 'react';
import get        from '../../../../utils/get';
import formStyle  from 'HPCCloudStyle/ItemEditor.mcss';

const TYPES = {
  cuda: 'Cuda',
  opencl: 'OpenCL',
  openmp: 'OpenMP',
};

export default React.createClass({

  displayName: 'pyfr-exec/RuntimeBackend',

  propTypes: {
    owner: React.PropTypes.func,
    parentState: React.PropTypes.object,
    /* eslint-disable react/no-unused-prop-types */
    parentProps: React.PropTypes.object,
    /* eslint-emable react/no-unused-prop-types */
  },

  getInitialState() {
    const state = Object.assign({ cuda: 'round-robin', active: '', openmp: '', opencl: '', options: [] }, this.getStateFromProps(this.props));
    return state;
  },

  componentWillReceiveProps(nextProps) {
    this.setState(this.getStateFromProps(nextProps));
  },

  // Automatically update backend when needed
  componentDidUpdate() {
    const active = this.state.active;
    const value = this.state[active];
    if (!active || !this.props.owner() || !this.state) {
      return;
    }

    const backend = { type: active };
    if (active === 'cuda') {
      backend['device-id'] = value;
    } else if (this.state.bakendProfile && this.state.bakendProfile[active]) {
      const addOn = this.state.bakendProfile[active].find((item) => item.name === this.state[active]);
      Object.assign(backend, addOn);
    }

    // Prevent many call if backend is the same
    const lastPush = JSON.stringify(backend);
    if (this.lastPush !== lastPush) {
      this.lastPush = lastPush;
      this.props.owner().setState({ backend });
    }
  },

  getStateFromProps(props) {
    const newState = Object.assign({ bakendProfile: { cuda: false, openmp: [], opencl: [] } }, this.state);
    const previousClusterId = this.state ? this.state.clusterId : '';

    if (props.parentState.serverType === 'Traditional') {
      const clusterId = props.parentState.Traditional.profile;
      const bakendProfile = get(props, `parentProps.clusters.${clusterId}.config.pyfr`);
      if (bakendProfile && previousClusterId !== clusterId) {
        newState.clusterId = clusterId;
        newState.bakendProfile = bakendProfile;

        // Update options
        newState.options = [];
        if (bakendProfile.cuda) {
          newState.active = 'cuda';
          newState.options.push('cuda');
        }
        if (bakendProfile.opencl.length) {
          newState.active = 'opencl';
          newState.options.push('opencl');
          newState.opencl = bakendProfile.opencl[0].name;
        }
        if (bakendProfile.openmp.length) {
          newState.active = 'openmp';
          newState.options.push('openmp');
          newState.openmp = bakendProfile.openmp[0].name;
        }
      }
    }

    return newState;
  },

  updateActiveType(event) {
    const active = event.target.value;
    this.setState({ active });
  },

  updateActiveProfile(event) {
    const active = this.state.active;
    const value = event.target.value;
    this.setState({ [active]: value });
  },


  render() {
    if (this.props.parentState.serverType !== 'Traditional') {
      return null;
    }

    let profiles = [];
    if (this.state.bakendProfile && this.state.bakendProfile[this.state.active] && this.state.active !== 'cuda') {
      profiles = this.state.bakendProfile[this.state.active];
    }

    return (
      <div>
          <section className={formStyle.group}>
              <label className={formStyle.label}>Backend</label>
              <select
                className={formStyle.input}
                value={this.state.active}
                onChange={ this.updateActiveType }
              >
                { this.state.options.map((key, index) =>
                  <option key={ `${key}_${index}` } value={ key }>{ TYPES[key] }</option>
                )}
              </select>
          </section>
          <section className={ this.state.active !== 'cuda' ? formStyle.hidden : formStyle.group }>
            <label className={formStyle.label}>Device</label>
              <select
                className={formStyle.input}
                value={this.state.cuda}
                onChange={ this.updateActiveProfile }
              >
                <option value="round-robin">Round Robin</option>
                <option value="local-rank">Local Rank</option>
              </select>
          </section>
          <section className={ this.state.active === 'cuda' ? formStyle.hidden : formStyle.group }>
            <label className={formStyle.label}>Profile</label>
              <select
                className={formStyle.input}
                value={this.state[this.state.active]}
                onChange={ this.updateActiveProfile }
              >
                { profiles.map((profile, index) =>
                  <option key={ `${profile.name}_${index}` } value={ profile.name }>{ profile.name }</option>
                )}
              </select>
          </section>
      </div>);
  },
});
