// SPDX-License-Identifier: MIT
pragma solidity ^0.5.16;

contract SystemIntegrity {
    string private storedHash;

    function storeHash(string memory hash) public {
        storedHash = hash;
    }

    function getHash() public view returns (string memory) {
        return storedHash;
    }
}
