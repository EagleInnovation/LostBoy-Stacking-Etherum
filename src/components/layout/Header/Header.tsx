
import { useState, useEffect } from 'react';
import "./HeaderStyle.scss";
import { Navbar , Container , Nav } from "react-bootstrap";
import discord from "../../../assets/images/stake/discord.png";
import instagram from "../../../assets/images/stake/instagram.png";
import twitter from "../../../assets/images/stake/twitter.png";
import discord_black from "../../../assets/images/stake/discord_black.png";
import instagram_black from "../../../assets/images/stake/instagram_black.png";
import twitter_black from "../../../assets/images/stake/twitter_black.png";
import { Modal } from 'antd';
import Welcome from "./Modal/Welcome/Welcome";
import { useMetamask } from "use-metamask";
import Web3 from 'web3';
import "./Modal/Welcome/WelcomeStyle.scss"
import lostboyContract from '../../../abis/LostBoyTest.json';
import background from "../../../assets/images/stake/hero_Background.png";
import metamask from "../../../assets/images/stake/metamask.svg";
import "./Modal/AddWallet/AddWalletStyle.scss"
import ethereum from "../../../assets/images/stake/ethereum.svg";
import "./Modal/EthTransfer//EthTransferStyle.scss"
declare global {
    interface Window { ethereum: any; 
        web3:any;
    }
  }
