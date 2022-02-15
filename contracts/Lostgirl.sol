// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

// Imports
import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";
import "./ERC721EnumerableNameable.sol";

contract Lostgirl is ERC721EnumerableNameable {
 
    // Constants
    uint256 private constant MAX_LOSTGIRLS = 10000;
    
    // Public
    bool public claimingEnabled = false;
    bool public tokenEnabled = false;
    mapping(address => uint256) public claims;

    // Private
    bytes32 private snapshotMerkle = "";
    string private baseURI = "";
    
    // External
    constructor(string memory _name, string memory _symbol, string memory _uri) 
        ERC721EnumerableNameable(_name, _symbol) {
        baseURI = _uri;
    }
    
    // Owner
    function toggleClaim () public onlyOwner {
        claimingEnabled = !claimingEnabled;
    }

    function toggleToken () public onlyOwner { 
        tokenEnabled = !tokenEnabled;
    }

    function setSnapshotRoot (bytes32 _merkle) public onlyOwner {
        snapshotMerkle = _merkle;
    }

    function updateNameChangePrice(uint256 _price) public onlyOwner {
		nameChangePrice = _price;
	}

    function updateBioChangePrice(uint256 _price) public onlyOwner {
        bioChangePrice = _price;
    }

    function setBaseURI (string memory _uri) public onlyOwner {
        baseURI = _uri;
    }

    function ownerCollect (uint256 _numLostgirls) public onlyOwner {
        for (uint256 i = 0; i < _numLostgirls; i++) {
            uint256 currentIdx = totalSupply ();
            if (currentIdx < MAX_LOSTGIRLS) {
                _safeMint (msg.sender, currentIdx);
            }
        }
    }
    
    // Public
    function claim (uint256 _numLostgirls) public {
        for (uint256 i = 0; i < _numLostgirls; i++) {
            uint256 currentIdx = totalSupply();
            if (currentIdx < MAX_LOSTGIRLS) {
                _safeMint (msg.sender, currentIdx);
            }
        }
    }

    function _baseURI() internal view override returns (string memory) {
        return baseURI;
    }
            
}