import React from 'react';
import axios from 'axios';
//=============================================================
import Button from '@material-ui/core/Button';
import { CSVLink } from 'react-csv';
import { Container, Row, Col } from 'react-bootstrap';
import { PulseLoader } from 'react-spinners';
//=============================================================
class MigrationExport extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      downloadData: '',
      date: '',
      loading: false,
      queryErrors: [],
    };
    this.processExport = this.processExport.bind(this);
    this.superProcess = this.superProcess.bind(this);
    this.retrieveAllStandardRoutes = this.retrieveAllStandardRoutes.bind(this);
    this.retrieveAllLocationTables = this.retrieveAllLocationTables.bind(this);
    this.retrieveAllServiceTimes = this.retrieveAllServiceTimes.bind(this);
  }
  //=============================================================
  componentDidMount() {
    let today = new Date();
    this.setState({
      date: `${today.getMonth() + 1}-${today.getDate() + 1}-${today.getFullYear()}`
    })
  }
  processExport() {
    this.setState({
      loading: true,
      downloadData: '',
    })
    axios.get('/routingSolution', {})
      .then((response) => {
        console.log(response.data);
        this.setState({
          loading: false,
          downloadData: response.data.CSVstring
        })
      })
      .catch((error) => {
        console.log(error);
      });
  }
  superProcess() {
    this.setState({
      loading: true,
      downloadData: '',
      queryErrors: [],
    })
    axios.get('/superRoutingSolution', {})
      .then((response) => {
        this.setState({
          loading: false,
          queryErrors: response.data.queryErrors
        })
      })
      .catch((error) => {
        console.log(error);
      })
  }
  retrieveAllStandardRoutes() {
    this.setState({
      loading: true,
    })
    axios.get('/retrieveAllStandardRoutes', {})
      .then((response) => {
        console.log(response.data);
        this.setState({
          loading: false
        })
      })
      .catch((error) => {
        console.log(error);
      });
  }

  retrieveAllLocationTables() {
    this.setState({
      loading: true,
    })
    axios.get('/retrieveAllLocationTables', {})
      .then((response) => {
        console.log(response.data);
        this.setState({
          loading: false
        })
      })
      .catch((error) => {
        console.log(error);
      });
  }

  retrieveAllServiceTimes() {
    this.setState({
      loading: true,
    })
    axios.get('/retrieveAllServiceTimes', {})
      .then((response) => {
        console.log(response.data);
        this.setState({
          loading: false
        })
      })
      .catch((error) => {
        console.log(error);
      });
  }
  //=============================================================
  render() {
    return (
      <Container>
        <Row>
          <Col>
            <h2>Routing Solution for 078</h2>
          </Col>
        </Row>
        <Row>
          <Col>
            <h4>Manually Process?</h4>
            <Button
              variant='contained'
              color="primary"
              onClick={() => {
                this.processExport();
              }}
            >Process</Button>
            {
              this.state.downloadData.length > 0 ?
                <CSVLink
                  data={this.state.downloadData}
                  filename={`${this.state.date} - 078RoutedSolution.csv`}
                  style={{
                    color: 'green',
                    margin: 20
                  }}
                >Download File</CSVLink>
                : null
            }
            {
              this.state.loading === true ?
                <PulseLoader
                />
                :
                null
            }
          </Col>
          <Col>
            <Button
              variant='contained'
              color="secondary"
              onClick={() => {
                this.superProcess();
              }}
              style={{ margin: 5 }}
            >Retrieve All Routing Solutions</Button>
            <Button
              variant='contained'
              color="secondary"
              onClick={() => {
                this.retrieveAllStandardRoutes();
              }}
              style={{ margin: 5 }}
            >Retrieve All Standard Routes</Button>
            <Button
              variant='contained'
              color="secondary"
              onClick={() => {
                this.retrieveAllLocationTables();
              }}
              style={{ margin: 5 }}
            >Retrieve All Location Tables</Button>
            <Button
              variant='contained'
              color="secondary"
              onClick={() => {
                this.retrieveAllServiceTimes();
              }}
              style={{ margin: 5 }}
            >Retrieve All Service Times</Button>
          </Col>
        </Row>
      </Container>
    )
  }
}
export default MigrationExport;