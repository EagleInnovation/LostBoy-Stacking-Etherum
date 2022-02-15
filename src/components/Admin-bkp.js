import React, { Component } from 'react';
import { create } from 'ipfs-http-client'
import Services from './Service';
import Web3 from 'web3'
import Nav from './Nav'
import Marketplace from '../abis/MoonlightTest.json'
import Whitelist from '../abis/Whitelist.json'

const client = create('https://ipfs.infura.io:5001/api/v0')

class Admin extends Component {

    async componentWillMount() { 
        await this.loadWeb3()
        await this.loadBlockchainData()
        const nftList =  await Services.post("nftList");
        if(nftList.data.status){

            var mintedProducts = nftList.data.data.filter(function (e) { return e.nftId != 0; });
            var pendingMintProducts = nftList.data.data.filter(function (e) { return e.nftId == 0; });
            
            this.setState({ mintedProducts: mintedProducts ,penProducts:pendingMintProducts})
        }
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
            const totalMintToken = await marketplace.methods.totalMintToken().call();
            const getPendingRivival = await marketplace.methods.getPendingRivival().call();

            const pendingRevivalStart = (getPendingRivival == 1)?0:(getPendingRivival-1);
            let pendingRevival = (totalMintToken-pendingRevivalStart).toString();
            
            this.setState({ marketplace })
            this.setState({ whitelist })
            this.setState({ address: marketplace.address, mintToken:totalMintToken, penRivivalFrom:getPendingRivival, penRivival:pendingRevival })
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
            penProducts:[],
            penRivivalFrom:0,
            penRivival:0,
            rivivalArray:[],
            isRevival:false,
            successAlert:null,
            errorAlert:null
        };
        this.startSale = this.startSale.bind(this);
        this.stopSale = this.stopSale.bind(this);
        this.revival = this.revival.bind(this);
        this.submitRecorde = this.submitRecorde.bind(this);
    }

    submitRecorde = async (event) => {
        event.preventDefault(); 
        
        // const file = this.state.image
        const collection = event.target.collection.value
        const baseurl = event.target.baseurl.value
        const nfttotal = event.target.nfttotal.value
    
        try {

            const nftLists = [];

            for (let i = 1; i <= nfttotal; i++) {

                let postData = {
                    collection:collection,
                    ipfsUri:(baseurl+i+".json")
                }

                nftLists.push(postData);

                if (i == nfttotal) {

                    const values =  await Services.post("addNewnft",nftLists);
                    if(values.data.status){
                        this.setState({
                            successAlert:values.data.msg 
                        })
                    }else{
                        this.setState({
                            errorAlert:values.data.msg 
                        })
                    }  
                    
                }

            }
            
        } catch (error) {
            console.error(error);
        }

    }

    captureFile = (event) => {
        event.preventDefault();
        const file = event.target.files[0]; 
        this.setState({ image: file });
    }

    startSale = async () => {
        this.setState({ loading: true })
        const web3 = window.web3
        const thisss = this
    
        this.state.marketplace.methods.setPause(true).send({ from: this.state.account }).once('transactionHash', (transactionHash) => {
            this.waitForReceipt(transactionHash, function () {
                  thisss.setState({ loading: false })
                  window.location.reload();
            });
        })
          
    }

    stopSale = async () => {
        this.setState({ loading: true })
        const web3 = window.web3
        const thisss = this
    
        this.state.marketplace.methods.setPause(false).send({ from: this.state.account }).once('transactionHash', (transactionHash) => {
            this.waitForReceipt(transactionHash, function () {
                  thisss.setState({ loading: false })
                  window.location.reload();
            });
        })
          
    }

    revival = async () =>{
        const web3 = window.web3
        const thisss = this
     
        const values =  await Services.post("revivalnftList", {nftcount:this.state.penRivival});

        if(values.data.status){
            
            // const totalMintToken = await this.state.marketplace.methods.totalMintToken().call();
            
            if(this.state.penRivival == values.data.data.length){

                const resultArray = values.data.data.sort(() => Math.random() - 0.5)
                      this.setState({ rivivalArray: resultArray })

                var resultOfRandom = resultArray.map(function (el) { return el.ipfsUri; });
                    
                this.state.marketplace.methods.updateToSelected(resultOfRandom).send({ from: this.state.account }).once('transactionHash', (transactionHash) => {
                    this.waitForReceipt(transactionHash, function () {
                        //  thisss.setState({ isRevival:true })
                         thisss.updateArrayNft(thisss.state.rivivalArray, thisss.state.penRivivalFrom.toString());
                    });
                });

            }else{
                alert("You need to add "+(this.state.penRivival-values.data.data.length)+" More Nft details");    
            }
            
        }else{
            alert(values.data.msg);
        } 
    }

    // whitelistStatus = async () => {
    //     console.log("Whitelist Status");
    //     this.setState({ loading: true })
    //     const web3 = window.web3
    //     const thisss = this
    
    //     this.state.whitelist.methods.setWhitelistStatus(true).send({ from: this.state.account }).once('transactionHash', (transactionHash) => {
    //         this.waitForReceipt(transactionHash, function () {
    //               thisss.setState({ loading: false })
    //               window.location.reload();
    //         });
    //     }) 
    // }
    
    // whitelistAdd = async () => {
    //     console.log("Add Address");
    //     this.setState({ loading: true })
    //     const web3 = window.web3
    //     const thisss = this
    
    //     this.state.whitelist.methods.add(this.state.account).send({ from: this.state.account }).once('transactionHash', (transactionHash) => {
    //         this.waitForReceipt(transactionHash, function () {
    //               thisss.setState({ loading: false })
    //               window.location.reload();
    //         });
    //     })
    // }

    updateArrayNft = async (resultArray,lastrevivalId) => {
        const updateStatus =  await Services.post("updateRivivalNft", { updateArray : resultArray, lastrevivalId: lastrevivalId });
                        
        if(updateStatus.data.status){
            this.setState({ loading: false , updateArray: []})
            window.location.reload();
        }else{
            alert(updateStatus.data.msg);
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
              cb(receipt);
            }
          } else {
            // Try again in 1 second
            window.setTimeout(function () {
              thiss.waitForReceipt(hash, cb);
            }, 1000);
          }
        });
    }

    render() {
        return (
            <>
                <Nav />
                <div className="container-fluid mt-5">
                    <div className="row">
                        <main role="main" className="col-lg-6" style={{margin:"auto"}}>
                            
                            {this.state.errorAlert && (
                                <div class="alert alert-danger text-center" role="alert">
                                    {this.state.errorAlert}
                                </div>
                            )}

                            {this.state.successAlert && (
                                <div class="alert alert-primary text-center" role="alert">
                                    {this.state.successAlert}
                                </div>
                            )}
                        
                            <h3 className="text-center">Add Products</h3>
                            <br/>
                            <form onSubmit={this.submitRecorde}>
                                
                                <div className="form-group mr-sm-2">
                                    <select id="collection" className="form-control" onChange={this.handleChange}>
                                        <option value="truck">Truck</option>
                                        <option value="dog">Dog</option>
                                        <option value="car">Car</option>
                                    </select>
                                </div>

                                <div className="form-group mr-sm-2">
                                    <input
                                        id="baseurl"
                                        type="text"
                                        ref={(input) => { this.baseurl = input }}
                                        className="form-control"
                                        placeholder="Base URL"
                                        required />
                                </div>

                                <div className="form-group mr-sm-2">
                                    <input
                                        id="nfttotal"
                                        type="text"
                                        ref={(input) => { this.nfttotal = input }}
                                        className="form-control"
                                        placeholder="Total of NFT"
                                        required />
                                </div>

                                <button type="submit" className="btn btn-primary">Add NFTs</button>
                            </form>
                        </main>
                    </div>
                    
                    {/* <div className="">
                        <div clas="container" style={{width: "100%"}}>
                            <br/>
                            <br/>
                            <hr/>
                            <h3 style={{textAlign:"center"}}>NFT Products</h3>
                            {this.state.penProducts.length === 0 && (
                                <p style={{textAlign:"center"}}>No Record found</p>
                            )}
                            <div className="row">
                                {this.state.penProducts.map((product, key) => {

                                    let openseaURI = "https://testnets.opensea.io/assets/0x532D12bDC147108d092bA9ACd0B6617115807c65/"+product.nftId;
                                    return (
                                        <div key={key} className="col-sm-3" style={{textAlign:"center"}}>
                                            <div className="imageCard" style={{padding:"10px",background: "#dbdbdb"}}>
                                                <div style={{height:"200px", width:"100%"}}>
                                                    <img src={product.image}  style={{display:"inline-block", height:"200px", width:"100%"}}/>
                                                </div>
                                            </div>
                                        </div>
                                    )    
                                })
                                }
                            </div>
                        </div>


                    </div> */}
                </div>
            </>
        );
    }

}

export default Admin;