import React from 'react';
import axios from 'axios';
import MenuItem from '@material-ui/core/MenuItem'
import Select from '@material-ui/core/Select';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import TextField from '@material-ui/core/TextField';
// import { TextareaAutosize } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import { CSVLink } from "react-csv";
import { Container, Row, Col } from 'react-bootstrap';
import '../../App.css';
//=============================================================
class AddToGasboy extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      gasboyDatabaseStatus: true,
      OpCoData: {
        "029": {
          stationCode: '1050',
          fleetName: 'A050 Arkansas'
        },
        "025": {
          stationCode: '1055',
          fleetName: 'A055 Albany'
        },
        "049": {
          stationCode: '1060',
          fleetName: 'A060 Arizona'
        },
        "002": {
          stationCode: '1065',
          fleetName: 'A065 Atlanta'
        },
        "012": {
          stationCode: '1075',
          fleetName: 'A075 Baltimore'
        },
        "018": {
          stationCode: '1080',
          fleetName: 'A080 Baraboo'
        },
        "056": {
          stationCode: '1085',
          fleetName: 'A085 Boston'
        },
        "046": {
          stationCode: '1090',
          fleetName: 'A090 Central Alabama'
        },
        "004": {
          stationCode: '1095',
          fleetName: 'A095 Central California'
        },
        "022": {
          stationCode: '1100',
          fleetName: 'A100 Central Florida'
        },
        "194": {
          stationCode: '1105',
          fleetName: 'A105 Central Illinois'
        },
        "051": {
          stationCode: '1115',
          fleetName: 'A115 Central Pennsylvania'
        },
        "048": {
          stationCode: '1120',
          fleetName: 'A120 Charlotte'
        },
        "024": {
          stationCode: '1125',
          fleetName: 'A125 Chicago'
        },
        "019": {
          stationCode: '1130',
          fleetName: 'A130 Cincinnati'
        },
        "015": {
          stationCode: '1135',
          fleetName: 'A135 Cleveland'
        },
        "137": {
          stationCode: '1140',
          fleetName: 'A140 Columbia'
        },
        "054": {
          stationCode: '1145',
          fleetName: 'A145 Connecticut'
        },
        "006": {
          stationCode: '1150',
          fleetName: 'A150 Dallas'
        },
        "059": {
          stationCode: '1155',
          fleetName: 'A155 Denver'
        },
        "058": {
          stationCode: '1160',
          fleetName: 'A160 Detroit'
        },
        "293": {
          stationCode: '1165',
          fleetName: 'A165 East Texas'
        },
        "010": {
          stationCode: '1170',
          fleetName: 'A170 Eastern Maryland'
        },
        "035": {
          stationCode: '1175',
          fleetName: 'A175 Eastern Wisconsin'
        },
        "068": {
          stationCode: '1180',
          fleetName: 'A180 Grand Rapids'
        },
        "164": {
          stationCode: '1185',
          fleetName: 'A185 Gulf Coast'
        },
        "073": {
          stationCode: '1190',
          fleetName: 'A190 Hampton Roads'
        },
        "067": {
          stationCode: '1195',
          fleetName: 'A195 Houston'
        },
        "040": {
          stationCode: '1200',
          fleetName: 'A200 Idaho'
        },
        "038": {
          stationCode: '1205',
          fleetName: 'A205 Indianapolis'
        },
        "005": {
          stationCode: '1210',
          fleetName: 'A210 Intermountain'
        },
        "039": {
          stationCode: '1215',
          fleetName: 'A215 Iowa'
        },
        "001": {
          stationCode: '1220',
          fleetName: 'A220 Jackson'
        },
        "003": {
          stationCode: '1225',
          fleetName: 'A225 Jacksonville'
        },
        "057": {
          stationCode: '1230',
          fleetName: 'A230 Kansas City'
        },
        "288": {
          stationCode: '1235',
          fleetName: 'A235 Knoxville'
        },
        "017": {
          stationCode: '1240',
          fleetName: 'A240 Las Vegas'
        },
        "061": {
          stationCode: '1245',
          fleetName: 'A245 Lincoln'
        },
        "045": {
          stationCode: '1250',
          fleetName: 'A250 Los Angeles'
        },
        "011": {
          stationCode: '1255',
          fleetName: 'A255 Louisville'
        },
        "014": {
          stationCode: '1260',
          fleetName: 'A260 Memphis'
        },
        "076": {
          stationCode: '1265',
          fleetName: 'A265 Metro New York'
        },
        "047": {
          stationCode: '1270',
          fleetName: 'A270 Minnesota'
        },
        "043": {
          stationCode: '1275',
          fleetName: 'A275 Montana'
        },
        "060": {
          stationCode: '1280',
          fleetName: 'A280 Nashville'
        },
        "066": {
          stationCode: '1285',
          fleetName: 'A285 New Mexico'
        },
        "023": {
          stationCode: '1290',
          fleetName: 'A290 New Orleans'
        },
        "195": {
          stationCode: '1295',
          fleetName: 'A295 North Dakota'
        },
        "008": {
          stationCode: '1300',
          fleetName: 'A300 Northern New England'
        },
        "026": {
          stationCode: '1305',
          fleetName: 'A305 Oklahoma'
        },
        "075": {
          stationCode: '1310',
          fleetName: 'A310 Philadelphia'
        },
        "009": {
          stationCode: '1315',
          fleetName: 'A315 Pittsburgh'
        },
        "052": {
          stationCode: '1320',
          fleetName: 'A320 Portland'
        },
        "163": {
          stationCode: '1325',
          fleetName: 'A325 Raleigh'
        },
        "031": {
          stationCode: '1330',
          fleetName: 'A330 Sacramento'
        },
        "036": {
          stationCode: '1340',
          fleetName: 'A340 San Diego'
        },
        "050": {
          stationCode: '1345',
          fleetName: 'A345 San Francisco'
        },
        "055": {
          stationCode: '1350',
          fleetName: 'A350 Seattle'
        },
        "016": {
          stationCode: '1355',
          fleetName: 'A355 South Florida'
        },
        "032": {
          stationCode: '1360',
          fleetName: 'A360 Southeast Florida'
        },
        "102": {
          stationCode: '1365',
          fleetName: 'A365 Spokane'
        },
        "064": {
          stationCode: '1370',
          fleetName: 'A370 ST Louis'
        },
        "027": {
          stationCode: '1375',
          fleetName: 'A375 Syracuse'
        },
        "101": {
          stationCode: '1380',
          fleetName: 'A380 Ventura'
        },
        "007": {
          stationCode: '1385',
          fleetName: 'A385 Virginia'
        },
        "037": {
          stationCode: '1390',
          fleetName: 'A390 West Coast Florida'
        },
        "078": {
          stationCode: '1395',
          fleetName: 'A395 West Texas'
        },
        "103": {
          stationCode: '1415',
          fleetName: 'A400 Asian Foods'
        },
        "320": {
          stationCode: '1425',
          fleetName: 'A425 Riverside'
        },
        "306": {
          stationCode: '1415',
          fleetName: 'A415 Long Island'
        },
        "013": {
          stationCode: '1335',
          fleetName: 'A335 Central Texas'
        },
        "338": {
          stationCode: '3125',
          fleetName: 'G125 South Western Ontario'
        },
        "080": {
          stationCode: '2050',
          fleetName: 'D050 Sygma Florida'
        },
        "348": {
          stationCode: '2000',
          fleetName: 'D000 Sygma Fort Worth'
        },
        "223": {
          stationCode: '2095',
          fleetName: 'D095 Sygma Southern California'
        },
        "089": {
          stationCode: '2090',
          fleetName: 'D090 Sygma San Antonio'
        },
        "063": {
          stationCode: '2095',
          fleetName: 'D095 Sygma Southern California'
        },
        "335": {
          stationCode: '335',
          fleetName: '335 Bahamas Food Service'
        },
      },
      deviceType: [
        { type: "Tractor / Trailer" },
        { type: "Driver / Employee" },
      ],
      selectedOpCo: '',
      queryString: '',
      selectedDeviceType: null,
      trailerName: "",
      employeeName: "",
      number: "",
      queue: [],
      excelData: [],
      downloadData: [],
    };
    this.connectoToGBDB = this.connectoToGBDB.bind(this);
    this.generateEquipmentExcelFile = this.generateEquipmentExcelFile.bind(this);
    this.generateEmployeeExcelFile = this.generateEmployeeExcelFile.bind(this);
  }
  componentDidMount() {
    if (this.props.userOpCo) {
      this.setState({
        selectedOpCo: this.state.OpCoData[this.props.userOpCo.substring(0, 3)]
      })
    }
    this.connectoToGBDB();
  }

  connectoToGBDB() {
    axios.get('/connectToGBDB', {})
      .then((response) => {
        if (response.data === 'ELOGIN') {
          this.setState({
            gasboyDatabaseStatus: false
          })
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  generateEquipmentExcelFile() {
    this.setState({
      downloadData: []
    })
    axios.post('/gasboyEquipment', {
      data: {
        selectedOpCoNumber: this.state.selectedOpCo.num,
        queue: this.state.queue,
        opcoData: this.state.OpCoData[String(this.state.selectedOpCo.num)]
      }
    })
      .then((response) => {
        console.log(response.data);
        if (response.data.length === 0) alert('Unit does not exist in Gasboy')
        this.setState({
          downloadData: response.data
        })
      })
      .catch((error) => {
        console.log(error);
      })
  }

  generateEmployeeExcelFile() {
    axios.post('/gasboyUser', {
      data: {
        queue: this.state.queue,
        opcoData: this.state.OpCoData[String(this.state.selectedOpCo.num)]
      }
    })
      .then((response) => {
        console.log(response.data);
        this.setState({
          downloadData: response.data
        })
      })
      .catch((error) => {
        console.log(error);
      })
  }
  //=============================================================
  render() {
    return this.state.gasboyDatabaseStatus === false ?
      <Container className="MainPage">
        <Row>
          <Col>
            <h2 className='title'>Sorry, Gasboy DB is down for maintenance</h2>
            <h5>Please try again later</h5>
          </Col>
        </Row>
      </Container>
      :
      <Container className="MainPage">
        <Row>
          <Col>
            <h2 className="title">Add to Gasboy</h2>
          </Col>
        </Row>
        <Row>
          <Col>
            <form
              autoComplete="off"
              style={{ marginBottom: 5 }}
            >
              <FormControl>
                <InputLabel >Select OpCo</InputLabel>
                <Select
                  style={{ width: 250 }}
                  value={this.state.selectedOpCo || "No Opco Selected"}
                  onChange={(event) => {
                    this.setState({
                      selectedOpCo: event.target.value
                    })
                    // console.log(`Selected OpCo: ${event.target.value.num}`)
                  }}
                >
                  {this.props.allOpCo.map((item, i) => (
                    <MenuItem key={item.num} value={item}>{item.num} - {item.name}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </form>
            {/* //============================================================= */}
            <form
              autoComplete="off"
              style={{ marginBottom: 5 }}
            >
              <FormControl>
                <InputLabel >Select Device Type</InputLabel>
                <Select
                  style={{ width: 250 }}
                  value={this.state.selectedDeviceType || "No Device Type Selected"}
                  onChange={(event) => {
                    this.setState({
                      selectedDeviceType: event.target.value
                    })
                  }}
                >
                  {this.state.deviceType.map((item, i) => (
                    <MenuItem key={item.type} value={item}>{item.type}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </form>
            {/* //============================================================= */}
            {this.state.selectedDeviceType === this.state.deviceType[1] ?
              <form>
                <TextField
                  label="Employee Name"
                  required
                  multiline
                  rows="10"
                  placeholder='ex. Sysco Employee,123456'
                  value={this.state.employeeName}
                  onChange={(event) => {
                    this.setState({ employeeName: event.target.value })
                  }}
                  style={{ marginBottom: 10, width: 500 }}
                />
              </form>
              : null
            }
            {/* //============================================================= */}
            {this.state.selectedDeviceType === this.state.deviceType[0] ?
              <form>
                <TextField
                  label="ID"
                  required
                  multiline
                  rows="10"
                  placeholder='ex. 123456'
                  value={this.state.number}
                  onChange={(event) => {
                    this.setState({ number: event.target.value })
                  }}
                  style={{ marginBottom: 10, width: 500 }}
                />
              </form> : null}
            {/* //============================================================= */}
            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                let temp = this.state.queue;
                if (this.state.selectedDeviceType === this.state.deviceType[1] && this.state.employeeName) {
                  this.state.employeeName.split('\n').forEach((item) => {
                    temp.push(`${item.split(',')[0].trim()},${item.split(',')[1].trim()}`)
                  })
                  this.setState({
                    queue: temp,
                    employeeName: ''
                  })
                  // temp.push(`${this.state.employeeName},${this.state.number}`)
                  // this.setState({
                  //   queue: temp,
                  //   employeeName: '',
                  //   number: '',
                  // })
                } else if (this.state.number) {
                  this.state.number.split('\n').forEach((item) => {
                    temp.push(`${item.trim()}`)
                  })
                  this.setState({
                    queue: temp,
                    number: ''
                  })
                  // temp.push(`${this.state.number}`)
                  // this.setState({
                  //   queue: temp,
                  //   number: '',
                  // })
                }
                else {
                  console.log("Require input")
                }
              }}
            >Add</Button>
            {/* //============================================================= */}
            {this.state.queue.length ?
              <ul>
                {this.state.queue.map((item, i) => (
                  <li key={item[i]}>{item}</li>
                ))}
              </ul>
              : null}
            {/* //============================================================= */}
            {this.state.queue.length ?
              <Button
                variant="contained"
                color="secondary"
                onClick={() => {
                  this.state.selectedDeviceType === this.state.deviceType[0] ?
                    this.generateEquipmentExcelFile() : this.generateEmployeeExcelFile()
                  this.setState({
                    queue: []
                  })
                }}
              >Create Excel file</Button> : null}
            {/* //============================================================= */}
            {this.state.downloadData.length > 0 ?
              <CSVLink
                data={this.state.downloadData}
                filename={'GasboyExport.csv'}
                style={{
                  color: 'green',
                  margin: 20
                }}
              >Download File</CSVLink>
              : null
            }
          </Col>
        </Row>
      </Container>
  }
}
export default AddToGasboy;