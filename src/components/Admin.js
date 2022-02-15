import React, { Component } from 'react'
import Web3 from 'web3'
import Marketplace from '../abis/LostBoyTest.json'
import LostStaking from '../abis/LostStaking.json'
import LostToken from '../abis/LostToken.json'
import Lostgirl from '../abis/Lostgirl.json'
import Services from './Service';
import Nav from './Nav'

class Admin extends Component {

    async componentWillMount() { 
        await this.loadWeb3()
        await this.loadBlockchainData()
        await this.getBalanceOfStak()
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
        console.log(accounts);
        this.setState({ account: accounts[0] })
        const networkId = await web3.eth.net.getId()
        const networkData = Marketplace.networks[networkId]
        const lostStakingData = LostStaking.networks[networkId]
        const lostTokens = LostToken.networks[networkId]
        const lostgirlTokens = Lostgirl.networks[networkId] 
    
            if(lostStakingData) {

                const marketplace = web3.eth.Contract(Marketplace.abi, networkData.address)
                const lostStaking = web3.eth.Contract(LostStaking.abi, lostStakingData.address)
                const lostToken = web3.eth.Contract(LostToken.abi, lostTokens.address)
                const lostgirltoken = web3.eth.Contract(Lostgirl.abi, lostgirlTokens.address)
                
                this.setState({ marketplace, lostStaking, lostToken, lostgirltoken})
                this.setState({nftcontractAddress: marketplace.address, stakingAddress:lostStakingData.address});
                this.setState({ loading: false})

                


            } else {
                window.alert('Marketplace contract not deployed to detected network.')
            }
    }
     
    constructor(props) {
        super(props);
        this.state = {
            account: '',
            alert:"",
            loading:false,
            marketplace:null,
            lostStaking:null,
            lostToken:null,
            lostgirltoken:null,
            nftcontractAddress:null,
            stakingAddress: null,
            mintingIndex:0,
            mintinggirlIndex:0,
            addStackArray:"",
            withStakArray:"",
            addressPrevDay:"",
            tokenIdPrevDay:0,
            calculateRewardArray:"",
            claimRewardsIds:"",
            stackFreezDay:0,
            ownNfts:[],
            stackBalance:[]
        };
        this.getBalanceOfnft = this.getBalanceOfnft.bind(this);
        this.mintToken = this.mintToken.bind(this);
        this.setApprovalForAll = this.setApprovalForAll.bind(this);
        this.addInStacking = this.addInStacking.bind(this);
        this.setStart = this.setStart.bind(this);
        this.increaseAllowance = this.increaseAllowance.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleChangeStack = this.handleChangeStack.bind(this);
        this.handleChangeWithdraw = this.handleChangeWithdraw.bind(this);
        this.handlecalculateReward = this.handlecalculateReward.bind(this);
        this.handleChangeclaimRewardsIds = this.handleChangeclaimRewardsIds.bind(this);
        this.handleChangeStackDays = this.handleChangeStackDays.bind(this);
        this.setStartStaking = this.setStartStaking.bind(this);
        this.getBalanceOfnftOwner = this.getBalanceOfnftOwner.bind(this);
        this.transferNfts = this.transferNfts.bind(this);
        this.getBalanceOfStak = this.getBalanceOfStak.bind(this);
        this.claimRewards = this.claimRewards.bind(this);
    } 


    handleChange = (e) => {
        this.setState({mintingIndex: e.target.value});
    }

    handleChangeGirl = (e) => {
        this.setState({mintinggirlIndex: e.target.value});
    }

    handleChangeStack = (e) => {
        this.setState({addStackArray: e.target.value});
    }

    handleChangeWithdraw = (e) => {
        this.setState({withStakArray: e.target.value});
    }

    handleaddressPrevDay = (e) => {
        this.setState({addressPrevDay: e.target.value});
    }
    
    handletokenIdPrevDay = (e) => {
        this.setState({tokenIdPrevDay: e.target.value});
    }


