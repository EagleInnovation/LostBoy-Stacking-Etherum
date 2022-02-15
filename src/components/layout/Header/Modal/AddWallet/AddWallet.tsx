import "./AddWalletStyle.scss";
import metamask from "../../../../../assets/images/stake/metamask.svg";
import { useState } from 'react';
import { Modal } from 'antd';
import EthTransfer from "../EthTransfer/EthTransfer";

const AddWallet = () =>{
    // CONNECT METAMASK
    const [isModalVisible, setIsModalVisible] = useState(false);
    const showModal = () => {
        setIsModalVisible(true);
    };
    const handleOk = () => {
        setIsModalVisible(false);
    };
    const handleCancel = () => {
        setIsModalVisible(false);
    };
    return(
        <>
            <div className="addwallet_content" >
                <img src={metamask} alt="metamask_icon" />
                <a href="#" className="add_metamask" >
                    <span>+</span>
                    Add WETH to MetaMask
                </a>
                <a href="#" className="add_metamask" >
                    <span>+</span>
                    Add LOOKS to MetaMask
                </a>
                <p>If you're using another wallet, check your wallet's guides for how to add tokens.</p>
                <div className="addwallet_button" >
                    <button>Back</button>
                    <button onClick={showModal} >Ok, done!</button>
                </div>
            </div>
            {/* CONNECT METAMASK */}
            <Modal 
                title="Basic Modal" 
                visible={isModalVisible} 
                onOk={handleOk} 
                onCancel={handleCancel}
                okText="Let's go"
                className="commonbackground ethtransfer_main"
            >
                <EthTransfer />
            </Modal>
        </>
    );
}

export default AddWallet;