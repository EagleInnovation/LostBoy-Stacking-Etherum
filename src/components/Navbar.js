import React, { Component } from 'react';

class Navbar extends Component {

  render() {
    return (
      <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
        
        
        <ul className="navbar-nav px-3">
          <li className="nav-item text-nowrap d-none d-sm-none d-sm-block">
            <div><small className="text-white"><span id="account">Your Address: {this.props.account}</span></small></div>
            <div><small className="text-white"><span id="contract">Contract Address: {this.props.contract}</span></small></div>
          </li>
        </ul>
      </nav>
    );
  }
}

export default Navbar;
