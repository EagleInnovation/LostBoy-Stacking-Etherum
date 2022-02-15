import React, { Component } from 'react';
import "./Main.css";

class Main extends Component {

  constructor(props) {
    super(props);
    this.state = {
      productImage:"",
      products:[]
    };
  }

  onSubmit = async (event) => {
    event.preventDefault(); 
    console.log("on submit...");
    const amount = event.target.amount.value
    this.props.createProduct(amount)

  }


  render() {
    const web3 = window.web3

    return (
      <div id="content">
        <form onSubmit={this.onSubmit}>
          <div className="form-group mr-sm-2">
            <input
              id="amount"
              type="number"
              ref={(input) => { this.amount = input }}
              className="form-control"
              placeholder="NFT Amount" 
              max={this.props.maxPending}/>
          </div>
          <button type="submit" className="btn btn-primary">Mint NFT</button>
        </form>
      </div>
    );
  }
}

export default Main;