    handlecalculateReward = (e) => {
        this.setState({calculateRewardArray: e.target.value});
    }

    handleChangeclaimRewardsIds = (e) => {
        this.setState({claimRewardsIds: e.target.value});
    }

    handleChangeStackDays = (e) => {
        this.setState({stackFreezDay: e.target.value});
    }


    getBalanceOfnft = async () => {
        const addressToken = await this.state.marketplace.methods.balanceOf(this.state.account).call();
        // console.log();

        var rewardArray = [];
        for (let i=0; i < Number(addressToken); i++) {
            const tokensId = await this.state.marketplace.methods.tokenOfOwnerByIndex(this.state.account,i).call();
            rewardArray.push(Number(tokensId));
        }
        alert("Staking Nft's Id : "+rewardArray);

    }


    getBalanceOfnftGirl = async () => {
        const ownNfts = await this.state.lostgirltoken.methods.balanceOf(this.state.account).call();
        // this.setState({ownNfts:ownNfts});
        alert(Number(ownNfts));
    }


    getBalanceOfnftOwner = async () => {
        const addressToken = await this.state.marketplace.methods.tokensOfOwner(this.state.address).call();
        alert(addressToken.toString());
    }

    getBalanceOfStak = async() => {
        const addressToken = await this.state.lostStaking.methods.depositsOf(this.state.account).call();

        this.setState({ stackBalance: addressToken })

        alert(addressToken.toString());
    }

    setStart = async () => {
        const thisss = this;
        thisss.setState({ loading: true })

       this.state.marketplace.methods.switchMinting().send({ from: this.state.account})
        .on('transactionHash', function(hash){
            thisss.waitForReceipt(hash, function(response) {
                if(response.status){
                    window.location.reload();
                }else{
                    console.log(response.msg);
                } 
                thisss.setState({ loading: false })
            });
        }).on('error', function(error, receipt) {
            alert(error.message);
            thisss.setState({ loading: false })
        });
    }

    setStartStaking = async () => {
        const thisss = this;
        thisss.setState({ loading: true })

       this.state.lostStaking.methods.unpause().send({ from: this.state.account})
        .on('transactionHash', function(hash){
            thisss.waitForReceipt(hash, function(response) {
                if(response.status){
                    window.location.reload();
                }else{
                    console.log(response.msg);
                } 
                thisss.setState({ loading: false })
            });
        }).on('error', function(error, receipt) {
            alert(error.message);
            thisss.setState({ loading: false })
        });
    }

    setApprovalForAll = async () => {
        const thisss = this;
        thisss.setState({ loading: true })
        
        this.state.marketplace.methods.setApprovalForAll(this.state.stakingAddress , true).send({ from: this.state.account})
        .on('transactionHash', function(hash){
            thisss.waitForReceipt(hash, function (response) {
                if(response.status){
                    window.location.reload();
                }else{
                    console.log(response.msg);
                }
                thisss.setState({ loading: false })
            });
        }).on('error', function(error, receipt) {
            alert(error.message);
            thisss.setState({ loading: false })
        });
    }

    mintToken = async () =>{
        const thisss = this;
        thisss.setState({ loading: true })

        this.state.marketplace.methods.mintBoy(this.state.mintingIndex).send({ from: this.state.account})
        .on('transactionHash', function(hash){
            thisss.waitForReceipt(hash, function (response) {
                if(response.status){
                    window.location.reload();
                }else{
                    console.log(response.msg);
                }
                thisss.setState({ loading: false })
            });
        }).on('error', function(error, receipt) {
            alert(error.message);
            thisss.setState({ loading: false })
        });
    }

