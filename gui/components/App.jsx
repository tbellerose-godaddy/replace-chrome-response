const Container = styled.div`
  font-family: Arial, Helvetica, sans-serif;
  font-size: 14px;
  margin: 20px;
  label {
    color: #333;
    font-size: 12px;
    margin-right: 5px;
  }
  input {
    line-height: 20px;
    background-color: #fff;
  }
`;

const Heading = styled.h1`
  color: #000;
`;

const SubHeading = styled.h2`
  color: #000;
`;

const Controls = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 10px 0;
  div:first-child {
    flex-grow: 1;
  }
  input {
    width: 500px;
  }
  button {
    display: flex;
    align-items: center;
    cursor: pointer;
  }
  #new-rule-icon {
    width: 15px;
    height: 15px;
    margin-left: 5px;
  }
`;

const ConfigTable = styled.table`
  border-spacing: 0px 10px;
  width: 100%;
  border: 1px solid #000;
  margin-top: 10px;
`;

const ConfigRow = styled.tr`
  td {
    width: 50%;
    padding: 5px 10px;
  }
  td:first-child {
    padding-right: 0px;
  }
  td:last-child {
    padding-left: 0px;
  }
  td:first-child,
  td:last-child {
    width: 25px;
  }
  td > div {
    display: flex;
    flex-direction: row;
    align-items: center;
  }
  input[type='text'] {
    width: 100%;
  }
  button {
    border: none;
    background-color: transparent;
    cursor: pointer;
  }
  #delete-rule-icon {
    width: 20px;
    height: 20px;
  }
`;

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
      />
    );
  }
}
