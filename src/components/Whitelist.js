import React, { Component } from 'react';
import { create } from 'ipfs-http-client'
import Nav from './Nav';
import Web3 from 'web3'
import Marketplace from '../abis/MoonWhips.json'
import WhitelistContract from '../abis/Whitelist.json'
import {ExcelRenderer, OutTable} from 'react-excel-renderer';

const client = create('https://ipfs.infura.io:5001/api/v0')

class Whitelist extends Component {

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
            const whitelist = web3.eth.Contract(WhitelistContract.abi, networkData.address) 
            
            const saleStatus = await marketplace.methods.getWhitelistSaleStatus().call();
            const totalWhitelist = await whitelist.methods.getTotalWhitelist().call();
            const maxWhitelist = await whitelist.methods.maxWhitelistAddr().call();
            
            // let pendingWhitelist = (maxWhitelist-totalWhitelist).toString();
            
            this.setState({ marketplace })
            this.setState({ whitelist })
            this.setState({maxWhitelist:maxWhitelist,totalWhitelist:totalWhitelist, saleStatus: saleStatus, address: marketplace.address })
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
            mintedProducts:[],
            pendingMintProducts:[],
            penRivivalFrom:0,
            penRivival:0,
            rivivalArray:[],
            isRevival:false,
            saleStatus:false,
            maxWhitelist:0,
            totalWhitelist:0,
            whitelistAddress:[],
            errorAlert:null,
            loading:true
        };
        this.startSale = this.startSale.bind(this);
        this.stopSale = this.stopSale.bind(this);
        this.fileHandler = this.fileHandler.bind(this);
        this.submitRecorde = this.submitRecorde.bind(this);
    }

    fileHandler = (event) => {
        const thiss = this;
        let fileObj = event.target.files[0];

        //just pass the fileObj as parameter
        ExcelRenderer(fileObj, (err, resp) => {
          if(err){
            console.log(err);            
          }
          else{
                let addresss = [];
                for (let i = 0; i < resp.rows.length; i++) {
                    
                    if (resp.rows[i][0] && resp.rows[i] != undefined && resp.rows[i] != "") {
                        addresss.push((resp.rows[i][0]).trim());
                    }

                    if(i == (resp.rows.length-1)){
                        thiss.setState({
                            whitelistAddress:addresss
                        })
                    }

                }
            }
        });               
    
    }

    submitRecorde = async (event) => {
        const thisss = this
        thisss.setState({ loading: true })
        event.preventDefault(); 
        
        const address = this.state.whitelistAddress  
        // console.log("address");
        // console.log(address);
        try {
            this.state.whitelist.methods.add(address).send({ from: this.state.account })
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

    startSale = async () => {
        this.setState({ loading: true })
        const web3 = window.web3
        const thisss = this
    
        this.state.marketplace.methods.setWhitelistSaleAction(true).send({ from: this.state.account })
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
    }

    stopSale = async () => {
        this.setState({ loading: true })
        const web3 = window.web3
        const thisss = this
    
        this.state.marketplace.methods.setWhitelistSaleAction(false).send({ from: this.state.account })
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
                <Nav/>
                <div className="container-fluid">
                    {this.state.errorAlert && (
                        <div className="alert alert-danger">
                            {this.state.errorAlert}
                        </div>
                    )}

                    {this.state.loading && (
                        <div className="loaderScreen">
                            <span>Loading...</span>
                        </div>
                    )}

                    <div className="row">
                        <div className="col-md-6">
                            <div className="card padding50" style={{textAlign:"center"}}>
                                <div className="table-cell vetical-align-middle">
                                    <h3 style={{textAlign:"center"}}>Sale Status : {(this.state.saleStatus)? "ON" : "OFF"}</h3>
                                    <button type="button" onClick={this.startSale} className="btn btn-primary" style={{margin:"5px"}} disabled={this.state.saleStatus}> Start sale </button>
                                    <button type="button" onClick={this.stopSale} className="btn btn-primary" style={{margin:"5px"}} disabled={!this.state.saleStatus}> Stop sale </button>
                                </div>
                            </div>
                        </div>

                        <div className="col-md-6">
                            <div className="card padding50">
                                <div className="table-cell vetical-align-middle">
                                    <h3 className="text-center">Whitelisted Address : {this.state.totalWhitelist.toString()}/{this.state.maxWhitelist.toString()}</h3>
                                    
                                    <br/>

                                    <h5>Add New Whitelist</h5>
                                    <form onSubmit={this.submitRecorde}>
                                        <div className="form-group mr-sm-2">
                                            <input type="file" className="form-control" onChange={this.fileHandler.bind(this)} style={{"padding":"3px"}} accept=".xls, .xlsx"/>
                                        </div>

                                        <button type="submit" className="btn btn-primary">Add to Whitelist</button>
                                        
                                    </form>
                                </div>
                            </div>
                        </div>

                    </div>

                </div> 
            </>
        ); 
    }

}

export default Whitelist;