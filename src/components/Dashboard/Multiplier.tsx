import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { connect, intContract } from "../../redux/actions/BlockchainActions";
import { ReducerStateIF } from "../../redux/reducers";

const Multiplier = () =>{

    const dispatch = useDispatch();
    const blockchain = useSelector((state:ReducerStateIF) => state.blockchain);
    const [totalGirl, settotalGirl] = useState(0);
    const [lostPer, setLostPer] = useState(0);

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

        const totalLostGirl = await blockchain.Lostgirl.methods.balanceOf(blockchain.account).call();
        const total = Number(totalLostGirl);
        console.log(total);
        settotalGirl(total);

        if(total > 0 && total <= 3){
            setLostPer(1.15);
        }else if(total > 3 && total <= 6){
            setLostPer(1.35);
        }else if(total > 6 && total <= 9){
            setLostPer(1.5);
        }else if(total > 9 && total <= 15){
            setLostPer(1.75);
        }else if(total > 15){
            setLostPer(2);
        }
    }

    return(
        <>
            <div className="multiplier_main" >
                <button type="button" >MULTIPLIER</button>
                <div className="multiplier_subsection" >
                    <input type="text" value={totalGirl} disabled />
                    <h6>LOSTGIRLS = {lostPer}X</h6>
                </div>
            </div>
        </>
    );
}
 
export default Multiplier;