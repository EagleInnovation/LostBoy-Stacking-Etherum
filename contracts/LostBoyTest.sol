// SPDX-License-Identifier: MIT


pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

 
contract LostBoyTest is ERC721Enumerable, Ownable {

    using SafeMath for uint256;

    // Private members
    enum MemberClaimStatus { Invalid, Listed }                                  // Members, listed? 
    mapping (address => MemberClaimStatus) private _whiteListedMembers;         // Whitelisted members for presale
    mapping (address => uint256) private _whiteListMints;                       // Whitelisted mints per address
    string private m_BaseURI = "";                                              // Base URI

    // Supply / sale variables
    uint256 public MAX_LOSTBOYS = 10000;                                        // Maximum supply
    uint256 public MAX_PRESALE_BOYS_PER_ADDRESS = 50;                           // Total maximum boys for whitelisted wallet
    uint256 public lostBoyPrice = 50000000000000000;                            // 0.05 ETH

    // Per TX
    uint public maxBoysPerMint = 15;                                            // Max lostboys in one go !
    uint public maxBoysPerPresaleMint = 25;                                     // Max pre-sale lostboys in one go !

    // Active?!
    bool public mintingActive = false;                                          // Minting active
    bool public isPresaleActive = false;                                        // Presale active

    // Provenance
    string public provenanceHash = "";                                          // Provencance, data integrity

    // Donation
    uint public donationPercentage = 10;                                        // Percent to donate to charity wallet
    address public donationWallet = 0x9715f6a7510AA98D4F8eB8E17C9e01859a05937A; // The charity wallet all donations will go to when balance is withdrawn

    constructor(
        string memory name,
        string memory symbol,
        string memory baseURI
    ) ERC721(name, symbol) {
        m_BaseURI = baseURI;
    }

    // withdrawBalance
    //  -   Withdraws balance to contract owner
    //  -   Automatic withdrawal of donation 
    function withdrawBalance() public onlyOwner {
        // Get the total balance
        uint256 balance = address(this).balance;

        // Get share to send to donation wallet (10 % charity donation)
        uint256 donationShare = balance.mul(donationPercentage).div(100);
        uint256 ownerShare = balance.sub(donationShare);
        
        // Transfer respective amounts
        payable(msg.sender).transfer(ownerShare);
        payable(donationWallet).transfer(donationShare);
    }

    // reserveBoys
    //  -   Reserves lostboys for owner
    //  -   Used for giveaways/etc
    function reserveBoys(uint256 quantity) public onlyOwner {
        for(uint i = 0; i < quantity; i++) {
            uint mintIndex = totalSupply();
            if (mintIndex < MAX_LOSTBOYS) {
                _safeMint(msg.sender, mintIndex);
            }
        }
    }

    // Mint boy
    //  -   Mints lostboys by quantities
    function mintBoy(uint numberOfBoys) public payable  {
        require(mintingActive, "Minting is not activated yet.");
        require(numberOfBoys > 0, "Why are you minting less than zero boys.");
        require(
            totalSupply().add(numberOfBoys) <= MAX_LOSTBOYS,
            'Only 10,000 boys are available'
        );
        require(numberOfBoys <= maxBoysPerMint, "Cannot mint this number of boys in one go !");
        // require(lostBoyPrice.mul(numberOfBoys) <= msg.value, 'Ethereum sent is not sufficient.');

        for(uint i = 0; i < numberOfBoys; i++) {
            uint mintIndex = totalSupply();
            if (totalSupply() < MAX_LOSTBOYS) {
                _safeMint(msg.sender, mintIndex);
            }
        }
    }
    
    // mintBoyAsMember
    //  -   Mints lostboy as whitelisted member
     function mintBoyAsMember(uint numberOfBoys) public payable {
        require(isPresaleActive, "Presale is not active yet.");
        require(numberOfBoys > 0, "Why are you minting less than zero boys.");
        require(_whiteListedMembers[msg.sender] == MemberClaimStatus.Listed, "You are not a whitelisted member !");
        require(_whiteListMints[msg.sender].add(numberOfBoys) <= MAX_PRESALE_BOYS_PER_ADDRESS, "You are minting more than your allowed presale boys!");
        require(totalSupply().add(numberOfBoys) <= MAX_LOSTBOYS, "Only 10,000 boys are available");
        require(numberOfBoys <= maxBoysPerPresaleMint, "Cannot mint this number of presale boys in one go !");
        // require(lostBoyPrice.mul(numberOfBoys) <= msg.value, 'Ethereum sent is not sufficient.');
        
        for(uint i = 0; i < numberOfBoys; i++) {
            uint mintIndex = totalSupply();
            if (totalSupply() < MAX_LOSTBOYS) {
                _safeMint(msg.sender, mintIndex);
                _whiteListMints[msg.sender] = _whiteListMints[msg.sender].add(1);
            }
        }
    }

    // addToWhitelist
    //  -   Adds discord/invited members to presale whitelist
    function addToWhitelist(address[] memory members) public onlyOwner {
        for (uint256 i = 0; i < members.length; i++) {
            _whiteListedMembers[members[i]] = MemberClaimStatus.Listed;
            _whiteListMints[members[i]] = 0;
        }
    }

    // isWhitelisted
    //  -   Public helper to check if an address is whitelisted
    function isWhitelisted (address addr) public view returns (bool) {
        return _whiteListedMembers[addr] == MemberClaimStatus.Listed;
    }

    // setDonationAddress
    //  -   Emergency function to update the donation charity wallet in case
    function setCharityWalletAddress (address charityAddress) public onlyOwner {
        donationWallet = charityAddress;
    }

    // switchMinting
    //  -   Allows, disallows minting
    function switchMinting() public onlyOwner {
        mintingActive = !mintingActive;
    }

    // switchPresale
    //  -   Allows, disallows presale
    function switchPresale() public onlyOwner {
        isPresaleActive = !isPresaleActive;
    }

    // setMaxQuantityPerMint
    //  -   Sets the maximum mints per tx
    function setMaxQuantityPerMint (uint256 quantity) public onlyOwner {
        maxBoysPerMint = quantity;
    }

     // setMaxQuantityPerPresaleMint
    //  -   Sets the maximum mints per tx for presale
    function setMaxQuantityPerPresaleMint (uint256 quantity) public onlyOwner {
        maxBoysPerPresaleMint = quantity;
    }
    
    // setPresaleMaxPerWallet
    //  -   Emergency function to update the max per presale wallet
    function setMaxPerPresaleWallet (uint256 quantity) public onlyOwner {
        MAX_PRESALE_BOYS_PER_ADDRESS = quantity;
    }
    
    // setBaseURI
    //  -  Metadata lives here
    function setBaseURI(string memory baseURI) external onlyOwner() {
        m_BaseURI = baseURI;
    }

    // _baseURI
    function _baseURI() internal view override returns (string memory) {
        return m_BaseURI;
    }

    // setProvenance
    //  -   Provenance for data integrity
    function setProvenance(string memory _provenance)
        external
        onlyOwner
    {
        provenanceHash = _provenance;
    }

}
