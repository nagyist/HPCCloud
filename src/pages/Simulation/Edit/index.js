import ItemEditor from '../../../panels/ItemEditor';
import React      from 'react';
import Workflows  from '../../../workflows';

import breadCrumbStyle  from 'HPCCloudStyle/Theme.mcss';
import getNetworkError  from '../../../utils/getNetworkError';

import { connect }  from 'react-redux';
import { dispatch } from '../../../redux';
import * as Actions from '../../../redux/actions/projects';
import * as Router  from '../../../redux/actions/router';

/* eslint-disable no-alert */
const SimulationEdit = React.createClass({

  displayName: 'Simulation/Edit',

  propTypes: {
    error: React.PropTypes.string,
    project: React.PropTypes.object,
    simulation: React.PropTypes.object,

    onSave: React.PropTypes.func,
    onDelete: React.PropTypes.func,
    onCancel: React.PropTypes.func,
  },

  onAction(action, data, attachment) {
    this[action](data, attachment);
  },

  editSimulation(data, attachment) {
    this.props.onSave(Object.assign({}, this.props.simulation, data));
  },

  cancel() {
    this.props.onCancel(`/View/Project/${this.props.simulation.projectId}`);
  },

  delete() {
    if (!confirm('Are you sure you want to delete this simulation?')) {
      return;
    }
    this.props.onDelete(this.props.simulation, `/View/Project/${this.props.simulation.projectId}`);
  },

  render() {
    if (!this.props.simulation || !this.props.project) {
      return null;
    }

    const { simulation, project, error } = this.props;
    const projectId = simulation.projectId;
    const childComponent = project.type ? Workflows[project.type].components.EditSimulation : null;
    const workflowAddOn = childComponent ? React.createElement(childComponent, { owner: () => this.container,
      parentProps: this.props }) : null;

    return (
      <ItemEditor
        breadcrumb={{
          paths: ['/', `/View/Project/${projectId}`, `/View/Simulation/${simulation._id}`],
          icons: [
            breadCrumbStyle.breadCrumbRootIcon,
            breadCrumbStyle.breadCrumbProjectIcon,
            breadCrumbStyle.breadCrumbSimulationIcon,
          ],
        }}
        name={simulation.name}
        description={simulation.description}
        error={error}
        ref={(c) => {this.container = c;}}
        title="Edit Simulation"
        actions={[
          { name: 'cancel', label: 'Cancel' },
          { name: 'delete', label: 'Delete simulation', disabled: this.props.simulation.metadata.status === 'running' },
          { name: 'editSimulation', label: 'Save simulation' }]}
        onAction={ this.onAction }
      >
      { workflowAddOn }
      </ItemEditor>);
  },
});

// Binding --------------------------------------------------------------------
/* eslint-disable arrow-body-style */

export default connect(
  (state, props) => {
    const project = state.projects.mapById[state.projects.active];
    const simulations = state.projects.simulations[state.projects.active];
    const simulation = state.simulations.mapById[simulations.active];
    return {
      error: getNetworkError(state, ['save_simulation', `delete_simulation_${props.params.id}`]),
      project,
      simulation,
    };
  },
  () => {
    return {
      onSave: (simulation) => dispatch(Actions.saveSimulation(simulation, null, `/View/Project/${simulation.projectId}`)),
      onDelete: (simulation, location) => dispatch(Actions.deleteSimulation(simulation, location)),
      onCancel: (path) => dispatch(Router.goBack()),
    };
  }
)(SimulationEdit);
