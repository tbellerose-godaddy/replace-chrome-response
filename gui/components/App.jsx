
class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { config: props.config };
  }

  handleNewRule() {
    const updatedConfig = this.state.config;
    updatedConfig.rules.push({ match: '', replace: '', enabled: true });
    this.setState({ config: updatedConfig });
    this.props.onConfigChange(updatedConfig);
  }

  handleDeleteRule(index) {
    const updatedConfig = this.state.config;
    updatedConfig.rules.splice(index, 1);
    this.setState({ config: updatedConfig });
    this.props.onConfigChange(updatedConfig);
  }

  handleStartingUrlChange(value) {
    const updatedConfig = this.state.config;
    updatedConfig.startingUrl = value;
    this.props.onConfigChange(updatedConfig);
  }

  handleMatchChange(index, value) {
    const updatedConfig = this.state.config;
    updatedConfig.rules[index].match = value;
    this.setState({ config: updatedConfig });
    this.props.onConfigChange(updatedConfig);
  }

  handleReplaceChange(index, value) {
    const updatedConfig = this.state.config;
    updatedConfig.rules[index].replace = value;
    this.setState({ config: updatedConfig });
    this.props.onConfigChange(updatedConfig);
  }

  handleEnableChanged(index, enabled) {
    const updatedConfig = this.state.config;
    updatedConfig.rules[index].enabled = enabled;
    this.setState({ config: updatedConfig });
    this.props.onConfigChange(updatedConfig);
  }

  handleReload() {
    this.props.onReload();
  }

  handleNavigate(url) {
    this.props.onNavigate(url);
  }

  render() {
    return (
      <Config
        config={this.state.config}
        onNewRule={() => this.handleNewRule()}
        onDeleteRule={(index) => this.handleDeleteRule(index)}
        onStartingUrlChange={(value) => this.handleStartingUrlChange(value)}
        onMatchChange={(index, value) => this.handleMatchChange(index, value)}
        onReplaceChange={(index, value) => this.handleReplaceChange(index, value)}
        onEnabledChange={(index, enabled) => this.handleEnableChanged(index, enabled)}
        onReload={() => this.handleReload()}
        onNavigate={(url) => this.handleNavigate(url)}
      />
    );
  }
}
