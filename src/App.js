import React from 'react';
import axios from 'axios';
//=============================================================
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import { CopyToClipboard } from 'react-copy-to-clipboard';
import Navbar from 'react-bootstrap/Navbar';
import Form from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl';
import AddIcon from '@material-ui/icons/Add';
import ListIcon from '@material-ui/icons/List';
import Divider from '@material-ui/core/Divider'
import './App.css';
//=============================================================
import AddToRoadnet from './Screens/AddToRoadnet';
import AddToRI from './Screens/AddToRI'
import AddToGasboy from './Screens/AddToGasboy';
import RemoveFromRI from './Screens/RemoveFromRI';
import GoToDev from './Screens/GoToDev';
//=============================================================
class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      userId: '',
      userOpCo: '',
      copiedUserId: false,
      selectedRouterNumber: 'Selected Router#',
      allOpCo: [
        { num: "001", name: "Jackson" },
        { num: "002", name: "Atlanta" },
        { num: "003", name: "Jacksonville" },
        { num: "004", name: "Central California" },
        { num: "005", name: "Intermountain" },
        { num: "006", name: "Dallas" },
        { num: "007", name: "Virginia" },
        { num: "008", name: "Northern New England" },
        { num: "009", name: "Pittsburgh" },
        { num: "010", name: "Eastern Maryland" },
        { num: "011", name: "Louisville" },
        { num: "012", name: "Baltimore" },
        { num: "013", name: "Central Texas" },
        { num: "014", name: "Memphis" },
        { num: "015", name: "Cleveland" },
        { num: "016", name: "South Florida" },
        { num: "017", name: "Las Vegas" },
        { num: "018", name: "Baraboo" },
        { num: "019", name: "Cincinnati" },
        { num: "022", name: "Central Florida" },
        { num: "023", name: "New Orleans" },
        { num: "024", name: "Chicago" },
        { num: "025", name: "Albany" },
        { num: "026", name: "Oklahoma" },
        { num: "027", name: "Syracuse" },
        { num: "029", name: "Arkansas" },
        { num: "031", name: "Sacramento" },
        { num: "032", name: "Southeast Florida" },
        { num: "035", name: "Eastern Wisconsin" },
        { num: "036", name: "San Diego" },
        { num: "037", name: "West Coast Florida " },
        { num: "038", name: "Indianapolis" },
        { num: "039", name: "Iowa" },
        { num: "040", name: "Idaho" },
        { num: "043", name: "Montana" },
        { num: "045", name: "Los Angeles" },
        { num: "046", name: "Central Alabama" },
        { num: "047", name: "Minnesota" },
        { num: "048", name: "Charlotte" },
        { num: "049", name: "Arizona" },
        { num: "050", name: "San Francisco" },
        { num: "051", name: "Central Pennsylvania" },
        { num: "052", name: "Portland" },
        { num: "054", name: "Connecticut" },
        { num: "055", name: "Seattle" },
        { num: "056", name: "Boston" },
        { num: "057", name: "Kansas City" },
        { num: "058", name: "Detroit" },
        { num: "059", name: "Denver" },
        { num: "060", name: "Nashville" },
        { num: "061", name: "Lincoln" },
        { num: "063", name: "Sygma Pennsylvania" },
        { num: "064", name: "St. Louis" },
        { num: "066", name: "New Mexico" },
        { num: "067", name: "Houston" },
        { num: "068", name: "Grand Rapids" },
        { num: "073", name: "Hampton Roads" },
        { num: "075", name: "Philadelphia" },
        { num: "076", name: "Metro New York" },
        { num: "078", name: "West Texas" },
        { num: "080", name: "Sygma Florida" },
        { num: "089", name: "Sygma San Antonio" },
        { num: "101", name: "Ventura" },
        { num: "102", name: "Spokane " },
        { num: "103", name: "Asian Foods" },
        { num: "137", name: "Columbia" },
        { num: "163", name: "Raleigh" },
        { num: "164", name: "Gulf Coast" },
        { num: "194", name: "Central Illinois" },
        { num: "195", name: "North Dakota" },
        { num: "223", name: "Southern California" },
        { num: "288", name: "Knoxville " },
        { num: "293", name: "East Texas" },
        { num: "306", name: "Long Island" },
        { num: "320", name: "Riverside" },
        { num: "338", name: "South Wetern Ontario" },
        { num: "348", name: "Sygma Fort Worth" },
      ],
      file: [],
      drawer: false,
      page: true,
    };
    this.Home = this.Home.bind(this);
    this.AddToRoadnet = this.AddToRoadnet.bind(this);
    this.AddToRoutingInterface = this.AddToRoutingInterface.bind(this);
    this.RemoveFromRoutingInterface = this.RemoveFromRoutingInterface.bind(this);
    this.RestoreColumns = this.RestoreColumns.bind(this);
    this.AddToGasboy = this.AddToGasboy.bind(this);
    this.GoToDev = this.GoToDev.bind(this);
    //=============================================================
    this.changeSelectedRouterNumber = this.changeSelectedRouterNumber.bind(this);
    this.updateOpCo = this.updateOpCo.bind(this);

  }
//=============================================================
  componentDidMount() {
    this.updateOpCo();
  }
  changeSelectedRouterNumber(e) {
    this.setState({
      selectedRouterNumber: e,
    })
  }
  updateOpCo(){
    axios.get('/getFiles')
    .then(res => {
      let data = res.data.split('\n')
      this.setState({
        file: data
      })
      console.log('OpCo state updated');
    })
  }
