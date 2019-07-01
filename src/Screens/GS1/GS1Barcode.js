import React from 'react';
import axios from 'axios';
//=============================================================
import Button from '@material-ui/core/Button';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { CSVLink } from "react-csv";
import { Container, Row, Col } from 'react-bootstrap';
//=============================================================
class GS1Barcode extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      downloadData: '',
      date: '',
      pickerDate: new Date(),
    };
    this.processGS1 = this.processGS1.bind(this);
    this.changeDate = this.changeDate.bind(this);
  }

  componentDidMount() {
    let date = new Date();
    let today = `${(date.getFullYear())}-${('0' + (date.getMonth() + 1)).slice(-2)}-${('0' + date.getDate()).slice(-2)}`;
    this.setState({
      date: today
    })
  }

  changeDate(date) {
    let year = date.getFullYear();
    let month = ('0' + (date.getMonth() + 1)).slice(-2);
    let day = ('0' + date.getDate()).slice(-2);
    this.setState({
      pickerDate: date,
      date: `${year}-${month}-${day}`
    })

  }

  processGS1() {
    this.setState({
      downloadData: '',
    })
    axios.post('/processGS1',
      {
        data: {
          date: this.state.date
        }
      })
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
            <h4>Generate GS1 Report for</h4>
            <DatePicker
              selected={this.state.pickerDate}
              onSelect={this.changeDate}
            />
          </Col>
        </Row>
        <Row>
          <Button
            variant="contained"
            color="primary"
            style={{ margin: 15 }}
            onClick={() => {
              this.processGS1();
            }}
          >Generate</Button>
          {
            this.state.downloadData.length > 0 ?
              <CSVLink
                data={this.state.downloadData}
                filename={`${this.state.date} - GS1Export.csv`}
                style={{
                  color: 'green',
                  margin: 20
                }}
              >Download File</CSVLink>
              : null
          }
        </Row>
      </Container>
    )
  }
}
export default GS1Barcode;