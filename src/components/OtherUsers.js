import React, { Component } from 'react';
import { create } from 'ipfs-http-client'
import Services from './Service';
import Nav from './Nav';
import Web3 from 'web3'
import Marketplace from '../abis/MoonWhips.json'
import Whitelist from '../abis/Whitelist.json'
import "./App.css";

const client = create('https://ipfs.infura.io:5001/api/v0')

class OtherUsers extends Component {

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
            const whitelist = web3.eth.Contract(Whitelist.abi, networkData.address) 
            const totalMintToken = await marketplace.methods.totalMintedCounter().call();
            const getPendingRivival = await marketplace.methods.getPendingRivival().call();

            const pendingRevivalStart = (getPendingRivival == 1)?0:(getPendingRivival-1);
            let pendingRevival = (totalMintToken-pendingRevivalStart).toString();
        
            const ownerTotalMintToken = await marketplace.methods.ownerTotalMintToken().call();

            const freePendingTokens = (Number(totalMintToken) - Number(ownerTotalMintToken));
            
            const saleStatus = await marketplace.methods.getSaleStatus().call();
            const getMaxToken = await marketplace.methods.getMaxToken().call();
        
            this.setState({ marketplace })
            this.setState({ whitelist })
            this.setState({ saleStatus: saleStatus, maxToken: getMaxToken, address: marketplace.address, mintToken:totalMintToken, penRivivalFrom:getPendingRivival, penRivival:pendingRevival, freemintingToken: freePendingTokens })
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
            saleStatus: false, 
            maxToken: 0,
            mintToken:0,
            freemintingToken:0,
            loading:true
        };
        this.startSale = this.startSale.bind(this);
        this.stopSale = this.stopSale.bind(this);
        this.revival = this.revival.bind(this);
    }

    startSale = async () => {
        this.setState({ loading: true })
        const web3 = window.web3
        const thisss = this
    
        this.state.marketplace.methods.setSaleAction(true).send({ from: this.state.account })
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
    
        this.state.marketplace.methods.setSaleAction(false).send({ from: this.state.account })
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

    revival = async () =>{
        this.setState({ loading: true })
        const web3 = window.web3
        const thisss = this
     
        const values =  await Services.post("revivalnftList", {nftcount:this.state.penRivival});

        if(values.data.status){
            
            // const totalMintToken = await this.state.marketplace.methods.totalMintToken().call();
            
            if(this.state.penRivival == values.data.data.length){

                const resultArray = values.data.data.sort(() => Math.random() - 0.5)
                      this.setState({ rivivalArray: resultArray })

                var resultOfRandom = resultArray.map(function (el) { return el.ipfsUri; });
                    
                this.state.marketplace.methods.updateToSelected(resultOfRandom).send({ from: this.state.account })
                    .on('transactionHash', function(hash){
                        thisss.waitForReceipt(hash, function (response) {
                            if(response.status){
                                thisss.updateArrayNft(thisss.state.rivivalArray, thisss.state.penRivivalFrom.toString());
                            }else{
                                thisss.setState({ errorAlert: response.msg})
                            }
                            thisss.setState({ loading: false })
                        });
                    }).on('error', function(error, receipt) {
                        alert(error.message);
                        thisss.setState({ loading: false })
                    });

            }else{
                alert("You need to add "+(this.state.penRivival-values.data.data.length)+" More Nft details");
                thisss.setState({ loading: false })    
            }
            
        }else{
            alert(values.data.msg);
            thisss.setState({ loading: false })
        } 
    }

    updateArrayNft = async (resultArray,lastrevivalId) => {
        const updateStatus =  await Services.post("updateRivivalNft", { updateArray : resultArray, lastrevivalId: lastrevivalId });
                        
        if(updateStatus.data.status){
            this.setState({ loading: false , updateArray: []})
            window.location.reload();
        }else{
            alert(updateStatus.data.msg);
            this.setState({ loading: false});
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
                {this.state.loading && (
                    <div className="loaderScreen">
                        <span>Loading...</span>
                    </div>
                )}
                <div>
                    <Nav />
                    <div className="container-fluid mt-5">
                        <div className="row"  style={{textAlign:"center"}}>
                        
                            <div className="col-md-6">
                                <div className="card padding50">
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
                                        <h3 style={{textAlign:"center"}}>Total Mint NFT : {this.state.freemintingToken.toString()}/{this.state.maxToken.toString()}</h3>
                                        <div style={{textAlign:"center",margin:"auto"}}>
                                                <button type="button" onClick={this.revival} className="btn btn-primary" style={{margin:"5px"}}> Reveal ({this.state.penRivival} NFT) </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                                
                        </div>
                    </div>
                </div>
            </>
        );
    }

}

export default OtherUsers;