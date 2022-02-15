import "./WelcomeStyle.scss";
import background from "../../../../../assets/images/stake/hero_Background.png";
import { useState } from 'react';
import { Modal } from 'antd';
import AddWallet from "../AddWallet/AddWallet";

const Welcome = () =>{
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
            <div className="welcome_content" >
                <img src={background} alt="background" />
                <div className="welcome_subcontent" >
                    <h5>Welcome to LostBoy!</h5>
                    <p>By using LookeRare, you agree to the <a href="#" >Terms of Service.</a></p>
                    <form className="checkbox_main" >
                        <div className="form-group" >
                            <input type="checkbox" id="html" />
                            <label htmlFor="html" >I Agree</label>
                        </div>
                    </form>
                    <button onClick={showModal} >Let's go</button>
                </div>
            </div>

            {/* CONNECT METAMASK */}
            <Modal 
                title="Basic Modal" 
                visible={isModalVisible} 
                onOk={handleOk} 
                onCancel={handleCancel}
                okText="Let's go"
                className="commonbackground addwallet_main"
            >
                <AddWallet />
            </Modal>
        </>
    );
}

export default Welcome;