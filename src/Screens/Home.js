import React from 'react';
class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      onshoreMembers: [
        { name: 'Geoffrey Bray', number: '281-615-6013' },
        { name: 'Ranuka Subramanian', number: '720-442-2495' },
        { name: 'Calvin Chui', number: '832-524-2831' },
        { name: 'Jose Suyambu', number: '832-696-4412' },
      ],
      offshoreMembers: [
        { name: 'Thella Ramya', number: '91-99866-97599' },
        { name: 'Mubeena Begum', number: '91-99416-49405' },
      ],
      accountAdmin: [
        { name: 'Sivakota Reddy Guduru', number: '' },
        { name: 'Devi Pedamallu', number: '' },
        { name: 'Louis Shields', number: '' },
      ],
      ccod: [
        { name: 'Joy Aaron', number: '' },
        { name: 'Jhansi Lakshmi Kondireddy', number: '' },
        { name: 'Chaganti Prathyusha', number: '' }
      ],
      citrix: [
        { name: 'Ramesh Nambaru', number: '' },
        { name: 'Kashyap Santanu', number: '' },
        { name: 'Haribabu Vallabhaneni', number: '' },
      ],
      dba: [
        { name: 'Manogyna Devarapalli', number: '' },
        { name: 'Ravindrareddy Madireddy', number: '' },
        { name: 'Rakesh Sivan', number: '' },
      ]
    };
  }
  render() {
    console.log(`Render Home`, this.props);
    return (
      <div
        style={{
          margin: 20
        }}
      >
        <h1>Welcome</h1>
        <h3>Onshore</h3>
        <ul>
          {this.state.onshoreMembers.map((item) => (
            <li>{item.name}: {item.number}</li>
          ))}
        </ul>
        <h3>Offshore</h3>
        <ul>
          {this.state.offshoreMembers.map((item) => (
            <li>{item.name}: {item.number}</li>
          ))}
        </ul>
      </div>
    )
  }
}
export default Home;