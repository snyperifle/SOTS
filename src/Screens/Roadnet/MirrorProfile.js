import React from 'react';
import axios from 'axios';
//=============================================================
import Button from '@material-ui/core/Button';
import Form from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl';
import { Container, Row, Col } from 'react-bootstrap';
import { PulseLoader } from 'react-spinners';
import '../../App.css';
//=============================================================
class MirrorProfile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      fromProfile: '',
      fromProfileExists: false,
      copiedFiles: [],
    };
    this.fromProfileChecker = this.fromProfileChecker.bind(this);
    this.mirrorProfile = this.mirrorProfile.bind(this);
  }
  //=============================================================
  fromProfileChecker(input) {
    if (this.props.file.filter((item) => item.split(' ')[0] === input).length === 1) {
      this.setState({
        fromProfileExists: true,
        fromProfile: input
      })
    } else {
      this.setState({
        fromProfileExists: false,
      })
    }
  }
  mirrorProfile() {
    this.setState({
      loading: true,
      copiedFiles: [],
    })
    axios.post('/mirrorProfile', {
      data: {
        toProfile: this.props.userId,
        fromProfile: this.state.fromProfile,
      }
    })
      .then((response) => {
        this.setState({ copiedFiles: response.data, loading: false })
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
            <h2>
              Mirror User Profile
          </h2>
          </Col>
        </Row>
        <Row>
          <Col>
            {
              this.props.userId === '' || this.props.userOpCo === null ?
                <h2 style={{ color: 'red' }}>Please enter the Caller ID</h2>
                :
                <Form>
                  <FormControl
                    type='text'
                    placeholder="User ID to mirror from"
                    style={{ width: 350 }}
                    onChange={(input) => {
                      this.fromProfileChecker(input.target.value);
                    }}
                  />
                </Form>
            }
            {
              this.props.userId !== '' && this.state.fromProfile.length === 8 ?
                <h4
                  style={{ marginTop: 10 }}
                >Copy profile from {this.state.fromProfile} to {this.props.userId}?</h4>
                : null
            }
            {
              this.props.userId.length > 0 && this.state.fromProfile.length > 0 && this.state.fromProfileExists === true ?
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() => {
                    this.mirrorProfile();
                  }}
                >Confirm</Button>
                : null
            }
          </Col>
          <Col>
            {
              this.state.copiedFiles.length > 0 ?
                <div>
                  <h4>Files mirrored:</h4>
                  <ul>
                    {this.state.copiedFiles.map((item) => (
                      <li>{item}</li>
                    ))}
                  </ul>
                </div>
                : null
            }
            {
              this.state.loading === true ?
                <PulseLoader />
                : null
            }
          </Col>
        </Row>
      </Container>
    )
  }
}
export default MirrorProfile;