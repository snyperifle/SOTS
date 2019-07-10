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
import { Container, Row, Col } from 'react-bootstrap';
import { css } from '@emotion/core';
import { ClipLoader } from 'react-spinners';
//=============================================================
import Home from './Screens/Home'

import AddToRoadnet from './Screens/Roadnet/AddToRoadnet';
import RestoreColumns from './Screens/Roadnet/RestoreColumns';
import MirrorProfile from './Screens/Roadnet/MirrorProfile';

import AddToRI from './Screens/RoutingInterface/AddToRI'
import RemoveFromRI from './Screens/RoutingInterface/RemoveFromRI';
import ReplaceRIConfig from './Screens/RoutingInterface/ReplaceRIConfig';
import RoutesNotFlowing from './Screens/RoutingInterface/RoutesNotFlowing';

import AddToGasboy from './Screens/Gasboy/AddToGasboy';

import TelogisInfo from './Screens/Telogis/TelogisInfo';
import RoutesToTelogis from './Screens/Telogis/RoutesToTelogis';

import GS1Barcode from './Screens/GS1/GS1Barcode';

import MigrationExport from './Screens/Development/MigrationExport';
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
        { num: "001", name: "Jackson", OpCoName: 'SYSCO JACKSON, LLC', timezone: "Central Daylight Time" },
        { num: "002", name: "Atlanta", OpCoName: 'SYSCO ATLANTA, LLC', timezone: "Eastern Daylight Time" },
        { num: "003", name: "Jacksonville", OpCoName: 'SYSCO JACKSONVILLE, INC', timezone: "Eastern Daylight Time" },
        { num: "004", name: "Central California", OpCoName: 'SYSCO CENTRAL CALIFORNIA, INC', timezone: "Pacific Daylight Time" },
        { num: "005", name: "Intermountain", OpCoName: 'SYSCO INTERMOUNTAIN, INC.', timezone: "Mountain Daylight Time" },
        { num: "006", name: "Dallas", OpCoName: 'SYSCO NORTH TEXAS INC', timezone: "Central Daylight Time" },
        { num: "007", name: "Virginia", OpCoName: 'SYSCO VIRGINIA, LLC', timezone: "Eastern Daylight Time" },
        { num: "008", name: "Northern New England", OpCoName: 'SYSCO NORTHERN NEW ENGLAND INC', timezone: "Eastern Daylight Time" },
        { num: "009", name: "Pittsburgh", OpCoName: 'SYSCO PITTSBURGH, LLC', timezone: "Eastern Daylight Time" },
        { num: "010", name: "Eastern Maryland", OpCoName: 'SYSCO EASTERN MARYLAND, LLC', timezone: "Eastern Daylight Time" },
        { num: "011", name: "Louisville", OpCoName: 'SYSCO LOUISVILLE, INC', timezone: "Eastern Daylight Time" },
        { num: "012", name: "Baltimore", OpCoName: 'SYSCO BALTIMORE, LLC', timezone: "Eastern Daylight Time" },
        { num: "013", name: "Central Texas", OpCoName: 'SYSCO CENTRAL TEXAS, INC.', timezone: "Central Daylight Time" },
        { num: "014", name: "Memphis", OpCoName: 'SYSCO MEMPHIS, LLC', timezone: "Central Daylight Time" },
        { num: "015", name: "Cleveland", OpCoName: 'SYSCO CLEVELAND, INC', timezone: "Eastern Daylight Time" },
        { num: "016", name: "South Florida", OpCoName: 'SYSCO SOUTH FLORIDA, INC', timezone: "Eastern Daylight Time" },
        { num: "017", name: "Las Vegas", OpCoName: 'SYSCO LAS VEGAS, INC', timezone: "Pacific Time Zone" },
        { num: "018", name: "Baraboo", OpCoName: 'SYSCO BARABOO, LLC', timezone: "Central Daylight Time" },
        { num: "019", name: "Cincinnati", OpCoName: 'SYSCO CINCINNATI, LLC', timezone: "Eastern Daylight Time" },
        { num: "022", name: "Central Florida", OpCoName: 'SYSCO CENTRAL FLORIDA, INC', timezone: "Eastern Daylight Time" },
        { num: "023", name: "New Orleans", OpCoName: 'SYSCO NEW ORLEANS, LLC', timezone: "Central Daylight Time" },
        { num: "024", name: "Chicago", OpCoName: 'SYSCO CHICAGO, INC', timezone: "Central Daylight Time" },
        { num: "025", name: "Albany", OpCoName: 'SYSCO ALBANY, LLC', timezone: "Eastern Daylight Time" },
        { num: "026", name: "Oklahoma", OpCoName: 'SYSCO OKLAHOMA, LLC', timezone: "Central Daylight Time" },
        { num: "027", name: "Syracuse", OpCoName: 'SYSCO SYRACUSE, LLC', timezone: "Eastern Daylight Time" },
        { num: "029", name: "Arkansas", OpCoName: 'SYSCO ARKANSAS, LLC', timezone: "Central Daylight Time" },
        { num: "031", name: "Sacramento", OpCoName: 'SYSCO SACRAMENTO, INC', timezone: "Pacific Daylight Time" },
        { num: "032", name: "Southeast Florida", OpCoName: 'SYSCO SOUTHEAST FLORIDA, LLC', timezone: "Eastern Daylight Time" },
        { num: "035", name: "Eastern Wisconsin", OpCoName: 'SYSCO EASTERN WISCONSIN, LLC', timezone: "Central Daylight Time" },
        { num: "036", name: "San Diego", OpCoName: 'SYSCO SAN DIEGO, INC', timezone: "Pacific Daylight Time" },
        { num: "037", name: "West Coast Florida", OpCoName: 'SYSCO WEST COAST FLORIDA, INC', timezone: "Eastern Daylight Time" },
        { num: "038", name: "Indianapolis", OpCoName: 'SYSCO INDIANAPOLIS, LLC', timezone: "Eastern Daylight Time" },
        { num: "039", name: "Iowa", OpCoName: 'SYSCO IOWA, INC', timezone: "Central Daylight Time" },
        { num: "040", name: "Idaho", OpCoName: 'SYSCO IDAHO, INC', timezone: "Mountain Daylight Time" },
        { num: "043", name: "Montana", OpCoName: 'SYSCO MONTANA, INC', timezone: "Mountain Daylight Time" },
        { num: "045", name: "Los Angeles", OpCoName: 'SYSCO LOS ANGELES, INC', timezone: "Pacific Daylight Time" },
        { num: "046", name: "Central Alabama", OpCoName: 'SYSCO CENTRAL ALABAMA, INC', timezone: "Central Daylight Time" },
        { num: "047", name: "Minnesota", OpCoName: 'SYSCO MINNESOTA, INC', timezone: "Central Daylight Time" },
        { num: "048", name: "Charlotte", OpCoName: 'SYSCO CHARLOTTE, LLC', timezone: "Eastern Daylight Time" },
        { num: "049", name: "Arizona", OpCoName: 'SYSCO ARIZONA, INC', timezone: "Mountain Standard Time" },
        { num: "050", name: "San Francisco", OpCoName: 'SYSCO SAN FRANCISCO, INC', timezone: "Pacific Daylight Time" },
        { num: "051", name: "Central Pennsylvania", OpCoName: 'SYSCO CENTRAL PENNSYLVANIA LLC', timezone: "Eastern Daylight Time" },
        { num: "052", name: "Portland", OpCoName: 'SYSCO PORTLAND, INC', timezone: "Pacific Daylight Time" },
        { num: "054", name: "Connecticut", OpCoName: 'SYSCO CONNECTICUT, LLC', timezone: "Eastern Daylight Time" },
        { num: "055", name: "Seattle", OpCoName: 'SYSCO SEATTLE, INC', timezone: "Pacific Daylight Time" },
        { num: "056", name: "Boston", OpCoName: 'SYSCO BOSTON, LLC', timezone: "Eastern Daylight Time" },
        { num: "057", name: "Kansas City", OpCoName: 'SYSCO KANSAS CITY, INC.', timezone: "Central Daylight Time" },
        { num: "058", name: "Detroit", OpCoName: 'SYSCO DETROIT, LLC', timezone: "Eastern Daylight Time" },
        { num: "059", name: "Denver", OpCoName: 'SYSCO DENVER, INC', timezone: "Mountain Daylight Time" },
        { num: "060", name: "Nashville", OpCoName: 'SYSCO NASHVILLE, INC', timezone: "Central Daylight Time" },
        { num: "061", name: "Lincoln", OpCoName: 'SYSCO LINCOLN, INC', timezone: "Central Daylight Time" },
        { num: "063", name: "Sygma Pennsylvania", OpCoName: 'SYGMA PENNSYLVANIA', timezone: "Eastern Daylight Time" },
        { num: "064", name: "St. Louis", OpCoName: 'SYSCO ST LOUIS, LLC', timezone: "Central Daylight Time" },
        { num: "066", name: "New Mexico", OpCoName: 'SYSCO NEW MEXICO, LLC', timezone: "Mountain Daylight Time" },
        { num: "067", name: "Houston", OpCoName: 'SYSCO HOUSTON, INC', timezone: "Central Daylight Time" },
        { num: "068", name: "Grand Rapids", OpCoName: 'SYSCO GRAND RAPIDS, LLC', timezone: "Eastern Daylight Time" },
        { num: "073", name: "Hampton Roads", OpCoName: 'SYSCO HAMPTON ROADS, INC', timezone: "Eastern Daylight Time" },
        { num: "075", name: "Philadelphia", OpCoName: 'SYSCO PHILADELPHIA, LLC', timezone: "Eastern Daylight Time" },
        { num: "076", name: "Metro New York", OpCoName: 'SYSCO METRO NEW YORK, LLC', timezone: "Eastern Daylight Time" },
        { num: "078", name: "West Texas", OpCoName: 'SYSCO WEST TEXAS, INC', timezone: "Central Daylight Time" },
        { num: "080", name: "Sygma Florida", OpCoName: 'SYGMA FLORIDA', timezone: "Eastern Daylight Time" },
        { num: "089", name: "Sygma San Antonio", OpCoName: 'SYGMA SAN ANTONIO', timezone: "Central Daylight Time" },
        { num: "101", name: "Ventura", OpCoName: 'SYSCO VENTURA, INC', timezone: "Pacific Daylight Time" },
        { num: "102", name: "Spokane ", OpCoName: 'SYSCO SPOKANE, INC', timezone: "Pacific Daylight Time" },
        { num: "103", name: "Asian Foods", OpCoName: 'ASIAN FOODS', timezone: "Central Daylight Time" },
        { num: "137", name: "Columbia", OpCoName: 'SYSCO COLUMBIA, LLC', timezone: "Eastern Daylight Time" },
        { num: "163", name: "Raleigh", OpCoName: 'SYSCO RALEIGH, LLC', timezone: "Eastern Daylight Time" },
        { num: "164", name: "Gulf Coast", OpCoName: 'SYSCO GULF COAST, INC', timezone: "Central Daylight Time" },
        { num: "194", name: "Central Illinois", OpCoName: 'SYSCO CENTRAL ILLINOIS, INC', timezone: "Central Standard Time" },
        { num: "195", name: "North Dakota", OpCoName: 'SYSCO NORTH DAKOTA, INC', timezone: "Central Daylight Time" },
        { num: "223", name: "Southern California", OpCoName: '', timezone: "Pacific Daylight Time" },
        { num: "288", name: "Knoxville ", OpCoName: 'SYSCO KNOXVILLE, LLC', timezone: "Eastern Daylight Time" },
        { num: "293", name: "East Texas", OpCoName: 'SYSCO EAST TEXAS, LLC', timezone: "Central Daylight Time" },
        { num: "306", name: "Long Island", OpCoName: 'SYSCO LONG ISLAND, LLC', timezone: "Eastern Daylight Time" },
        { num: "320", name: "Riverside", OpCoName: '', timezone: "Pacific Daylight Time" },
        { num: "332", name: "Western Minnesota", OpCoName: 'SYSCO WESTERN MINNESOTA', timezone: "Central Daylight Time" },
        { num: "335", name: "Bahamas Food Services", OpCoName: 'BAHAMAS FOOD SERVICES', timezone: "Eastern Daylight Time" },
        { num: "338", name: "South Western Ontario", OpCoName: 'SOUTH WESTERN ONTARIO', timezone: "Eastern Daylight Time" },
        { num: "348", name: "Sygma Fort Worth", OpCoName: 'SYGMA FORT WORTH', timezone: "Central Daylight Time" },
        { num: "429", name: "Doerle Foods", OpCoName: 'DOERLE FOODS', timezone: "Central Daylight Time" },
      ],
      file: [],
      drawer: false,
      page: true,
      date: '',
      loading: true,
    };
    this.Home = this.Home.bind(this);
    this.AddToRoadnet = this.AddToRoadnet.bind(this);
    this.RestoreColumns = this.RestoreColumns.bind(this);
    this.MirrorProfile = this.MirrorProfile.bind(this);
    this.AddToRoutingInterface = this.AddToRoutingInterface.bind(this);
    this.RemoveFromRoutingInterface = this.RemoveFromRoutingInterface.bind(this);
    this.ReplaceRIConfig = this.ReplaceRIConfig.bind(this);
    this.RoutesNotFlowing = this.RoutesNotFlowing.bind(this);
    this.AddToGasboy = this.AddToGasboy.bind(this);
    this.TelogisInfo = this.TelogisInfo.bind(this);
    this.RoutesToTelogis = this.RoutesToTelogis.bind(this);
    this.GS1Barcode = this.GS1Barcode.bind(this);
    //=============================================================
    this.changeSelectedRouterNumber = this.changeSelectedRouterNumber.bind(this);
    this.updateOpCo = this.updateOpCo.bind(this);
    this.getDate = this.getDate.bind(this);
  }
  //=============================================================
  componentDidMount() {
    this.updateOpCo();
    // console.log(window.location.hostname);
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
  getDate() {
  }
  //=============================================================
  Home() {
    return (
      <Home />
    )
  }
  //=============================================================
  AddToRoadnet() {
    return (
      <AddToRoadnet
        userId={this.state.userId}
        selectedRouterNumber={this.state.selectedRouterNumber}
        changeSelectedRouterNumber={this.changeSelectedRouterNumber}
      />);
  }
  RestoreColumns() {
    return (
      <RestoreColumns
        userId={this.state.userId}
      />
    )
  }
  MirrorProfile() {
    return (
      <MirrorProfile
        userId={this.state.userId}
        userOpCo={this.state.userOpCo}
        file={this.state.file}
      />
    )
  }
  //=============================================================
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
  ReplaceRIConfig() {
    return (
      <ReplaceRIConfig
        userId={this.state.userId}
        userOpCo={this.state.userOpCo}
        allOpCo={this.state.allOpCo}
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
  //=============================================================
  AddToGasboy() {
    return (
      <AddToGasboy
        userId={this.state.userId}
        userOpCo={this.state.userOpCo}
        allOpCo={this.state.allOpCo}
      />
    )
  }
  //=============================================================
  TelogisInfo() {
    return (
      <TelogisInfo

      />
    )
  }
  //=============================================================
  RoutesToTelogis() {
    return (
      <RoutesToTelogis
        userOpCo={this.state.userOpCo}
        allOpCo={this.state.allOpCo}
      />
    )
  }
  //=============================================================
  GS1Barcode() {
    return (
      <GS1Barcode

      />
    )
  }
  //=============================================================
  MigrationExport() {
    return (
      <MigrationExport

      />
    )
  }
  //=============================================================
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
                  color: "#2F8FD9",
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
                    style={{ color: '#2F8FD9' }}
                  >
                    {this.state.userOpCo ?
                      `OpCo: ${this.state.userOpCo.split('-')[0]} ${this.state.allOpCo.filter((item) => item.num === this.state.userOpCo.split('-')[0])[0].name}`
                      : null}
                  </h5>
                  <h5
                    style={{ color: '#2F8FD9' }}
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
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}
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
                <h5>Roadnet</h5>
                <ul>
                  <li onClick={() => this.setState({ drawer: false, page: true })}>
                    <Link to="/addToRoadnet">Add User to Roadnet</Link>
                  </li>
                  <li onClick={() => this.setState({ drawer: false, page: true })}>
                    <Link to='/restoreColumns'>Restore User Columns</Link>
                    {/* <h6 style={{ color: 'grey' }}>Restore User Columns</h6> */}
                  </li>
                  <li onClick={() => this.setState({ drawer: false, page: true })}>
                    {/* <h6 style={{ color: 'grey' }}>Mirror User Profile</h6> */}
                    <Link to='/mirrorProfile'>Mirror User Profile</Link>
                  </li>
                </ul>
                <Divider variant="middle" />
                <h5>Routing Interface</h5>
                <ul>
                  <li onClick={() => this.setState({ drawer: false, page: true })}>
                    <Link to="/addToRoutingInterface">Add User to Roadnet Interface</Link>
                  </li>
                  <li onClick={() => this.setState({ drawer: false, page: true })}>
                    <Link to="/removeFromRoutingInterface">Remove User from Routing Interface</Link>
                  </li>
                  <li onClick={() => this.setState({ drawer: false, page: true })}>
                    <Link to="/replaceRIConfig">Replace RI Config File</Link>
                    {/* <h6 style={{ color: 'grey' }}>Replace RI Config File</h6> */}
                  </li>
                  <li onClick={() => this.setState({ drawer: false, page: true })}>
                    <Link to="/routesNotFlowing">Routes Not Flowing to SUS</Link>
                  </li>
                </ul>
                <Divider variant="middle" />
                <h5>GasBoy</h5>
                <ul>
                  <li onClick={() => this.setState({ drawer: false, page: true })}>
                    <Link to="/addToGasboy">Add to Gasboy</Link>
                  </li>
                </ul>
                <Divider variant="middle" />
                <h5>Telogis</h5>
                <ul>
                  <li onClick={() => this.setState({ drawer: false, page: true })}>
                    <Link to="/telogisInfo">Telogis Information</Link>
                  </li>
                  <li onClick={() => { this.setState({ drawer: false, page: true }) }}>
                    <Link to="/routesToTelogis">Routes not Flowing to Telogis</Link>
                  </li>
                </ul>
                <Divider variant="middle" />
                <h5>GS1 Barcode</h5>
                <ul>
                  <li onClick={() => this.setState({ drawer: false, page: true })}>
                    <Link to="/gs1Barcode">GS1 Report</Link>
                  </li>
                </ul>
                <Divider variant="middle" />
                <h5>Development</h5>
                <ul>
                  <li onClick={() => this.setState({ drawer: false, page: true })}>
                    <Link to="/migrationExport">Routing Solution</Link>
                  </li>
                </ul>
              </div>
            </nav>
            : null}
          {/* //============================================================= */}
          {this.state.page === true ?
            <div
              style={{ margin: 20 }}
            >
              <Route exact path="/" component={this.Home} />
              <Route path="/addToRoadnet" component={this.AddToRoadnet} />
              <Route path="/restoreColumns" component={this.RestoreColumns} />
              <Route path="/mirrorProfile" component={this.MirrorProfile} />
              <Route path="/addToRoutingInterface" component={this.AddToRoutingInterface} />
              <Route path="/removeFromRoutingInterface" component={this.RemoveFromRoutingInterface} />
              <Route path="/replaceRIConfig" component={this.ReplaceRIConfig} />
              <Route path="/routesNotFlowing" component={this.RoutesNotFlowing} />
              <Route path="/addToGasboy" component={this.AddToGasboy} />
              <Route path="/telogisInfo" component={this.TelogisInfo} />
              <Route path="/routesToTelogis" component={this.RoutesToTelogis} />
              <Route path="/gs1Barcode" component={this.GS1Barcode} />
              <Route path="/migrationExport" component={this.MigrationExport} />
            </div>
            :
            <Container>
              <Row style={{ margin: 150 }}>
                <Col
                  style={{
                    textAlign: 'center'
                  }}
                >
                  <ClipLoader
                    css={
                      css`display:block; margin:0 auto; border-color:black;`
                    }
                    size={100}
                    sizeUnit={"px"}
                    color={'blue'}
                    loading={this.state.loading}
                  />
                </Col>
              </Row>
            </Container>
          }
        </div>
      </Router >
    )
  }
}
export default App;