const Header = () => {
   
    const [search, setSearch] = useState('');
    const [navbarMain, setNavbar] = useState(false);
    const [welcomePopup, setWelcomePopup] = useState(true);
    const [welcomeshow, setWelcomeshow] = useState(false);
    const [accounts, setAccount] = useState<any>();
 
  var web3 = new Web3(Web3.givenProvider);
    const connectWallet = async () =>{
        if (window.ethereum) {
            window.web3 = new Web3(window.ethereum)
            await window.ethereum.enable();
        } else if (window.web3) {
            window.web3 = new Web3(window.web3.currentProvider)
          
           
          } else {
            window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
          }
        
          web3.eth.getAccounts().then(e => setAccount(e?.[0]));
    }
    const checkConnection = async () => {

        // Check if browser is running Metamask
        let web3: any;
        if (window.ethereum) {
            web3 = new Web3(window.ethereum);
        } else if (window.web3) {
            web3 = new Web3(window.web3.currentProvider);
        };

        // Check if User is already connected by retrieving the accounts
        web3.eth.getAccounts()
            .then(async (addr: string) => {
                setAccount(addr[0]);
            });
    };
    checkConnection();
    useEffect(() => {
        checkConnection();
      }, []);
      useEffect(() => {
       if(accounts){
      let TokenAdded : any =  localStorage.getItem("addtoken");
        if(TokenAdded == null){
            showModal();
        }
       
       }
      }, [accounts]);
     
    const changeBackground = () =>{
        if(window.scrollY >= 80){
            setNavbar(true)
        } else{
            setNavbar(false);
        }
    };
    const sendtRequest = async () =>{
        localStorage.setItem("addtoken", "Lost");
        const tokenAddress = '0xd00981105e61274c8a5cd5a88fe7e037d935b513';
        const tokenSymbol = 'LOST';
        const tokenDecimals = 18;
        const tokenImage = 'https://gateway.pinata.cloud/ipfs/QmUVMmK1vkh6E6Czo9TgNkEczC42xDTr345c9kBeNGfVjG';

        try {
        // wasAdded is a boolean. Like any RPC method, an error may be thrown.
        const wasAdded = await window.ethereum.request({
            method: 'wallet_watchAsset',
            params: {
            type: 'ERC20', // Initially only supports ERC20, but eventually more!
            options: {
                address: tokenAddress, // The address that the token is at.
                symbol: tokenSymbol, // A ticker symbol or shorthand, up to 5 chars.
                decimals: tokenDecimals, // The number of decimals in the token
                image: tokenImage, // A string url of the token logo
            },
            },
        });

        if (wasAdded) {
            console.log('Thanks for your interest!');
        } else {
            console.log('Your loss!');
        }
        } catch (error) {
        console.log(error);
        }
    }
    window.addEventListener('scroll', changeBackground);

    // CONNECT METAMASK
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [waletAddshow, setWaletAddshow] = useState(false);
    const [transfershow, setTransfershow] = useState(false);
    const showModal = () => {
        setWelcomeshow(true)
        setWaletAddshow(false);
        setTransfershow(false);
    };
    const handleOk = () => {
        setWelcomeshow(false);
    };
    const handleCancel = () => {
        setWelcomeshow(false);
    };

    const showAddModal = () => {
        setWelcomeshow(false)
        setWaletAddshow(true);
        setTransfershow(false);
    };
    const handleAddOk = () => {
        setWaletAddshow(false);
    };
    const handleAddCancel = () => {
        setWaletAddshow(false);
    };
    const showTransferModal = () => {
        setWelcomeshow(false)
        setWaletAddshow(false);
        setTransfershow(true)
    };
    const handleTransferOk = () => {
        setTransfershow(false);
    };
    const handleTransferCancel = () => {
        setTransfershow(false);
    };
   
    return(
        <>
            <div id="navbar" >
                <Navbar collapseOnSelect expand="lg" variant="dark" fixed="top" className={navbarMain ? 'navbarMain active' : 'navbarMain' } >
                    <Container>
                        <Navbar.Brand href="#home"></Navbar.Brand>
                        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                        <Navbar.Collapse id="responsive-navbar-nav">
                            <Nav>
                                <Nav.Link href="#">STORY</Nav.Link>
                                <Nav.Link href="#">MISSION</Nav.Link>
                                <Nav.Link href="#">ROADMAP</Nav.Link>
                                <Nav.Link href="#">TEAM</Nav.Link>
                                <Nav.Link href="#">FAQ</Nav.Link>
                                <Nav.Link href="#">MEMBERS</Nav.Link>
                            </Nav>
                            <Nav className="social_white" >
                                <Nav.Link href="#" ><img src={discord} alt="discord" /></Nav.Link>
                                <Nav.Link href="#" ><img src={instagram} alt="instagram" /></Nav.Link>
                                <Nav.Link href="#" ><img src={twitter} alt="twitter" /></Nav.Link>
                                
                                {! accounts && <Nav.Link href="#" onClick={connectWallet} ><svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M20.6444 3.75C24.9556 3.75 27.5 6.23074 27.5 10.4773H22.2111V10.5206C19.7565 10.5206 17.7667 12.4606 17.7667 14.8538C17.7667 17.2469 19.7565 19.1869 22.2111 19.1869H27.5V19.5769C27.5 23.7693 24.9556 26.25 20.6444 26.25H9.35556C5.04445 26.25 2.5 23.7693 2.5 19.5769V10.4231C2.5 6.23074 5.04445 3.75 9.35556 3.75H20.6444ZM26.5667 12.3405C27.0821 12.3405 27.5 12.7479 27.5 13.2505V16.4137C27.494 16.9138 27.0796 17.3178 26.5667 17.3237H22.3111C21.0685 17.34 19.9819 16.5105 19.7 15.3304C19.5589 14.5979 19.757 13.842 20.2413 13.2653C20.7257 12.6886 21.4467 12.3501 22.2111 12.3405H26.5667ZM22.8111 13.803H22.4C22.1476 13.8001 21.9045 13.8958 21.725 14.0688C21.5455 14.2418 21.4444 14.4777 21.4444 14.7238C21.4444 15.2401 21.8705 15.6603 22.4 15.6662H22.8111C23.3389 15.6662 23.7667 15.2491 23.7667 14.7346C23.7667 14.2201 23.3389 13.803 22.8111 13.803ZM15.4778 8.61399H8.42222C7.89879 8.61395 7.47275 9.02449 7.46667 9.53479C7.46667 10.0511 7.89269 10.4713 8.42222 10.4773H15.4778C16.0055 10.4773 16.4333 10.0601 16.4333 9.54562C16.4333 9.03109 16.0055 8.61399 15.4778 8.61399Z" fill="white"/>
</svg>
</Nav.Link>}
{/* {accounts && <span>{accounts.substring(0, 5)+'...<br>...'+accounts.substr(accounts.length - 4)}</span>} */}
                            </Nav>
                            <Nav className="social_black" >
                                <Nav.Link href="#" ><img src={discord_black} alt="discord" /></Nav.Link>
                                <Nav.Link href="#" ><img src={instagram_black} alt="instagram" /></Nav.Link>
                                <Nav.Link href="#" ><img src={twitter_black} alt="twitter" /></Nav.Link>
                                {!accounts && <Nav.Link href="#" onClick={connectWallet} >
                                <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M20.6444 2C24.9556 2 27.5 4.48074 27.5 8.72725H22.2111V8.77058C19.7565 8.77058 17.7667 10.7106 17.7667 13.1038C17.7667 15.4969 19.7565 17.4369 22.2111 17.4369H27.5V17.8269C27.5 22.0193 24.9556 24.5 20.6444 24.5H9.35556C5.04444 24.5 2.5 22.0193 2.5 17.8269V8.67309C2.5 4.48074 5.04444 2 9.35556 2H20.6444ZM26.5667 10.5905C27.0821 10.5905 27.5 10.9979 27.5 11.5005V14.6637C27.494 15.1638 27.0796 15.5678 26.5667 15.5737H22.3111C21.0685 15.59 19.9819 14.7605 19.7 13.5804C19.5589 12.8479 19.757 12.092 20.2413 11.5153C20.7257 10.9386 21.4467 10.6001 22.2111 10.5905H26.5667ZM22.8111 12.053H22.4C22.1476 12.0501 21.9045 12.1458 21.725 12.3188C21.5455 12.4918 21.4444 12.7277 21.4444 12.9738C21.4444 13.4901 21.8705 13.9103 22.4 13.9162H22.8111C23.3388 13.9162 23.7667 13.4991 23.7667 12.9846C23.7667 12.4701 23.3388 12.053 22.8111 12.053ZM15.4778 6.86399H8.42222C7.89879 6.86395 7.47275 7.27449 7.46667 7.78479C7.46667 8.30109 7.89269 8.72132 8.42222 8.72725H15.4778C16.0055 8.72725 16.4333 8.31015 16.4333 7.79562C16.4333 7.28109 16.0055 6.86399 15.4778 6.86399Z" fill="black"/>
                                </svg>
                                </Nav.Link>}
                                {/* {accounts && <span>{accounts.substring(0, 5)+'...<br>...'+accounts.substr(accounts.length - 4)}</span>} */}
                            </Nav>
                        </Navbar.Collapse>
                    </Container>
                </Navbar>
            </div>

            {/* Welcome Modal Start */}
            <Modal 
                title="Basic Modal" 
                visible={welcomeshow} 
                onOk={handleOk} 
                onCancel={handleCancel}
                okText="Let's go"
                className="commonbackground welcome_lookrare"
            >
                <div className="welcome_content" >
                <img src={background} alt="background" />
                <div className="welcome_subcontent" >
                    <h5>Welcome to LostBoy!</h5>
                    <p>By using LookeRare, you agree to the <a href="#" >Terms of Service.</a></p>
                    <form className="checkbox_main" >
                        <div className="form-group" >
                            <input type="checkbox" id="html" onClick={() =>setWelcomePopup(false)} />
                            <label htmlFor="html" >I Agree</label>
                        </div>
                    </form>
                    <button onClick={showAddModal} disabled={welcomePopup}>Let's go</button>
                </div>
            </div>
            </Modal>
              {/* Welcome Modal Stop */}

                 {/* Add Token Modal Start */}
            <Modal 
                title="Basic Modal" 
                visible={waletAddshow} 
                onOk={handleAddOk} 
                onCancel={handleAddCancel}
                okText="Let's go"
                className="commonbackground welcome_lookrare"
            >
                <div className="addwallet_content" >
                <img src={metamask} alt="metamask_icon" />
                <a href="#" className="add_metamask" >
                    <span>+</span>
                    Add WETH to MetaMask
                </a>
                <a href="#" onClick={sendtRequest} className="add_metamask" >
                    <span>+</span>
                    Add LOOKS to MetaMask
                </a>
                <p>If you're using another wallet, check your wallet's guides for how to add tokens.</p>
                <div className="addwallet_button" >
                    <button onClick={showModal}>Back</button>
                    <button onClick={showTransferModal} >Ok, done!</button>
                </div>
            </div>
            </Modal>
            {/* Add Token Modal Start */}

            <Modal 
                title="Basic Modal" 
                visible={transfershow} 
                onOk={handleTransferOk} 
                onCancel={handleTransferCancel}
                okText="Let's go"
                className="commonbackground welcome_lookrare"
            >
                 <div className="ethtransfer_content addwallet_content" >
                <img src={ethereum} alt="metamask_icon" />
                <p>You can swap WETH to ETH any time from the profile/wallet icon in the menu.</p>
                <form className="checkbox_main" >
                    <div className="form-group" >
                        <input type="checkbox" id="html1" />
                        <label htmlFor="html1" >I Understand</label>
                    </div>
                </form>
                <div className="addwallet_button" >
                    <button onClick={showAddModal}>Back</button>
                    <button onClick={handleTransferOk}>Let's go</button>
                </div>
            </div>
            </Modal>
        </>
    ); 
}


export default Header;