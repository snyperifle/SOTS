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
      filename: '',
      downloadData2: '',
      filename2: '',
      date: '',
      loading: false,
      loading2: false,
    };
    this.processExport = this.processExport.bind(this);
  }
  //=============================================================
  componentDidMount() {
    let today = new Date();
    this.setState({
      date: `${today.getMonth() + 1}-${today.getDate() + 1}-${today.getFullYear()}`
    })
  }
  processExport(OpCo) {
    if (OpCo === '078') {
      this.setState({
        loading: true,
        downloadData: '',
        filename: ''
      })
    }
    else {
      this.setState({
        loading2: true,
        downloadData2: '',
        filename2: '',
      })
    }

    axios.post('/routingSolution',
      {
        data: { OpCo }
      }
    )
      .then((response) => {
        console.log(response.data);
        if (OpCo === '078') {
          this.setState({
            loading: false,
            downloadData: response.data.CSVstring,
            filename: response.data.filename
          })
        }
        else {
          this.setState({
            loading2: false,
            downloadData2: response.data.CSVstring,
            filename2: response.data.filename
          })
        }

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
            <h2>Routing Solution</h2>
            <h4>*Perform one at a time</h4>
          </Col>
          <Col>
          </Col>
        </Row>
        <Row>
          <Col>
            <h4>OpCo 078</h4>
            <Button
              variant='contained'
              color="primary"
              onClick={() => {
                this.processExport("078");
              }}
            >Process</Button>
            {
              this.state.downloadData.length > 0 ?
                <CSVLink
                  data={this.state.downloadData}
                  filename={this.state.filename}
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
            <h4>OpCo 103</h4>
            <Button
              variant='contained'
              color="primary"
              onClick={() => {
                this.processExport("103");
              }}
            >Process</Button>
            {
              this.state.downloadData2.length > 0 ?
                <CSVLink
                  data={this.state.downloadData2}
                  filename={this.state.filename2}
                  style={{
                    color: 'green',
                    margin: 20
                  }}
                >Download File</CSVLink>
                : null
            }
            {
              this.state.loading2 === true ?
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