// contracts/GLDToken.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.3;

import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";


contract LostToken is ERC20, ERC20Burnable {
    constructor() ERC20("Lost Boy", "LOST") {
        _mint(msg.sender, 200000000 * 10**18 );
    }
}