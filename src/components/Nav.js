import React, { Component } from 'react';
import "./Main.css";

class Nav extends Component {

    render() {
        return (
            <>
                <div style={{textAlign:"center", background: "#cfcfcf"}}>
                    <div style={{display:"inline-block",textAlign:"center"}}>
                        <div className="row">
                            <a href="/" style={{padding:"5px",margin:"5px", color:"black"}}><b>NFT</b></a>
                            <a href="/airdrops" style={{padding:"5px",margin:"5px", color:"black"}}><b>AirDrops</b></a>
                        </div>
                    </div>
                </div>
                <hr style={{marginTop:"0px"}}/>
            </>
        )
    }
}

export default Nav;