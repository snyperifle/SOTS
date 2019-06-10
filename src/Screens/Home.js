import React from 'react';
//=============================================================
import { Container, Row, Col } from 'react-bootstrap';
import Clock from 'react-live-clock';
//=============================================================
import '../App.css';
//=============================================================
class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      contacts: [
        {
          'Onshore': [
            { name: 'Geoffrey Bray', number: '281-615-6013' },
            { name: 'Roy Mammen', number: '' },
            { name: 'Ranuka Subramanian', number: '720-442-2495' },
            { name: 'Calvin Chui', number: '832-524-2831' },
            { name: 'Jose Suyambu', number: '832-696-4412' },
          ]
        },
        {
          'Offshore': [
            { name: 'Thella Ramya', number: '91-99866-97599' },
            { name: 'Mubeena Begum', number: '91-99416-49405' },
          ]
        },
        {
          'Account Admin': [
            { name: 'Sivakota Reddy Guduru', number: '91-95500-50009' },
            { name: 'Devi Pedamallu', number: '91-70939-49686' },
            { name: 'Louis Shields', number: '832-349-7595' },
          ]
        },
        {
          'CCOD': [
            { name: 'Joy Aaron', number: '213-435-1487' },
            { name: 'Jhansi Lakshmi Kondireddy', number: '' },
            { name: 'Chaganti Prathyusha', number: '' }
          ]
        },
        {
          'Citrix': [
            { name: 'Ramesh Nambaru', number: '' },
            { name: 'Kashyap Santanu', number: '91-95509-62424' },
            { name: 'Haribabu Vallabhaneni', number: '' },
          ]
        },
        {
          'DBA': [
            { name: 'Manogyna Devarapalli', number: '91-94944-90249' },
            { name: 'Ravindrareddy Madireddy', number: '972-589-7877' },
            { name: 'Rakesh Sivan', number: '91-98858-33025' },
          ]
        }
      ],

    };
  }
  render() {
    return (
      <div>
        <h1>Welcome</h1>
        <Container
          style={{ backgroundColor: 'red' }}
        >
          <Row
            style={{ backgroundColor: 'blue' }}
          >

            <Col
              style={{ backgroundColor: 'green' }}
            >
              {this.state.contacts.map((item, i) => (
                <div>
                  <h4>{Object.keys(item)}</h4>
                  <ul>
                    {this.state.contacts[i][Object.keys(item)].map((item2) => (
                      <li>
                        {item2.name}{item2.number ? `: ${item2.number}` : null}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </Col>

            <Col
              style={{ backgroundColor: 'yellow' }}
            >
              <h4>Onshore Time</h4>
              <Clock
                format={'HH:mm:ss'}
                ticking={true}
                timezone={'US/Central'}
              />
              <h4>Offshore Time</h4>
              <Clock
                format={'HH:mm:ss'}
                ticking={true}
                timezone={'Indian/Cocos'}
              />
            </Col>

          </Row>

        </Container>
      </div>
    )
  }
}
export default Home;