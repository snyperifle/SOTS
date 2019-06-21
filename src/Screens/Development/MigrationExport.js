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
    };
    this.processExport = this.processExport.bind(this);
  }
  //=============================================================
  componentDidMount() {
    let today = new Date();
    this.setState({
      date: `${today.getMonth() + 1}-${today.getDate()}-${today.getFullYear()}`
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
        </Row>
      </Container>
    )
  }
}
export default MigrationExport;