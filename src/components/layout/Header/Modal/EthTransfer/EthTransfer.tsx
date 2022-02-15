import "./EthTransferStyle.scss";
import ethereum from "../../../../../assets/images/stake/ethereum.svg";

const EthTransfer = () =>{
    return(
        <>
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
                    <button>Back</button>
                    <button>Let's go</button>
                </div>
            </div>
        </>
    );
}

export default EthTransfer;