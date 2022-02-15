import React, { Component } from 'react';
import { create } from 'ipfs-http-client'
import Services from './Service';
import Web3 from 'web3'
import Nav from './Nav'
import Marketplace from '../abis/MoonWhips.json'

const client = create('https://ipfs.infura.io:5001/api/v0')

class Free extends Component {
 
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
                this.setState({ marketplace })
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
            errorAlert:null,
            successAlert:null
        };
        this.submitRecorde = this.submitRecorde.bind(this);
    }

    submitRecorde = async (event) => {

        const formEvent = event.target;
        event.preventDefault(); 
        this.setState({ loading: true })
        const address = event.target.address.value
    
        try {

            const thisss = this
            
            this.state.marketplace.methods.withdraw(address).send({ from: this.state.account})
                .on('transactionHash', function(hash){
                    thisss.waitForReceipt(hash, function (response) {
                        if(response.status){
                            thisss.setState({ successAlert: "Withdraw transfer Successfully"})
                        }else{
                            thisss.setState({ errorAlert: response.msg})
                        }
                        thisss.setState({ loading: false })
                        formEvent.reset();

                        setTimeout(() => {
                            thisss.setState({
                                successAlert: null,
                                errorAlert: null
                            })
                        }, 5000)

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
                <div style={{position:"relative", minHeight:"100vh"}}>

                    {this.state.loading && (
                        <div className="loaderScreen">
                            <span>Loading...</span>
                        </div>
                    )}
                 
                        <Nav />
                        <div className="container-fluid mt-5">
                            
                            <div className="row">
                                <main role="main" className="col-lg-6" style={{margin:"auto"}}>
                              
                                    {this.state.errorAlert && (
                                        <div className="alert alert-danger text-center">
                                            {this.state.errorAlert}
                                        </div>
                                    )}

                                    {this.state.successAlert && (
                                        <div className="alert alert-primary text-center">
                                            {this.state.successAlert}
                                        </div>
                                    )}


                                    <div className="card padding50">
                                        <div className="table-cell vetical-align-middle">
                                            <h5 className="text-center">Withdraw ETH Balance</h5>
                                            <br/>
                                            <form onSubmit={this.submitRecorde}>
                                              
                                                <div className="form-group mr-sm-2">
                                                    <input
                                                        id="address"
                                                        type="text"
                                                        ref={(input) => { this.address = input }}
                                                        className="form-control"
                                                        placeholder="Withdraw wallet address"
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

export default Free;