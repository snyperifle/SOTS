import React from 'react';
class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      contacts: [
        {
          'Onshore': [
            { name: 'Geoffrey Bray', number: '281-615-6013' },
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
            { name: 'Sivakota Reddy Guduru', number: '' },
            { name: 'Devi Pedamallu', number: '' },
            { name: 'Louis Shields', number: '' },
          ]
        },
        {
          'CCOD': [
            { name: 'Joy Aaron', number: '' },
            { name: 'Jhansi Lakshmi Kondireddy', number: '' },
            { name: 'Chaganti Prathyusha', number: '' }
          ]
        },
        {
          'Citrix': [
            { name: 'Ramesh Nambaru', number: '' },
            { name: 'Kashyap Santanu', number: '' },
            { name: 'Haribabu Vallabhaneni', number: '' },
          ]
        },
        {
          'DBA': [
            { name: 'Manogyna Devarapalli', number: '' },
            { name: 'Ravindrareddy Madireddy', number: '' },
            { name: 'Rakesh Sivan', number: '' },
          ]
        }
      ]
    };
  }
  render() {
    return (
      <div
        style={{
          margin: 20
        }}
      >
        <h1>Welcome</h1>
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
      </div>
    )
  }
}
export default Home;