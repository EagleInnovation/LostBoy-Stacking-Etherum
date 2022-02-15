import React, { Component } from 'react';
import { create } from 'ipfs-http-client'
import Web3 from 'web3'
import Nav from './Nav'
import Marketplace from '../abis/LostToken.json'

const client = create('https://ipfs.infura.io:5001/api/v0')

class AirDrops extends Component {
 
    async componentWillMount() { 
        await this.loadWeb3()
        await this.loadBlockchainData()
    }
    
    async loadWeb3() {
        if (window.ethereum) {
            window.web3 = new Web3(window.ethereum)
            await window.ethereum.enable()
        } else if (window.web3) {
            window.web3 = new Web3(window.web3.currentProvider)
        } else {
            window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
        }
    }
    
    async loadBlockchainData() {
        const web3 = window.web3
        // Load account
        const accounts = await web3.eth.getAccounts()
        this.setState({ account: accounts[0] })
        const networkId = await web3.eth.net.getId()
        const networkData = Marketplace.networks[networkId]
        if(networkData) {

                const marketplace = web3.eth.Contract(Marketplace.abi, networkData.address)
                const balanceToken = await marketplace.methods.balanceOf(this.state.account).call();
                const balance = web3.utils.fromWei(String(balanceToken));
                this.setState({ marketplace })
                this.setState({ address: marketplace.address, balance:balance})
                this.setState({ loading: false})

        } else {
            window.alert('Marketplace contract not deployed to detected network.')
        }
    }
     
    constructor(props) {
        super(props);
        this.state = {
            account: '',
            address: '',
            alert:"",
            balance:0
        };
        this.submitRecorde = this.submitRecorde.bind(this);
    }

    submitRecorde = async (event) => {
        event.preventDefault(); 
        const web3 = window.web3;
        const thisss = this;
        const amount = event.target.amount.value
        const address = event.target.address.value
    
        const transaferToken = web3.utils.toWei(String(amount));

        try {
        
            this.state.marketplace.methods.transfer(address, transaferToken).send({ from: this.state.account})
            .on('transactionHash', function(hash){
                thisss.waitForReceipt(hash, function (response) {
                    if(response.status){
                        window.location.reload();
                    }else{
                        thisss.setState({ errorAlert: response.msg})
                    }
                    thisss.setState({ loading: false })
                });
            }).on('error', function(error, receipt) {
                alert(error.message);
                thisss.setState({ loading: false })
            });

        } catch (error) {
            console.error(error);
        }

    }


    async waitForReceipt(hash, cb) {
        const web3 = window.web3;
        const thiss = this;
        web3.eth.getTransactionReceipt(hash, function (err, receipt) {
            if (err) {
              console.log(err);
            }
        
            if (receipt !== null) {
              if (cb) {
                  if(receipt.status == '0x0') {
                      cb({status:false, msg: "The contract execution was not successful, check your transaction !"});
                  } else {
                      cb({status:true, msg:"Execution worked fine!"});
                  }
              }
            } else {
              window.setTimeout(function () {
                thiss.waitForReceipt(hash, cb);
              }, 1000);
            }
          });
    }


    render() {
        return (
            <>
                <div style={{position:"relative"}}>

                    {this.state.loading && (
                        <div className="loaderScreen">
                            <span>Loading...</span>
                        </div>
                    )}
                
                        <Nav />
                        <div className="container-fluid mt-5">
                            
                            {this.state.errorAlert && (
                                <div className="alert alert-danger">
                                    {this.state.errorAlert}
                                </div>
                            )}

                            <div className="row">
                                <main role="main" className="col-lg-6" style={{margin:"auto"}}>
                                    <div className="card padding50">
                                        <div className="table-cell vetical-align-middle">
                                            <h3 style={{textAlign:"center"}}> Total Tokens : {this.state.balance.toString()}</h3>
                                            <hr/>
                                            <h5 className="text-center">Mint Free NFT</h5>
                                            <br/>
                                            <form onSubmit={this.submitRecorde}>
                                                
                                                <div className="form-group mr-sm-2">
                                                    <input
                                                        id="amount"
                                                        type="number"
                                                        ref={(input) => { this.amount = input }}
                                                        className="form-control"
                                                        placeholder="Amount of Tokens"
                                                        max={this.state.pendingToken}
                                                        required />
                                                </div>

                                                <div className="form-group mr-sm-2">
                                                    <input
                                                        id="address"
                                                        type="text"
                                                        ref={(input) => { this.address = input }}
                                                        className="form-control"
                                                        placeholder="To transfer address"
                                                        required />
                                                </div>

                                                <button type="submit" className="btn btn-primary">Submit</button>
                                            </form>
                                        </div>
                                    </div>
                                </main>
                            </div>
                        </div>
                    </div>
            </>
        );
    }
}

export default AirDrops;