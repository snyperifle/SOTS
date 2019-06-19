import React from 'react';
import axios from 'axios';
//=============================================================
import Button from '@material-ui/core/Button';
import { CSVLink } from "react-csv";
import { Container, Row, Col } from 'react-bootstrap';
//=============================================================
class GS1Barcode extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      downloadData: '',
      date: '',
    };
    this.processGS1 = this.processGS1.bind(this);
  }

  componentDidMount() {
    let today = new Date();
    this.setState({
      date: `${today.getMonth() + 1}-${today.getDate()}-${today.getFullYear()}`
    })
  }

  processGS1() {
    this.setState({
      downloadData: '',
    })
    axios.get('/processGS1', {})
      .then((response) => {
        console.log(response.data.CSVstring);
        this.setState({
          downloadData: response.data.CSVstring
        })
      })
      .catch((error) => {
        console.log(error);
      })
  }

  //=============================================================
  render() {
    return (
      <Container>
        <Row>
          <Col>
            <h2>GS1 Barcode</h2>
          </Col>
        </Row>
        <Row>
          <Col>
            <h4>Manually Process?</h4>
            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                this.processGS1();
              }}
            >Process</Button>
            {
              this.state.downloadData.length > 0 ?
                <CSVLink
                  data={this.state.downloadData}
                  filename={`${this.state.date}-GS1Export.csv`}
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
    )
  }
}
export default GS1Barcode;