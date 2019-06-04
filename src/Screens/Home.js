import React from 'react';
class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      members: [
        {
          name: 'Ranuka Subramanian',
          number: '720-442-2495'
        },
        {
          name: 'Calvin Chui',
          number: '832-524-2831'
        },
        {
          name: 'Jose Suyambu',
          number: '832-696-4412'
        },
        {
          name: 'Thella Ramya',
          number: '91-99866-97599'
        },
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
        <h3>Support Members</h3>
        <ul>
          {this.state.members.map((item) => (
            <li>{item.name}: {item.number}</li>
          ))}
        </ul>
      </div>
    )
  }
}
export default Home;