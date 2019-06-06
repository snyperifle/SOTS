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
import Home from './Screens/Home'
import AddToRoadnet from './Screens/Roadnet/AddToRoadnet';
import AddToRI from './Screens/RoutingInterface/AddToRI'
import AddToGasboy from './Screens/Gasboy/AddToGasboy';
import RemoveFromRI from './Screens/RoutingInterface/RemoveFromRI';
import RoutesNotFlowing from './Screens/RoutingInterface/RoutesNotFlowing';
import RestoreColumns from './Screens/Roadnet/RestoreColumns';
import TelogisInfo from './Screens/Telogis/TelogisInfo';
import AddNewOpCo from './Screens/Development/AddNewOpCo';
//=============================================================
class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      userId: '',
      userOpCo: null,
      copiedUserId: false,
      selectedRouterNumber: 'Selected Router#',
      allOpCo: [
        { num: "001", name: "Jackson", timezone: "Central Daylight Time" },
        { num: "002", name: "Atlanta", timezone: "Eastern Daylight Time" },
        { num: "003", name: "Jacksonville", timezone: "Eastern Daylight Time" },
        { num: "004", name: "Central California", timezone: "Pacific Daylight Time" },
        { num: "005", name: "Intermountain", timezone: "Mountain Daylight Time" },
        { num: "006", name: "Dallas", timezone: "Central Daylight Time" },
        { num: "007", name: "Virginia", timezone: "Eastern Daylight Time" },
        { num: "008", name: "Northern New England", timezone: "Eastern Daylight Time" },
        { num: "009", name: "Pittsburgh", timezone: "Eastern Daylight Time" },
        { num: "010", name: "Eastern Maryland", timezone: "Eastern Daylight Time" },
        { num: "011", name: "Louisville", timezone: "Eastern Daylight Time" },
        { num: "012", name: "Baltimore", timezone: "Eastern Daylight Time" },
        { num: "013", name: "Central Texas", timezone: "Central Daylight Time" },
        { num: "014", name: "Memphis", timezone: "Central Daylight Time" },
        { num: "015", name: "Cleveland", timezone: "Eastern Daylight Time" },
        { num: "016", name: "South Florida", timezone: "Eastern Daylight Time" },
        { num: "017", name: "Las Vegas", timezone: "Pacific Time Zone" },
        { num: "018", name: "Baraboo", timezone: "Central Daylight Time" },
        { num: "019", name: "Cincinnati", timezone: "Eastern Daylight Time" },
        { num: "022", name: "Central Florida", timezone: "Eastern Daylight Time" },
        { num: "023", name: "New Orleans", timezone: "Central Daylight Time" },
        { num: "024", name: "Chicago", timezone: "Central Daylight Time" },
        { num: "025", name: "Albany", timezone: "Eastern Daylight Time" },
        { num: "026", name: "Oklahoma", timezone: "Central Daylight Time" },
        { num: "027", name: "Syracuse", timezone: "Eastern Daylight Time" },
        { num: "029", name: "Arkansas", timezone: "Central Daylight Time" },
        { num: "031", name: "Sacramento", timezone: "Pacific Daylight Time" },
        { num: "032", name: "Southeast Florida", timezone: "Eastern Daylight Time" },
        { num: "035", name: "Eastern Wisconsin", timezone: "Central Daylight Time" },
        { num: "036", name: "San Diego", timezone: "Pacific Daylight Time" },
        { num: "037", name: "West Coast Florida", timezone: "Eastern Daylight Time" },
        { num: "038", name: "Indianapolis", timezone: "Eastern Daylight Time" },
        { num: "039", name: "Iowa", timezone: "Central Daylight Time" },
        { num: "040", name: "Idaho", timezone: "Mountain Daylight Time" },
        { num: "043", name: "Montana", timezone: "Mountain Daylight Time" },
        { num: "045", name: "Los Angeles", timezone: "Pacific Daylight Time" },
        { num: "046", name: "Central Alabama", timezone: "Central Daylight Time" },
        { num: "047", name: "Minnesota", timezone: "Central Daylight Time" },
        { num: "048", name: "Charlotte", timezone: "Eastern Daylight Time" },
        { num: "049", name: "Arizona", timezone: "Mountain Standard Time" },
        { num: "050", name: "San Francisco", timezone: "Pacific Daylight Time" },
        { num: "051", name: "Central Pennsylvania", timezone: "Eastern Daylight Time" },
        { num: "052", name: "Portland", timezone: "Pacific Daylight Time" },
        { num: "054", name: "Connecticut", timezone: "Eastern Daylight Time" },
        { num: "055", name: "Seattle", timezone: "Pacific Daylight Time" },
        { num: "056", name: "Boston", timezone: "Eastern Daylight Time" },
        { num: "057", name: "Kansas City", timezone: "Central Daylight Time" },
        { num: "058", name: "Detroit", timezone: "Eastern Daylight Time" },
        { num: "059", name: "Denver", timezone: "Mountain Daylight Time" },
        { num: "060", name: "Nashville", timezone: "Central Daylight Time" },
        { num: "061", name: "Lincoln", timezone: "Central Daylight Time" },
        { num: "063", name: "Sygma Pennsylvania", timezone: "Eastern Daylight Time" },
        { num: "064", name: "St. Louis", timezone: "Central Daylight Time" },
        { num: "066", name: "New Mexico", timezone: "Mountain Daylight Time" },
        { num: "067", name: "Houston", timezone: "Central Daylight Time" },
        { num: "068", name: "Grand Rapids", timezone: "Eastern Daylight Time" },
        { num: "073", name: "Hampton Roads", timezone: "Eastern Daylight Time" },
        { num: "075", name: "Philadelphia", timezone: "Eastern Daylight Time" },
        { num: "076", name: "Metro New York", timezone: "Eastern Daylight Time" },
        { num: "078", name: "West Texas", timezone: "Central Daylight Time" },
        { num: "080", name: "Sygma Florida", timezone: "Eastern Daylight Time" },
        { num: "089", name: "Sygma San Antonio", timezone: "Central Daylight Time" },
        { num: "101", name: "Ventura", timezone: "Pacific Daylight Time" },
        { num: "102", name: "Spokane ", timezone: "Pacific Daylight Time" },
        { num: "103", name: "Asian Foods", timezone: "Central Daylight Time" },
        { num: "137", name: "Columbia", timezone: "Eastern Daylight Time" },
        { num: "163", name: "Raleigh", timezone: "Eastern Daylight Time" },
        { num: "164", name: "Gulf Coast", timezone: "Central Daylight Time" },
        { num: "194", name: "Central Illinois", timezone: "Central Standard Time" },
        { num: "195", name: "North Dakota", timezone: "Central Daylight Time" },
        { num: "223", name: "Southern California", timezone: "Pacific Daylight Time" },
        { num: "288", name: "Knoxville ", timezone: "Eastern Daylight Time" },
        { num: "293", name: "East Texas", timezone: "Central Daylight Time" },
        { num: "306", name: "Long Island", timezone: "Eastern Daylight Time" },
        { num: "320", name: "Riverside", timezone: "Pacific Daylight Time" },
        { num: "332", name: "Western Minnesota", timezone: "Central Daylight Time" },
        { num: "338", name: "South Western Ontario", timezone: "Eastern Daylight Time" },
        { num: "348", name: "Sygma Fort Worth", timezone: "Central Daylight Time" },
        { num: "429", name: "Doerle Foods", timezone: "" },
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
    this.RoutesNotFlowing = this.RoutesNotFlowing.bind(this);
    this.AddToGasboy = this.AddToGasboy.bind(this);
    this.TelogisInfo = this.TelogisInfo.bind(this);
    this.AddNewOpCo = this.AddNewOpCo.bind(this);
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
  updateOpCo() {
    axios.get('/getFiles')
      .then(res => {
        let data = res.data.split('\r\n')
        this.setState({
          file: data
        })
        if (this.state.userId.length === 8) {
          let temp = data.filter((item) => {
            return item.includes(this.state.userId);
          })
          temp.length > 0 ? temp = temp[0].split(' ')[1] : temp = null
          this.setState({
            userOpCo: temp
          })
        } else {
          this.setState({
            userOpCo: null
          })
        }
      })
  }
  //=============================================================
  Home() {
    return (
      <Home />
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
        file={this.state.file}
        updateOpCo={this.updateOpCo}

      />
    )
  }
  RemoveFromRoutingInterface() {
    return (
      <RemoveFromRI
        userId={this.state.userId}
        allOpCo={this.state.allOpCo}
        file={this.state.file}
        updateOpCo={this.updateOpCo}
        userOpCo={this.state.userOpCo}
      />
    )
  }
  RestoreColumns() {
    return (
      <RestoreColumns
        userId={this.state.userId}
      />
    )
  }
  RoutesNotFlowing() {
    return (
      <RoutesNotFlowing
        allOpCo={this.state.allOpCo}
        userOpCo={this.state.userOpCo}

      />
    )
  }
  AddToGasboy() {
    return (
      <AddToGasboy
        userId={this.state.userId}
        userOpCo={this.state.userOpCo}
        allOpCo={this.state.allOpCo}
      />
    )
  }
  TelogisInfo() {
    return (
      <TelogisInfo

      />
    )
  }

  AddNewOpCo() {
    return (
      <AddNewOpCo

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
              {this.state.userId.length > 0 ?
                <div
                  style={{ marginRight: 10 }}
                >
                  <h5
                    style={{ color: 'blue' }}
                  >
                    {this.state.userOpCo ?
                      `OpCo: ${this.state.userOpCo.split('-')[0]} ${this.state.allOpCo.filter((item) => item.num === this.state.userOpCo.split('-')[0])[0].name}`
                      : null}
                  </h5>
                  <h5
                    style={{ color: 'blue' }}
                  >
                    {this.state.userOpCo ?
                      `${this.state.allOpCo.filter((item) => item.num === this.state.userOpCo.split('-')[0])[0].timezone}`
                      : null}
                  </h5>
                </div>
                : null}
              <FormControl
                type='text'
                placeholder="Caller User ID*"
                onChange={(text) => {
                  if (text.target.value.length === 8) {
                    this.setState({
                      userId: text.target.value
                    })
                    let temp = this.state.file.filter((item) => {
                      return item.includes(text.target.value);
                    })
                    temp.length > 0 ? temp = temp[0].split(' ')[1] : temp = null
                    this.setState({
                      userOpCo: temp
                    })
                  } else {
                    this.setState({
                      userOpCo: null
                    })
                  }
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
              <div style={{
                margin: 20
              }}>
                <div
                  className="drawer-icon"
                >
                  <div>
                  </div>
                  <ListIcon
                    onClick={() => {
                      this.setState({
                        drawer: false,
                        page: true
                      })
                    }}
                  />
                </div>
                <h3>Roadnet</h3>
                <ul>
                  <li onClick={() => this.setState({ drawer: false, page: true })}>
                    <Link to="/addToRoadnet">Add User to Roadnet</Link>
                  </li>
                  <li onClick={() => this.setState({ drawer: false, page: true })}>
                    <Link to='/restoreColumns'>Restore User Columns</Link>
                    {/* <h6 style={{ color: 'grey' }}>Restore User Columns</h6> */}
                  </li>
                  <li onClick={() => this.setState({ drawer: false, page: true })}>
                    <h6 style={{ color: 'grey' }}>Mirror User Profile</h6>
                  </li>
                  <li onClick={() => this.setState({ drawer: false, page: true })}>
                    <h6 style={{ color: 'grey' }}>Replace RI Config File</h6>
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
                  <li onClick={() => this.setState({ drawer: false, page: true })}>
                    <Link to="/routesNotFlowing">Routes Not Flowing to SUS</Link>
                  </li>
                </ul>
                <Divider variant="middle" />
                <h3>GasBoy</h3>
                <ul>
                  <li onClick={() => this.setState({ drawer: false, page: true })}>
                    <Link to="/addToGasboy">Add to Gasboy</Link>
                  </li>
                </ul>
                <Divider variant="middle" />
                <h3>Telogis</h3>
                <ul>
                  <li onClick={() => this.setState({ drawer: false, page: true })}>
                    <Link to="/telogisInfo">Telogis Information</Link>
                  </li>
                </ul>
                <Divider variant="middle" />
                <h4>DEV</h4>
                <ul>
                  <li onClick={() => this.setState({ drawer: false, page: true })}>
                    <Link to="/addNewOpCo">Add New OpCo</Link>
                  </li>
                </ul>
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
              <Route path="/routesNotFlowing" component={this.RoutesNotFlowing} />
              <Route path="/addToGasboy" component={this.AddToGasboy} />
              <Route path="/telogisInfo" component={this.TelogisInfo} />
              <Route path="/addNewOpCo" component={this.AddNewOpCo} />
            </div>
            : null}
        </div>
      </Router >
    )
  }
}
export default App;

