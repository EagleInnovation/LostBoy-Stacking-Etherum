import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";

import "./StakeStyle.scss";
import { Row , Col } from "react-bootstrap";
// import lost1 from "../../../assets/images/home/lost1.png";
// import lost2 from "../../../assets/images/home/lost2.png";
// import lost3 from "../../../assets/images/home/lost3.png";
// import lost4 from "../../../assets/images/home/lost4.png";
import sign from "../../../assets/images/home/home_icon.svg";

import { connect, intContract } from "../../../redux/actions/BlockchainActions";
import { ReducerStateIF } from "../../../redux/reducers";

const Stake = () =>{

    interface NftList {
        id: number;
        name: string;
        tokenUri: string;
    }
    const dispatch = useDispatch();
    const blockchain = useSelector((state:ReducerStateIF) => state.blockchain);
    const [nfts, setNfts] = useState<Array<NftList>>([]);
    const [unstakingNft, setUnstakingNft] = useState([] as any);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if(blockchain.LostBoyTest === null){
            dispatch(intContract());
        }else{
            if(blockchain.account != null){
                setLoading(true);
                getBalanceOfnft();
            } 
        }
    },[blockchain]);

    const withdrawFromStack = async() => {
        if(unstakingNft.length > 0){
            setLoading(true);
            blockchain.LostStaking.methods.withdraw(unstakingNft).send({ from: blockchain.account})
            .on('transactionHash', function(hash:any){
                waitForReceipt(hash, function (response:any) {
                    if(response.status){ 
                        alert("Claim reward Successfully");
                        setTimeout(() => {
                            getBalanceOfnft();
                        }, 500);
                    }else{
                        console.log(response.msg);
                    }
                    setLoading(false);
                });
            }).on('error', function(error:any, receipt:any) {
                alert(error.message);
                setLoading(false);
            });
        }else{
            alert("Please select unstacked Nft's");
        }
    }

    const getBalanceOfnft = async () => {
        const addressToken = await blockchain.LostStaking.methods.depositsOf(blockchain.account).call();

        var rewardArray:Array<NftList> = [];
        for (let i=0; i < addressToken.length; i++) {
            let tokenURI = await blockchain.LostBoyTest.methods.tokenURI(Number(addressToken[i])).call();
            const metadata = await (await fetch(String(tokenURI))).json();
        
            rewardArray.push({
                id: Number(addressToken[i]),
                name: metadata.name,
                tokenUri: metadata.animation_url 
            });
        }
        setNfts(rewardArray);
        setLoading(false); 
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

    const onIngredientChange = (event:any) => {
        const selectedId:number = event.target.value;
        if (unstakingNft.includes(Number(selectedId))) { 
            const newIds = unstakingNft.filter((id:number) => Number(id) !== Number(selectedId));
            setUnstakingNft(newIds);
        } else {
            const newIds = [...unstakingNft, Number(selectedId)];
            setUnstakingNft(newIds);
        }
    };

    return(
        <>
            <div className="stake_section" >
                <h5 className="stake_head" >STAKED LOSTBOYS</h5>
                {!loading?(
                    <>
                        <div className="stake_subsection" >
                            {(nfts.length > 0)?(
                                <Row>
                                    {nfts.map((d: any, i:any) => (
                                        <Col key={i} xl={4} md={4} sm={4} xs={4} >
                                            <div className="unstake_list" >
                                                <input type="checkbox" id={d.id} value={d.id} onChange={(e) => onIngredientChange(e)}/>
                                                <label htmlFor={d.id} >
                                                    <video src={d.tokenUri} width="110" height="110"></video>
                                                    <span></span>
                                                    <img src={sign} alt="true" />
                                                </label>
                                                <p>{d.name}</p>
                                            </div>
                                        </Col>
                                    ))}
                                </Row>
                            ):(
                                <h4>No Items Found</h4>
                            )}
                            
                        </div>
                        {(unstakingNft.length>0)?(
                            <button type="button" className="white_button" onClick={withdrawFromStack}>UNSTAKE</button>
                        ):(
                            <button type="button" className="white_button" disabled>UNSTAKE</button>
                        )}
                    </>
                ):(
                        <h2>Loading...</h2>
                )}   
            </div>
            
        </>
    );
}

export default Stake;