//=============================================================
  Home() {
    return (
      <div
        style={{ margin: 20 }}
      >
        <h1>Welcome</h1>
      </div>
    )
  }
  AddToRoadnet() {
    return (
      <AddToRoadnet
        userId={this.state.userId}
        selectedRouterNumber={this.state.selectedRouterNumber}
        changeSelectedRouterNumber={this.changeSelectedRouterNumber}
      />);
  }
  AddToRoutingInterface() {
    return (
      <AddToRI
        userId={this.state.userId}
        allOpCo={this.state.allOpCo}
        updateOpCo={this.updateOpCo}
      />
    )
  }
  RemoveFromRoutingInterface() {
    return (
      <RemoveFromRI
        userId={this.state.userId}
        allOpCo={this.state.allOpCo}
        updateOpCo={this.updateOpCo}
      />
    )
  }
  RestoreColumns() {
    return <h2>Restore Columns Page</h2>
  }
  AddToGasboy() {
    return (
      <AddToGasboy
        userId={this.state.userId}
        allOpCo={this.state.allOpCo}
      />
    )
  }

  GoToDev() {
    return (
      <GoToDev
        userId={this.state.userId}
        allOpCo={this.state.allOpCo}
      />
    )
  }

  render() {
    return (
      <Router>
        <div className="App">
          {/* //============================================================= */}
          <Navbar
            variant="light"
            expand="lg"
            style={{
              color: 'white',
              backgroundColor: "#e9ecef",
              justifyContent: 'space-between',
            }}
          >
            <Navbar.Brand
            >
              <img
                src="https://www.sysco.com/dam/jcr:2ed25439-a58a-41d2-8306-dcf3761c7d95/Sysco-Logo-Color1.png"
                height="60"
                alt="Logo"
              />
              <ListIcon
                style={{
                  marginLeft: 10,
                  height: 50
                }}
                onClick={() => {
                  this.setState({
                    drawer: true,
                    page: false
                  })
                }}
              />
            </Navbar.Brand>
            <Navbar.Brand
              href="/"
            >
              <h3
                style={{
                  color: "blue",
                  alignSelf: 'center'
                }}
              >Sysco Outbound Transportation Support Dashboard
              </h3>
            </Navbar.Brand>
            <Form inline>
              {
                this.state.userId ?
                  null :
                  <h5 style={{ color: "blue", marginRight: 10 }}>Who are you assisting?</h5>
              }
              {this.state.userId.length > 0 ?
                <div
                  style={{ marginRight: 10 }}
                >
                  <h5
                    style={{ color: 'blue' }}
                  >
                    {this.state.userOpCo ? `OpCo: ${this.state.userOpCo.split('-')[0]} ${this.state.allOpCo.filter((item) => item.num === this.state.userOpCo.split('-')[0])[0].name}`
                      : "User not in Routing Interface"}
                  </h5>
                </div>
                : null}
              <FormControl
                type='text'
                placeholder="User ID*"
                onChange={(text) => {
                  this.setState({
                    userId: text.target.value
                  })
                  // console.log(this.state.file)
                  let temp = this.state.file.filter((item) => {
                    return item.includes(text.target.value);
                  })
                  temp.length > 0 ? temp = temp[0].split(' ')[1] : temp = null
                  this.setState({
                    userOpCo: temp
                  })
                }}
              />
              <CopyToClipboard
                text={this.state.userId}
                style={{ marginLeft: 10 }}
              >
                <AddIcon
                  style={{
                    backgroundColor: 'black',
                    color: 'red'
                  }}
                  onClick={() => alert("User copied to clipboard")}
                />
              </CopyToClipboard>
            </Form>
          </Navbar>
          {/* //============================================================= */}
          {this.state.drawer ?
            <nav className="side-drawer"
            >
              <div style={{ margin: 20 }}>
                <ListIcon
                  style={{ alignSelf: 'flex-end' }}
                  onClick={() => {
                    this.setState({
                      drawer: false,
                      page: true
                    })
                  }}
                />
                <h3>Roadnet</h3>
                <ul>
                  <li onClick={() => this.setState({ drawer: false, page: true })}>
                    <Link to="/addToRoadnet">Add User to Roadnet</Link>
                  </li>
                </ul>
                <Divider variant="middle" />
                <h3>Routing Interface</h3>
                <ul>
                  <li onClick={() => this.setState({ drawer: false, page: true })}>
                    <Link to="/addToRoutingInterface">Add User to Roadnet Interface</Link>
                  </li>
                  <li onClick={() => this.setState({ drawer: false, page: true })}>
                    <Link to="/removeFromRoutingInterface">Remove User from Routing Interface</Link>
                  </li>
                  <li>
                    <h6 style={{ color: 'grey' }}>Restore Column Settings</h6>
                  </li>
                </ul>
                <Divider variant="middle" />
                <h3>GasBoy</h3>
                <ul>
                  <li>
                    <h6 style={{ color: 'grey' }}>Add User to Gasboy</h6>
                  </li>
                </ul>
                <Divider variant="middle" />
                <h3>Telogis</h3>
                <Divider variant="middle" />
                <Link to="/goToDev">Dev Screen</Link>
              </div>
            </nav>
            : null}
          {/* //============================================================= */}
          {this.state.page ?
            <div>
              <Route exact path="/" component={this.Home} />
              <Route path="/addToRoadnet" component={this.AddToRoadnet} />
              <Route path="/addToRoutingInterface" component={this.AddToRoutingInterface} />
              <Route path="/removeFromRoutingInterface" component={this.RemoveFromRoutingInterface} />
              <Route path="/restoreColumns" component={this.RestoreColumns} />
              <Route path="/addToGasboy" component={this.AddToGasboy} />
              <Route path="/goToDev" component={this.GoToDev} />
            </div>
            : null}
        </div>
      </Router >
    )
  }
}
export default App;

