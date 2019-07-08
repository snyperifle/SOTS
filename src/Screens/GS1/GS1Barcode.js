import React from 'react';
import axios from 'axios';
//=============================================================
import Button from '@material-ui/core/Button';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { CSVLink } from "react-csv";
import FileDrop from 'react-file-drop';
import * as XLSX from 'xlsx';
import readXlsxFile from 'read-excel-file';
import { PulseLoader } from 'react-spinners';
import { Container, Row, Col } from 'react-bootstrap';
import './GS1Barcode.css';
//=============================================================
class GS1Barcode extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      downloadData: '',
      date: '',
      pickerDate: new Date(),
      WeeklyGLN: '',
      fileName: '',
      loading: false,
      response: '',
    };
    this.processGS1 = this.processGS1.bind(this);
    this.changeDate = this.changeDate.bind(this);
    this.updateMasterGLN = this.updateMasterGLN.bind(this);
  }
  //=============================================================
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
  updateMasterGLN() {
    this.setState({ loading: true })
    let reader = new FileReader();
    reader.onload = () => {
      let workbook = XLSX.read(new Uint8Array(reader.result), { type: 'array' })
      let firstSheet = workbook.SheetNames[0];
      let worksheet = workbook.Sheets[firstSheet];
      let jsonSheet = XLSX.utils.sheet_to_json(worksheet);
      let data = '';
      jsonSheet.forEach((item) => {
        data = data.concat(`${item['Store']}:${item['Store GLN']}\r\n`)
      })
      axios.post('/updateMasterGLN',
        {
          data: data
        })
        .then((response) => {
          console.log(response.data);
          this.setState({
            loading: false,
            response: response.data,
          })
        })
        .catch((error) => {
          console.log(error);
        })
    }
    reader.onabort = () => console.log('File reading was aborted');
    reader.onerror = () => console.log('File reading has failed');
    reader.readAsArrayBuffer(this.state.WeeklyGLN[0]);


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
          <Col>
            <h4>Update GLN Master list</h4>
          </Col>
        </Row>
        <Row>
          <Col>
            <Button
              variant="contained"
              color="primary"
              style={{ marginTop: 15 }}
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
                    margin: 15,
                  }}
                >Download File</CSVLink>
                : null
            }
          </Col>
          <Col
            style={{
              border: 'solid black',
              borderWidth: 1,
              width: 200,
              height: 100,
            }}
          >
            <FileDrop
              onDrop={(file, event) => {
                this.setState({
                  fileName: file['0']['name'],
                  WeeklyGLN: file,
                })
              }}
            >
              {
                this.state.fileName ?
                  this.state.fileName
                  : "Drop Weekly Store GLN's file here"
              }
            </FileDrop>
            <Row>
              {
                this.state.WeeklyGLN ?
                  <Button
                    variant="contained"
                    color="primary"
                    style={{ marginTop: 15 }}
                    onClick={() => {
                      this.updateMasterGLN();
                    }}
                  >Update</Button>
                  :
                  null
              }
              {
                this.state.loading === true ?
                  <PulseLoader
                    style={{ margin: 20 }}
                  />
                  : null
              }
              {
                this.state.response ?
                  <h5
                    style={{ margin: 20 }}
                  >{this.state.response}</h5>
                  : null
              }
            </Row>
          </Col>
        </Row>
      </Container >
    );
  }
}
export default GS1Barcode;