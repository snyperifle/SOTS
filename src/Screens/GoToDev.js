import React from 'react';
// import {
//   Page,
//   Panel,
//   Breadcrumbs
// } from 'react-blur-admin';
import { Link } from 'react-router-dom';
//=============================================================
class GoToDev extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }
  //=============================================================

  render() {
    return (
      <div>Dev Screen</div>
      // <Page
      //   actionBar={this.renderBreadcrumbs()}
      //   title='About'
      // >
      //   <Panel
      //     title='The Team'
      //   >
      //     Lorem Ipsum
      //   </Panel>
      // </Page>
    )
  }
}
//=============================================================
export default GoToDev;