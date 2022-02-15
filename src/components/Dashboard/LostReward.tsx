import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Row , Col } from "react-bootstrap";
import { connect, intContract } from "../../redux/actions/BlockchainActions";
import { ReducerStateIF } from "../../redux/reducers";

const LostReward = () =>{

    interface NftList {
        id: number;
        name: string;
        tokenUri: string;
    }

    const dispatch = useDispatch();
    const blockchain = useSelector((state:ReducerStateIF) => state.blockchain);
    const [nfts, setNfts] = useState<Array<NftList>>([]);
    const [reward, setReward] = useState(0);
    const [claimNft, setClaimNft] = useState([]);
    const [totalReward, settotalReward] = useState(0);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if(blockchain.LostStaking === null){
            dispatch(intContract());
        }else{
            if(blockchain.account != null){
                getBalanceOfnft();
            } 
        }
    },[blockchain]); 

    const getBalanceOfnft = async () => {

        const addressToken = await blockchain.LostStaking.methods.depositsOf(blockchain.account).call();

        var rewardArray = 0;
        var rewardClaimArray:any = [];
        
        const reward = await blockchain.LostStaking.methods.calculateRewards(blockchain.account, addressToken).call();
        if(reward){ 
            
            for (let i=0; i < reward.length; i++) {
                const calculateRewards = ((Number(reward[i])/100)/100);
                if(calculateRewards > 0){
                    rewardClaimArray.push(addressToken[i]);
                }
                rewardArray = (rewardArray+calculateRewards);
            }
            
        }
        setClaimNft(rewardClaimArray);
        setReward(rewardArray);

        const TotalTokenOfOwner = await blockchain.LostToken.methods.balanceOf(blockchain.account).call();
        settotalReward(blockchain.web3.utils.fromWei(TotalTokenOfOwner));
    }


    const claimRewards = async() => {
        setLoading(true);
        blockchain.LostStaking.methods.claimRewards(claimNft).send({ from: blockchain.account})
        .on('transactionHash', function(hash:any){
            waitForReceipt(hash, function (response:any) {
                setLoading(false); 
                if(response.status){ 
                    alert("Claim reward Successfully");
                }else{
                    console.log(response.msg);
                }
            });
        }).on('error', function(error:any, receipt:any) {
            alert(error.message);
        });
    }


    const waitForReceipt = async (hash:any, cb:any) => {

        blockchain.web3.eth.getTransactionReceipt(hash, function (err:any, receipt :any) {
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
                    waitForReceipt(hash, cb);
              }, 1000);
            }
          });
    } 


    return(
        <>
            <div className="lost_reward" >
                <h5>$LOST REWARD</h5>
                <Row>
                    <Col lg={6} key={1}>
                        <div className="reward_input_main" >
                            <label>Accout Balance</label>
                            <div className="reward_input" >
                                <h6>$LOST</h6>
                                <input type="text" placeholder="00" value={totalReward} disabled/>
                            </div>
                        </div>
                    </Col>

                    <Col lg={6} key={2}>
                        <div className="reward_input_main" >
                            <label>Unclaimed $LOST</label>
                            <div className="reward_input" >
                                <h6>$LOST</h6>
                                <input type="text" placeholder="00" value={reward} disabled/>
                            </div>
                        </div>
                    </Col>
                    <div className="claim_button" >
                        {
                            !loading ? (
                                <button type="button" onClick={claimRewards}>CLAIM</button>
                            ):(
                                <button type="button">process..</button>
                            )
                        }
                    </div>
                </Row>
            </div>
        </>
    );
}

export default LostReward;