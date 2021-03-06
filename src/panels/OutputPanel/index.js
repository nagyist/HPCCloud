import React from 'react';
import style from 'HPCCloudStyle/JobMonitor.mcss';

export default React.createClass({
  displayName: 'OutputPanel',
  propTypes: {
    advanced: React.PropTypes.bool,
    items: React.PropTypes.array,
    title: React.PropTypes.string,
    subtitle: React.PropTypes.string,
  },
  getDefaultProps() {
    return {
      advanced: false,
      items: [],
      title: '',
      subtitle: '',
    };
  },
  getInitialState() {
    return {
      open: !this.props.advanced,
    };
  },
  toggleAdvanced() {
    this.setState({ open: !this.state.open });
  },
  render() {
    var advancedControl = null;
    if (this.props.advanced) {
      advancedControl = (<div className={ style.buttons }>
        <span className={ style.count }>{ this.props.subtitle ? `${this.props.subtitle}(${this.props.items.length})` : null }</span>
        <i
          className={ this.state.open ? style.advancedIconOn : style.advancedIconOff}
          onClick={ this.toggleAdvanced }
         />
      </div>);
    }
    return (
      <div>
        <div className={ style.toolbar }>
          <div className={ style.title }>{this.props.title}</div>
          {advancedControl}
        </div>
        <div className={ this.state.open ? style.taskflowContainer : style.hidden }>
          {this.props.items.map((el, index) => {
            if (!el) {return null;}
            return (<section key={`${el.name}_${index}`} className={ style.listItem }>
                          <strong className={ style.itemContent }>{ el.name }</strong> <span>{ el.value }</span>
                        </section>);
          }) }
        </div>
      </div>
    );
  },
});
