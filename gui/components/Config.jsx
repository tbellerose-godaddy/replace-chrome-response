
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
    display: flex;
    align-items: center;
    button {
      margin-left: 10px;
    }
  }
  input {
    width: 520px;
  }
  button {
    display: flex;
    align-items: center;
    cursor: pointer;
    padding: 5px;
  }
  #navigate-icon {
    width: 15px;
    height: 15px;
  }
  #reload-icon {
    width: 15px;
    height: 15px;
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

  handleUrlFocus(event) {
    const input = event.target;
    const value = input.value;
    let startRange = 0;
    if (value.startsWith('https://')) {
      startRange = 8;
    } else if (value.startsWith('http://')) {
      startRange = 7;
    }

    input.setSelectionRange(startRange, value.length);
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

  handleReload() {
    this.props.onReload();
  }

  handleNavigate() {
    this.props.onNavigate(this.props.config.startingUrl);
  }

  render() {
    const { config } = this.props;
    if (!config) {
      return <div>No configuration specified.</div>;
    }

    return (
      <Container>
        <Heading>Replace Chrome Response</Heading>
        <Controls>
          <div>
            <label>
              URL:
            </label>
            <input defaultValue={config.startingUrl} onFocus={(event) => this.handleUrlFocus(event)} onChange={(event) => this.handleStartingUrlChange(event.target.value)} />
            <div>
              <button onClick={() => this.handleNavigate()}><img id="navigate-icon" src="/images/navigate.png" /></button>
            </div>
            <div>
              <button onClick={() => this.handleReload()}><img id="reload-icon" src="/images/reload.png" /></button>
            </div>
          </div>
          <div>
            <button onClick={this.handleNewRuleClick}>Add Rule <img id="new-rule-icon" src="/images/add-rule.png" /></button>
          </div>
        </Controls>
        <SubHeading>Rules</SubHeading>
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
