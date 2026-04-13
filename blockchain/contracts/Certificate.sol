// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract Certificate {

    struct Cert {
        string studentEmail;
        string ipfsHash;
        string certHash;
    }

    mapping(string => Cert) public certificates;

    function issueCertificate(
        string memory _email,
        string memory _ipfsHash,
        string memory _certHash
    ) public {
        certificates[_certHash] = Cert(_email, _ipfsHash, _certHash);
    }

    function verifyCertificate(string memory _certHash)
        public view returns (bool)
    {
        return bytes(certificates[_certHash].certHash).length > 0;
    }
}