import React from 'react';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import './App.css';
import TextField from '@material-ui/core/TextField';
import AddToRoadnet from './Screens/AddToRoadnet';
import { CopyToClipboard } from 'react-copy-to-clipboard';
class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userId: '',
      copiedUserId: false,
    };
    this.Home = this.Home.bind(this);
    this.AddToRoadnet = this.AddToRoadnet.bind(this);
  }
  Home() {
    return (
      <div>
        <ul>
          <li>
            <Link to="/addToRoadnet">Add new User to Roadnet</Link>
          </li>
          <li>
            <Link to="/deleteFromRoadnet">Remove User from Roadnet</Link>
          </li>
          <li>
            <Link to="/restoreColumns">Restore Column Settings</Link>
          </li>
        </ul>
      </div>
    )
  }
  AddToRoadnet() {
    return <AddToRoadnet userId={this.state.userId} />;
  }
  DeleteFromRoadnet() {
    return <h2>Delete from Roadnet Page</h2>
  }
  RestoreColumns() {
    return <h2>Restore Columns Page</h2>
  }
  render() {
    return (
      <Router>
        <div className="App">
          <h1 to="/">OTS Common Issues</h1>
          {this.state.userId.length > 0 ?
            <div>
              <h2>for {this.state.userId}</h2>
              <CopyToClipboard
                text={this.state.userId}>
                <button>Copy User ID</button>
              </CopyToClipboard>
            </div>
            : null}

          <TextField
            id="User-Id"
            label="User ID"
            value={this.state.userId}
            onChange={(text) => this.setState({ userId: text.target.value })}
          />
          <Link to="/">Home</Link>


          <Route exact path="/" component={this.Home} />
          <Route path="/addToRoadnet" component={this.AddToRoadnet} />
          <Route path="/deleteFromRoadnet" component={this.DeleteFromRoadnet} />
          <Route path="/restoreColumns" component={this.RestoreColumns} />
        </div>
      </Router>
    )
  }
}
export default App;

