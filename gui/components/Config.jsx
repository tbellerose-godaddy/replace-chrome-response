class Config extends React.Component {
  constructor(props) {
    super(props);

    this.handleNewRuleClick = this.handleNewRuleClick.bind(this);
  }

  handleNewRuleClick() {
    this.props.onNewRule();
  }

  handleDeleteRuleClick(index) {
    this.props.onDeleteRule(index);
  }

  handleStartingUrlChange(value) {
    this.props.onStartingUrlChange(value);
  }

  handleEnabledChange(index, checked) {
    this.props.onEnabledChange(index, checked);
  }

  handleMatchChange(index, value) {
    this.props.onMatchChange(index, value);
  }

  handleReplaceChange(index, value) {
    this.props.onReplaceChange(index, value);
  }

  render() {
    const { config } = this.props;
    if (!config) {
      return <div>No configuration specified.</div>;
    }

    return (
      <Container>
        <Heading>Replace Chrome Response</Heading>
        <SubHeading>Settings</SubHeading>
        <Controls>
          <div>
            <label>
              Start URL:
            </label>
            <input defaultValue={config.startingUrl} onChange={(event) => this.handleStartingUrlChange(event.target.value)} />
          </div>
          <div>
            <button onClick={this.handleNewRuleClick}>Add Rule <img id="new-rule-icon" src="https://img.icons8.com/material-outlined/2x/plus.png" /></button>
          </div>
        </Controls>
        <div>
          <ConfigTable>
            <tbody>
              {
                config ?
                  config.rules.map((rule, index) => (
                    <ConfigRow key={index}>
                      <td>
                        <input type="checkbox" checked={rule.enabled} onChange={(event) => this.handleEnabledChange(index, event.target.checked)} />
                      </td>
                      <td>
                        <div>
                          <label>
                        Replace:
                          </label>
                          <input type="text" defaultValue={rule.match} onChange={(event) => this.handleMatchChange(index, event.target.value)} />
                        </div>
                      </td>
                      <td>
                        <div>
                          <label>
                        With:
                          </label>
                          <input type="text" defaultValue={rule.replace} onChange={(event) => this.handleReplaceChange(index, event.target.value)}  />
                        </div>
                      </td>
                      <td>
                        <button onClick={() => this.handleDeleteRuleClick(index)}><img id="delete-rule-icon" src="https://img.icons8.com/metro/2x/trash.png" /></button>
                      </td>
                    </ConfigRow>
                  )) :
                  ''
              }
            </tbody>
          </ConfigTable>
        </div>
      </Container>
    );
  }
}
