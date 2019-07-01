import React from 'react';
import axios from 'axios';
//=============================================================
import { Container, Row, Col } from 'react-bootstrap';
import '../../App.css';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { PulseLoader } from 'react-spinners';
//=============================================================
class RoutesToTelogis extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userOpCo: '',
      loading: false,
      pickerDate: new Date(),
      date: new Date(),
      routeList: [],
    };
    this.changeDate = this.changeDate.bind(this);
    this.fetchExportFilesToTelogis = this.fetchExportFilesToTelogis.bind(this);
  }
  //=============================================================
  componentDidMount() {
    let today = new Date();
    this.changeDate(today);
    setTimeout(() => {
      this.fetchExportFilesToTelogis(this.state.date);
    }, 1000);
    console.log(this.props.allOpCo);
  }
  //=============================================================
  changeDate(date) {
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();
    this.setState({
      pickerDate: date,
      date: `${year}${month.toString().length === 1 ? `0${month}` : month}${day}`
    })
    setTimeout(() => {
      this.fetchExportFilesToTelogis(this.state.date);
    }, 1000);
  }

  fetchExportFilesToTelogis(date) {
    this.setState({
      loading: true,
      routeList: [],
    })
    axios.post('/routesToTelogis',
      {
        data: this.state.date
      })
      .then((response) => {
        this.setState({
          loading: false,
          routeList: response.data,
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
            <h2>Routes Not Flowing to Telogis</h2>
          </Col>
        </Row>
        <Row>
          <Col>
            <h5>Check routes for </h5>
            <DatePicker
              selected={this.state.pickerDate}
              onSelect={this.changeDate}
            />
          </Col>
          <Col>
            {this.state.routeList.length > 0 ?
              <ul>
                {this.state.routeList.map((item) => {
                  return this.props.userOpCo !== null && item.substring(19, 22) === this.props.userOpCo.substring(0, 3) ?
                    <li style={{ color: 'red' }}>{item}</li>
                    :
                    <li>{item}</li>
                })}
              </ul>
              : null}
            {this.state.loading === true ? <PulseLoader /> : null}
          </Col>
        </Row>
      </Container>
    )
  }
}
export default RoutesToTelogis;