    mintGirlToken = async () =>{
        const thisss = this;
        thisss.setState({ loading: true })

        this.state.lostgirltoken.methods.claim(this.state.mintinggirlIndex).send({ from: this.state.account})
        .on('transactionHash', function(hash){
            thisss.waitForReceipt(hash, function (response) {
                if(response.status){
                    window.location.reload();
                }else{
                    console.log(response.msg);
                }
                thisss.setState({ loading: false })
            });
        }).on('error', function(error, receipt) {
            alert(error.message);
            thisss.setState({ loading: false })
        });
    }


    setupdateStackDays = async () => {
        const thisss = this;
        thisss.setState({ loading: true })

        const days = this.state.stackFreezDay;

       this.state.lostStaking.methods.setfreezingDays(days).send({ from: this.state.account})
        .on('transactionHash', function(hash){
            thisss.waitForReceipt(hash, function (response) {
                if(response.status){
                    window.location.reload();
                }else{
                    console.log(response.msg);
                } 
                thisss.setState({ loading: false })
            });
        }).on('error', function(error, receipt) {
            alert(error.message);
            thisss.setState({ loading: false })
        });
    }
    
    addInStacking = async() => {
        const thisss = this;
        thisss.setState({ loading: true })

        const addtoStak = this.state.addStackArray.toString().split(',');

        const values =  await Services.post("verifyRarity", {token_id: addtoStak});
        if(values.data.status){ 

                this.state.lostStaking.methods.deposit(addtoStak, values.data.groupId).send({ from: this.state.account})
                .on('transactionHash', function(hash){
                    thisss.waitForReceipt(hash, function (response) {
                        if(response.status){
                            window.location.reload();
                        }else{
                            console.log(response.msg);
                        } 
                        thisss.setState({ loading: false })
                    });
                }).on('error', function(error, receipt) {
                    alert(error.message);
                    thisss.setState({ loading: false })
                });
        }else{
            alert("in not Database");   
        }
    }

    withdrawNFT = async() => {
        const thisss = this;
        thisss.setState({ loading: true })

        const withStakArray = this.state.withStakArray.toString().split(',');

       this.state.lostStaking.methods.withdraw(withStakArray).send({ from: this.state.account})
        .on('transactionHash', function(hash){
            thisss.waitForReceipt(hash, function (response) {
                if(response.status){
                    window.location.reload();
                }else{
                    console.log(response.msg);
                }
                thisss.setState({ loading: false })
            });
        }).on('error', function(error, receipt) {
            alert(error.message);
            thisss.setState({ loading: false })
        });
    }
    
    calculateReward = async() => {
        const thisss = this;
        thisss.setState({ loading: true })

        const calulateArrayss = this.state.calculateRewardArray.toString().split(',');

        const reward = await this.state.lostStaking.methods.calculateRewards(this.state.account, calulateArrayss).call();
        if(reward){ 
            var rewardArray = [];
            for (let i=0; i < reward.length; i++) {
                // console.log(reward[i]);
                rewardArray.push(Number(Number(reward[i])/100)/100);
            }
            alert(rewardArray);
        }
    }
    
    increaseAllowance = async() => {
        const thisss = this;
        thisss.setState({ loading: true })

        const web3 = window.web3;
        const coinAmount1 = web3.utils.toWei("1000000000", 'Ether'); 

        this.state.lostToken.methods.increaseAllowance(this.state.stakingAddress, coinAmount1).send({ from: this.state.account})
        .on('transactionHash', function(hash){
           thisss.waitForReceipt(hash, function (response) { 
               if(response.status){  
                   window.location.reload();
               }else{
                   console.log(response.msg);
               } 
               thisss.setState({ loading: false })
           });
       }).on('error', function(error, receipt) {
           alert(error.message);
           thisss.setState({ loading: false })
       });
    }

    setOneDayPrev = async() => {
        const thisss = this;
        thisss.setState({ loading: true })

       this.state.lostStaking.methods.setOneDayPrev(this.state.addressPrevDay, Number(this.state.tokenIdPrevDay)).send({ from: this.state.account})
        .on('transactionHash', function(hash){
            thisss.waitForReceipt(hash, function (response) { 
                if(response.status){ 
                    window.location.reload();
                }else{
                    console.log(response.msg);
                } 
                thisss.setState({ loading: false })
            });
        }).on('error', function(error, receipt) {
            alert(error.message);
            thisss.setState({ loading: false })
        });
    }

