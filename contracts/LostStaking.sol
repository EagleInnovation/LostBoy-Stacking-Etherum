// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/IERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/math/Math.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";


contract LostStaking is Ownable, IERC721Receiver, ReentrancyGuard, Pausable {
    using EnumerableSet for EnumerableSet.UintSet; 
    
    //addresses 
    address nullAddress = 0x0000000000000000000000000000000000000000;
    address public stakingDestinationAddress;
    address public stakingLostGirlAddr;
    address public erc20Address;
    address public ownerAddr;

    //uint256's 
    uint256 public expiration;
  
    // mappings 
    mapping(address => EnumerableSet.UintSet) _deposits;
    mapping(address => mapping(uint256 => uint256)) _depositBlocks;
    mapping(address => mapping(uint256 => uint256)) _depositBlocksTmp;
    mapping(address => mapping(uint256 => uint256)) _depositRarity;
    mapping(uint256 => uint256) _rewardArray;
    mapping(uint256 => uint256) _rewardRarity;

    constructor(
      address _stakingDestinationAddress, // Nft Contract Address
      address _stakingLostGirlAddress, //nft Contract girl
      uint256 _expiration,  //in days
      address _erc20Address, // Token address
      uint256[] memory rewardArray,
      uint256[] memory rewardRarity
    ) {
        stakingLostGirlAddr = _stakingLostGirlAddress;
        stakingDestinationAddress = _stakingDestinationAddress;
        expiration = block.timestamp * (_expiration * 1 days);
        erc20Address = _erc20Address;
        ownerAddr = msg.sender;
        
        for (uint256 i; i < rewardArray.length; i++) {
            _rewardArray[i] = rewardArray[i];
        }

        for (uint256 i; i < rewardRarity.length; i++) {
            _rewardRarity[i] = rewardRarity[i];
        }
        
        _pause();
    }

    modifier isExpired() {
        require(0 < ((expiration - block.timestamp) / 60 / 60 / 24), "Close Staking");
        _;
    }

    function pause() external onlyOwner {
        _pause();
    }

    function unpause() external onlyOwner {
        _unpause();
    }

    function setOneDayPrev(address account, uint256 tokenId) external onlyOwner(){
        _depositBlocksTmp[account][tokenId] = _depositBlocksTmp[account][tokenId] - 1 days;
        _depositBlocks[account][tokenId] = _depositBlocks[account][tokenId] - 1 days;
    }

    /* STAKING MECHANICS */

    // Set a multiplier for how many to0x3E6DEab9Cb952b29FcDCC2f4F88bE8E1858B50Bckens to earn each time a block passes.
    function updateReward(uint256[] memory _updateReward) external onlyOwner() {
        for (uint256 i; i < _updateReward.length; i++) {
            _rewardArray[i] = _updateReward[i];
        }
    }

    // Set a multiplier for how many tokens to earn each time a block passes.
    function updateRarity(uint256[] memory _updateRarity) external onlyOwner() {
        for (uint256 i; i < _updateRarity.length; i++) {
            _rewardRarity[i] = _updateRarity[i];
        }
    }

    // Set this to a block to disable the ability to continue accruing tokens past that block number.
    function setExpiration(uint256 _expiration) external onlyOwner() {
        expiration = block.timestamp * (_expiration * 1 days);
    }

    //check Lostboy Balance. 
    function balanceOfLostGirl(address account, uint256 tokens) external view returns (uint256 balance) {
        uint256 balanceOfd = IERC721(stakingLostGirlAddr).balanceOf(account);
        
        if(balanceOfd > 0 && balanceOfd <= 3){
            return (tokens*_rewardArray[0]);
        }else if(balanceOfd >= 4 && balanceOfd <= 6){
            return (tokens*_rewardArray[1]);
        }else if(balanceOfd >= 7 && balanceOfd <= 9){
            return (tokens*_rewardArray[2]);
        }else if(balanceOfd >= 10 && balanceOfd <= 15){
            return (tokens*_rewardArray[3]);
        }else if(balanceOfd > 15){
            return (tokens*_rewardArray[4]);
        }
        return (tokens*100);
    }

    //check deposit amount. 
    function depositsOf(address account) external view returns (uint256[] memory) {
      EnumerableSet.UintSet storage depositSet = _deposits[account];
      uint256[] memory tokenIds = new uint256[] (depositSet.length());

      for (uint256 i; i < depositSet.length(); i++) {
        tokenIds[i] = depositSet.at(i);
      }
      return tokenIds;
    }

    function calculateRewards(address account, uint256[] memory tokenIds) external view returns (uint256[] memory rewards) 
    {
      rewards = new uint256[](tokenIds.length);

      for (uint256 i; i < tokenIds.length; i++) {

            uint256 tokenId = tokenIds[i];
        
            if(_deposits[account].contains(tokenId)){
                uint256 diff = (block.timestamp - _depositBlocks[account][tokenId]) / 60 / 60 / 24;
                uint256 tokenCount = _rewardRarity[_depositRarity[account][tokenId]] * diff;
                rewards[i] = this.balanceOfLostGirl(account, tokenCount);
            }else{
                rewards[i] = 0;
            }
        
      }

      return rewards;
    }

    //reward amount by address/tokenIds[]
    function calculateReward(address account, uint256 tokenId) public view isExpired returns (uint256) {
        uint256 diff = (block.timestamp - _depositBlocks[account][tokenId]) / 60 / 60 / 24;
        uint256 totalToken = (_rewardRarity[_depositRarity[account][tokenId]] * ((_deposits[account].contains(tokenId) ? 1 : 0) * diff));
        return this.balanceOfLostGirl(account, totalToken);
    }

    //reward claim function 
    function claimRewards(uint256[] calldata tokenIds) public whenNotPaused {
        uint256 reward; 
        uint256 blockCur = block.timestamp;

        for (uint256 i; i < tokenIds.length; i++) {
            reward += calculateReward(msg.sender, tokenIds[i]);

            _depositBlocks[msg.sender][tokenIds[i]] = blockCur;
        }
        
        if (reward > 0) {
            IERC20(erc20Address).transferFrom(ownerAddr, msg.sender, (((reward * 10**18)/100)/100));
        } 
    }

    //deposit function. 
    function deposit(uint256[] calldata tokenIds, uint256[] calldata _rarity) external whenNotPaused {
        require(msg.sender != stakingDestinationAddress, "Invalid address");
        claimRewards(tokenIds);

        for (uint256 i; i < tokenIds.length; i++) {
            uint256 blockCur1 = block.timestamp;
            _depositBlocksTmp[msg.sender][tokenIds[i]] = blockCur1;
            _depositRarity[msg.sender][tokenIds[i]] = _rarity[i];
            
            IERC721(stakingDestinationAddress).safeTransferFrom(
                msg.sender,
                address(this),
                tokenIds[i],
                ""
            );

            _deposits[msg.sender].add(tokenIds[i]);
        }
    }

    //withdrawal function.
    function withdraw(uint256[] calldata tokenIds) external whenNotPaused nonReentrant() {
        claimRewards(tokenIds);

        for (uint256 i; i < tokenIds.length; i++) {
            require( _deposits[msg.sender].contains(tokenIds[i]), "Staking: token not deposited");
            uint256 diff = (block.timestamp - _depositBlocksTmp[msg.sender][tokenIds[i]]) / 60 / 60 / 24;
        
            _deposits[msg.sender].remove(tokenIds[i]);

            IERC721(stakingDestinationAddress).safeTransferFrom(
                address(this),
                msg.sender,
                tokenIds[i],
                ""
            );
        }
    }
 
    function onERC721Received(
        address,
        address,
        uint256,
        bytes calldata
    ) external pure override returns (bytes4) {
        return IERC721Receiver.onERC721Received.selector;
    }
}