    claimRewards = async() => {

        const thisss = this;
        thisss.setState({ loading: true });

        const reward = await this.state.lostStaking.methods.calculateRewards(this.state.account, this.state.stackBalance).call();
        if(reward){ 
            var rewardArray = [];
            for (let i=0; i < reward.length; i++) {
                // console.log(reward[i]);
                if((Number(Number(reward[i])/100)/100) > 0){
                    rewardArray.push(Number(this.state.stackBalance[i]));
                }
            }
            
            this.state.lostStaking.methods.claimRewards(rewardArray).send({ from: this.state.account})
            .on('transactionHash', function(hash){
                thisss.waitForReceipt(hash, function (response) { 
                    if(response.status){ 
                        window.location.reload();
                    }else{
                        console.log(response.msg);
                    } 
                    thisss.setState({ loading: false })
                });
            }).on('error', function(error, receipt) {
                alert(error.message);
                thisss.setState({ loading: false })
            });
        }else{
            alert("something is wrong");
        }
    }

    transferNfts = async() => {
        const thisss = this;
        thisss.setState({ loading: true }) 

        // const withStakArray = this.state.withStakArray.toString().split(',');

       this.state.lostgirltoken.methods.safeTransferFrom(this.state.account,'0x8eaD26Bd01A3ADCB01408B23456D15deFb2332f8',5).send({ from: this.state.account})
        .on('transactionHash', function(hash){
            thisss.waitForReceipt(hash, function (response) {
                if(response.status){ 
                    window.location.reload();
                }else{
                    console.log(response.msg);
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
                <Nav />
                <div className="container-fluid mt-5">
                    <div className="row">
                        <main role="main" className="col-lg-6" style={{margin:"auto"}}>
                            <div class="card p-4">  
                            
                                <h2>For Admin</h2>
                                <button type="button" className="btn m-2 btn-primary" onClick={this.setStart}>
                                    Switch Lost boy status 
                                </button>

                                <button type="button" className="btn m-2 btn-primary" onClick={this.setStartStaking}>
                                    Staking Start Sale
                                </button>
                                
                                <div class="form-group card p-3">
                                    <input type="text" value={this.state.addressPrevDay} placeholder="Address" name="addressPrevDay" id="addressPrevDay" class="form-control"  onChange={this.handleaddressPrevDay} />
                                    <input type="number" value={this.state.tokenIdPrevDay} placeholder="Token Id" name="tokenIdPrevDay" id="tokenIdPrevDay" class="form-control"  onChange={this.handletokenIdPrevDay} />
                                    <button type="button" className="btn m-2 btn-primary" onClick={this.setOneDayPrev}>
                                        setOneDayPrev
                                    </button>
                                </div>

                                <div class="form-group card p-3">
                                    <input type="text" value={this.state.stackFreezDay} placeholder="Address" name="stackFreezDay" id="stackFreezDay" class="form-control"  onChange={this.handleChangeStackDays} />
                                    <button type="button" className="btn m-2 btn-primary" onClick={this.setupdateStackDays}>
                                        Set Freez day for Staking
                                    </button>
                                </div>

                                <button type="button" className="btn btn-primary" onClick={this.increaseAllowance}>
                                    Set Allowance for contract limit
                                </button>

                            </div>

                            <div class="card p-4">  
                                <h2>For Users For minting</h2>
                                
                                <div class="form-group card p-3">
                                    <input type="number" value={this.state.mintingIndex}  placeholder="Number Of NFT" name="mintingIndex" id="mintingIndex" class="form-control"  onChange={this.handleChange} />
                                    <button type="button" className="btn m-2 btn-primary" onClick={this.mintToken}> 
                                        Mint NFT
                                    </button>
                                </div>
                                
                                
                                <button type="button" className="btn m-2 btn-primary" onClick={this.getBalanceOfnft}>
                                    get Balance Of
                                </button>

                                <p class="text-center">=====================For Lost Girl===================</p>

                                <div class="form-group card p-3">
                                    <input type="number" value={this.state.mintinggirlIndex}  placeholder="Number Of NFT" name="mintinggirlIndex" id="mintinggirlIndex" class="form-control"  onChange={this.handleChangeGirl} />
                                    <button type="button" className="btn m-2 btn-primary" onClick={this.mintGirlToken}> 
                                        Mint lost Girl NFT
                                    </button>
                                </div>
                                
                                
                                <button type="button" className="btn m-2 btn-primary" onClick={this.getBalanceOfnftGirl}>
                                    get Balance Of
                                </button>


                                {/* <br/>
                                <br/> */}
                                <h2>For Users For Staking</h2>
                                
                                <button type="button" className="btn m-2 btn-primary" onClick={this.setApprovalForAll}>
                                    set Approval For All
                                </button>

                                {/* <div className="form-group">
                                    <div className="row">

                                            <div className="col-sm-4">
                                                <button type="button" className="btn btn-primary"></button>
                                            </div>

                                    </div>
                                </div> */}

                                <div class="form-group card p-3">
                                    <input type="text" value={this.state.addStackArray.toString()}  placeholder="1,2,3" name="handleChangeStack" id="handleChangeStack" class="form-control"  onChange={this.handleChangeStack} />
                                    <button type="button" className="btn btn-primary" onClick={this.addInStacking}> 
                                        Add in Stacking
                                    </button>
                                </div>

                                <button type="button" className="btn m-2 btn-primary" onClick={this.getBalanceOfStak}>
                                    get Balance Of Staking Nfts
                                </button>


                                <div class="form-group card p-3">
                                    <input type="text" value={this.state.claimRewardsIds.toString()} name="handleChangeclaimRewardsIds" id="handleChangeclaimRewardsIds" placeholder="1,2,3" class="form-control"  onChange={this.handleChangeclaimRewardsIds} />
                                    <button type="button" className="btn btn-primary" onClick={this.claimRewards}>
                                        Claim Rewards
                                    </button>
                                </div>


                                <div class="form-group card p-3">
                                    <input type="text" value={this.state.withStakArray.toString()} name="handleChangeWithdraw" id="handleChangeWithdraw" placeholder="1,2,3" class="form-control"  onChange={this.handleChangeWithdraw} />
                                    <button type="button" className="btn btn-primary" onClick={this.withdrawNFT}>
                                        withdraw
                                    </button>
                                </div>


                                <div class="form-group card p-3">
                                    <input type="text" value={this.state.calculateRewardArray.toString()} name="handlecalculateReward" id="handlecalculateReward" placeholder="1,2,3" class="form-control"  onChange={this.handlecalculateReward} />
                                
                                    <button type="button" className="btn btn-primary" onClick={this.calculateReward}>
                                        Calculate Reward
                                    </button>

                                </div>


                            </div>

                             <div className="form-group">
                                <button type="button" className="btn btn-primary" onClick={this.transferNfts}>
                                    Transfer Nft
                                </button>
                            </div>

                            {/*
                            <div className="form-group">
                                <button type="button" className="btn btn-primary" onClick={this.getBalanceOfnftOwner}>
                                   check "0xe4D35CABCBf45B7C99d917f179B98a1e6E37a52F" NFT hold
                                </button>
                            </div>

                            <div className="form-group">
                                <button type="button" className="btn btn-primary" onClick={this.getLostGirlCount}>
                                    Check Lost Girl
                                </button>
                            </div> */}

                        </main>
                    </div>
                </div>
            </>
        );
    }

}

export default Admin;